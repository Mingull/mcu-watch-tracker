import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { timeline, type Entry } from "../data/timeline";

const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
	throw new Error("Missing TMDB_API_KEY. Add it to your .env.local file.");
}

const API_BASE = "https://api.themoviedb.org/3";
const POSTER_LIMIT = 10;
const THUMBNAIL_LIMIT = 10;

type MediaType = "movie" | "tv";

type SearchResult = {
	id: number;
	title?: string;
	name?: string;
	release_date?: string;
	first_air_date?: string;
	poster_path?: string | null;
	backdrop_path?: string | null;
	popularity?: number;
};

type SearchResponse = {
	results: SearchResult[];
};

type Image = {
	file_path: string;
	vote_average?: number;
	vote_count?: number;
};

type ImagesResponse = {
	posters?: Image[];
	backdrops?: Image[];
};

type PosterResult = {
	name: string;
	posterPaths: string[];
	thumbnailPaths: string[];
	tmdbId?: number;
	matchedTitle?: string;
	mediaType: MediaType;
};

const searchCache = new Map<string, SearchResult | null>();
const imagesCache = new Map<string, ImagesResponse>();

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(value: string) {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "");
}

function getSearchTitle(title: string) {
	// TMDB generally lists Marvel One-Shots without this prefix.
	return title.replace(/^Marvel One-Shot:\s*/i, "").trim();
}

function getYear(entry: Entry) {
	return entry.releaseDate.match(/\b(?:19|20)\d{2}\b/)?.[0];
}

function getDisplayName(entry: Entry) {
	if (entry.kind === "Series" && entry.season !== undefined) {
		return `${entry.title} - Season ${entry.season}`;
	}

	return entry.title;
}

async function tmdbRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
	const url = new URL(`${API_BASE}${endpoint}`);

	url.searchParams.set("api_key", API_KEY!);

	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}

	// Keep requests spaced out to avoid hitting rate limits.
	await delay(250);

	for (let attempt = 1; attempt <= 4; attempt++) {
		const response = await fetch(url);

		if (response.status === 429 && attempt < 4) {
			const retryAfter = Number(response.headers.get("retry-after") ?? 2);
			console.warn(`TMDB rate limit reached. Retrying in ${retryAfter}s...`);
			await delay(retryAfter * 1000);
			continue;
		}

		if (!response.ok) {
			throw new Error(`TMDB request failed (${response.status}): ${endpoint}`);
		}

		return (await response.json()) as T;
	}

	throw new Error(`TMDB request failed after retries: ${endpoint}`);
}

function selectBestMatch(results: SearchResult[], searchTitle: string, year?: string) {
	const normalizedTitle = normalize(searchTitle);

	const ranked = results
		.map((result) => {
			const candidateTitle = normalize(result.title ?? result.name ?? "");

			let score = 0;

			if (candidateTitle === normalizedTitle) {
				score += 100;
			} else if (candidateTitle.includes(normalizedTitle) || normalizedTitle.includes(candidateTitle)) {
				score += 70;
			}

			const candidateYear = (result.release_date ?? result.first_air_date ?? "").slice(0, 4);

			if (year && candidateYear) {
				if (candidateYear === year) {
					score += 25;
				} else {
					score -= Math.min(Math.abs(Number(candidateYear) - Number(year)) * 3, 20);
				}
			}

			// Use popularity only as a tie-breaker.
			score += Math.min(result.popularity ?? 0, 100) / 100;

			return { result, score };
		})
		.sort((a, b) => b.score - a.score);

	// Don't automatically select a completely unrelated result.
	return ranked[0]?.score >= 60 ? ranked[0].result : null;
}

async function searchEntry(entry: Entry, mediaType: MediaType) {
	const searchTitle = getSearchTitle(entry.title);
	const cacheKey = `${mediaType}:${normalize(searchTitle)}`;

	if (searchCache.has(cacheKey)) {
		return searchCache.get(cacheKey) ?? null;
	}

	const year = getYear(entry);

	const params: Record<string, string> = {
		query: searchTitle,
		include_adult: "false",
	};

	if (year) {
		params[mediaType === "tv" ? "first_air_date_year" : "year"] = year;
	}

	const response = await tmdbRequest<SearchResponse>(`/search/${mediaType}`, params);

	const match = selectBestMatch(response.results, searchTitle, year);

	searchCache.set(cacheKey, match);

	return match;
}

