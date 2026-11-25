const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function getPosterUrl(path?: string, size = "w500") {
	return path ? `${TMDB_IMAGE_BASE}/${size}${path}` : undefined;
}

export function getThumbnailUrl(path?: string, size = "w780") {
	return path ? `${TMDB_IMAGE_BASE}/${size}${path}` : undefined;
}