async function getImages(mediaType: MediaType, id: number): Promise<ImagesResponse> {
	const cacheKey = `${mediaType}:${id}`;

	if (!imagesCache.has(cacheKey)) {
		const images = await tmdbRequest<ImagesResponse>(`/${mediaType}/${id}/images`);

		imagesCache.set(cacheKey, images);
	}

	return imagesCache.get(cacheKey)!;
}

function sortImages(images: Image[] = []) {
	return [...images].sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0) || (b.vote_count ?? 0) - (a.vote_count ?? 0));
}

async function fetchEntryPosters(entry: Entry): Promise<PosterResult> {
	const mediaType: MediaType = entry.kind === "Series" ? "tv" : "movie";
	const name = getDisplayName(entry);

	const match = await searchEntry(entry, mediaType);

	if (!match) {
		console.warn(`No confident TMDB match found: ${name}`);

		return {
			name,
			posterPaths: [],
			thumbnailPaths: [],
			mediaType,
		};
	}

	const images = await getImages(mediaType, match.id);

	let posters = images.posters ?? [];

	// Prefer season-specific posters when the timeline entry represents a season.
	if (entry.kind === "Series" && entry.season !== undefined) {
		try {
			const seasonImages = await tmdbRequest<ImagesResponse>(`/tv/${match.id}/season/${entry.season}/images`);

			if (seasonImages.posters?.length) {
				posters = seasonImages.posters;
			}
		} catch {
			console.warn(`No season-specific posters found: ${name}`);
		}
	}

	const posterPaths = sortImages(posters)
		.map((poster) => poster.file_path)
		.filter((path, index, paths) => paths.indexOf(path) === index)
		.slice(0, POSTER_LIMIT);

	// Fall back to the poster returned by the search endpoint.
	if (posterPaths.length === 0 && match.poster_path) {
		posterPaths.push(match.poster_path);
	}

	const thumbnailPaths = sortImages(images.backdrops ?? [])
		.map((backdrop) => backdrop.file_path)
		.filter((path, index, paths) => paths.indexOf(path) === index)
		.slice(0, THUMBNAIL_LIMIT);

	// Fall back to the backdrop returned by the search endpoint.
	if (thumbnailPaths.length === 0 && match.backdrop_path) {
		thumbnailPaths.push(match.backdrop_path);
	}

	const matchedTitle = match.title ?? match.name ?? "";

	if (normalize(matchedTitle) !== normalize(getSearchTitle(entry.title))) {
		console.warn(`Review match: "${name}" matched "${matchedTitle}"`);
	}

	return {
		name,
		posterPaths,
		thumbnailPaths,
		tmdbId: match.id,
		matchedTitle,
		mediaType,
	};
}

async function main() {
	const results: PosterResult[] = [];

	console.log(`Fetching posters and thumbnails for ${timeline.length} timeline entries...\n`);

	for (const [index, entry] of timeline.entries()) {
		const name = getDisplayName(entry);

		try {
			console.log(`[${index + 1}/${timeline.length}] ${name}`);

			const result = await fetchEntryPosters(entry);
			results.push(result);

			if (result.posterPaths.length === 0) {
				console.warn(`  No poster paths found.`);
			} else {
				console.log(`  Found ${result.posterPaths.length} posters.`);
				if (result.thumbnailPaths.length === 0) {
					console.warn(`  No thumbnail paths found.`);
				} else {
					console.log(`  Found ${result.thumbnailPaths.length} thumbnails.`);
				}
			}
		} catch (error) {
			console.error(`  Failed: ${name}`, error);

			results.push({
				name,
				posterPaths: [],
				thumbnailPaths: [],
				mediaType: entry.kind === "Series" ? "tv" : "movie",
			});
		}
	}

	const outputPath = resolve(process.cwd(), "src/data/tmdb-posters.json");

	await writeFile(outputPath, JSON.stringify(results, null, 2), "utf8");

	const missing = results.filter((result) => result.posterPaths.length === 0);

	console.log(`\nFinished! Saved ${results.length} entries to:`);
	console.log(outputPath);
	console.log(`${missing.length} entries need a poster match reviewed.`);

	if (missing.length > 0) {
		console.log("\nMissing posters:");
		missing.forEach((result) => console.log(`- ${result.name}`));
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
