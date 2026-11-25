export type EntryKind = "Film" | "Series" | "Special" | "One-shot";
export type Continuity =
	| "MCU" //
	| "Marvel Television"
	| "Fox X-Men Universe"
	| "Sony's Spider-Man Universe"
	| "Alternate Universe"
	| "Uncertain";
export type CanonStatus =
	| "MCU canon" // Part of the main MCU continuity
	| "multiverse-connected" // Connected through the multiverse
	| "adjacent / disputed" // Adjacent or disputed continuity
	| "non-canon"; // Not part of the canon
export type UniverseId =
	| "Earth-616" // Sacred timeline (main MCU continuity, also known as Earth-199999)
	| "Earth-838" // Illuminati Universe
	| "Earth-10005" // Fox X-Men Universe
	| "Earth-96283" // Raimiverse
	| "Earth-120703" // Webbverse
	| "Earth-688" // Sonyverse
	| "Earth-828" // Fantastic Four Universe
	| "Earth-89521" // Zombies Universe
	| "Earth-???" // Unknown or unspecified Earth
	| "Multiverse" // Represents the multiverse as a whole
	| "TVA / outside time"; // TVA or outside the normal timeline
export type McuPhase = "Phase One" | "Phase Two" | "Phase Three" | "Phase Four" | "Phase Five" | "Phase Six";
export type Duration =
	| `${number}h` // "1h"
	| `${number}h ${number}m` // "1h 30m"
	| `${number}h ${number}m ${number}s` // "1h 30m 45s"
	| `${number}m` // "90m"
	| `${number}m ${number}s` // "90m 30s"
	| `${number}s` // "10s"
	| "TBA"; // To be announced or unknown duration

export type Episode = {
	/** The title of the episode. */
	title: string;
	episode: number;
	/** The duration of the episode. */
	duration: Duration;
	/** The in-universe chronological placement of the episode. */
	when?: string;
	/** The description of the episode, if applicable. */
	description?: string;
	/** Additional notes about the episode, if applicable. */
	note?: string;
};

export type BaseEntry = {
	/** Optional override for rare title collisions (e.g., "daredevil-2003" and "daredevil-2015")  */
	idOverride?: string;
	/** The title of the entry. */
	title: string;
	/** The kind of the entry (Film, Series, Special, One-shot). */
	kind: EntryKind;

	// Release information
	/** ISO date string (YYYY-MM-DD) or year for accurate sorting */
	releaseDate: string;
	/** Whether the entry has been released. */
	released: boolean;

	// Chronological information
	/** In-universe chronological placement (e.g., "2015" or "Spring 2016") */
	when: string;
	/**
	 * Numeric sort key so entries sort cleanly even with fuzzy "when" labels
	 * This number should increase by 10 for each subsequent entry in the timeline.
	 * This is to allow for easy insertion of new entries between existing ones without having to renumber the entire timeline.
	 */
	timelineOrder: number;
	/** The branch of the timeline the entry belongs to, if applicable. */
	branch?: string;
	/** Universe designation, where established. */
	universe?: UniverseId;
	/** How directly this title connects to the MCU. */
	canonStatus?: CanonStatus;

	// Classification
	/** The continuity the entry belongs to (MCU, Marvel Television, Alternate Universe, Uncertain). */
	continuity: Continuity;
	/** The phase of the MCU the entry belongs to, if applicable. */
	phase?: McuPhase;

	// Metadata
	/** The URL of the poster image for the entry, if applicable. */
	posterPath?: string;
	/** The URL of the thumbnail image for the entry, if applicable. */
	thumbnailPath?: string;
	/** The description of the entry, if applicable. */
	description?: string;
	/** Additional notes about the entry, if applicable. */
	note?: string;
};

export type StandaloneEntry = BaseEntry & {
	kind: "Film" | "Special" | "One-shot";
	alternateVersions?: { title: string; releaseDate: string; duration?: Duration }[];
	duration?: Duration;
};
export type SeasonEntry = BaseEntry & {
	kind: "Series";
	season?: number;
	episodes: Episode[];
};

export type Entry = StandaloneEntry | SeasonEntry;

// Chronological backbone based on Marvel's Disney+ Complete MCU Timeline, supplemented with clearly labelled timeline-adjacent titles. Dates are approximate where Marvel has not published an exact in-universe date.
export const timeline: Entry[] = [
	{
		// 1. Identity
		title: "Eyes of Wakanda",
		kind: "Series",
		// 2. Release information
		releaseDate: "2025",
		released: true,
		// 3. Chronological information
		when: "1260 BC-1896",
		timelineOrder: 10,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Six",
		// 5. Episodes
		episodes: [
			{ episode: 1, title: "Into the Lion's Den", duration: "32m" },
			{ episode: 2, title: "Legends and lies", duration: "32m" },
			{ episode: 3, title: "Lost and Found", duration: "32m" },
			{ episode: 4, title: "The Last Panther", duration: "32m" },
		],
		// 6. Metadata
		posterPath: "/bG23nZW96LxmWkJjsagRZI9hF6t.jpg",
		thumbnailPath: "/aeJRKgA9Lr3BymZLLpu3fcO2ZW7.jpg",
		description: "Animated series about Wakandan warriors throughout history",
		note: "",
	},
	{
		// 1. Identity
		title: "Captain America: The First Avenger",
		kind: "Film",
		// 2. Release information
		releaseDate: "2011",
		released: true,
		// 3. Chronological information
		when: "1942-1945",
		timelineOrder: 20,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase One",
		// 5. Runtime
		duration: "2h 7m",
		// 6. Metadata
		posterPath: "/kHbLKbMIL1w9WhofQlM03FQrQHI.jpg",
		thumbnailPath: "/771GxHpyLoQoePsYIiY8681e3YW.jpg",
		description: "Steve Rogers becomes Captain America during World War II",
		note: "First appearance of Captain America in the MCU",
	},
	{
		// 1. Identity
		title: "Marvel One-Shot: Agent Carter",
		kind: "One-shot",
		// 2. Release information
		releaseDate: "2013",
		released: true,
		// 3. Chronological information
		when: "March 1946",
		timelineOrder: 30,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Two",
		// 5. Runtime
		duration: "16m",
		// 6. Metadata
		posterPath: "/4vFKKWPvCVDJTOWiwReBfpAMScP.jpg",
		thumbnailPath: "/45Jpw4XHa95GoXKKUlQQSP1PgvK.jpg",
		description: "Agent Carter seeks the enigmatic “Zodiac” and also battles her misogynistic, bureaucratic boss.",
		note: "",
	},
	{
		// 1. Identity
		title: "Agent Carter",
		kind: "Series",
		// 2. Release information
		releaseDate: "2015",
		released: true,
		// 3. Chronological information
		when: "April and May 1946",
		timelineOrder: 40,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		season: 1,
		episodes: [
			{ episode: 1, title: "Now is Not the End", duration: "44m" },
			{ episode: 2, title: "Bridge and Tunnel", duration: "43m" },
			{ episode: 3, title: "Time and Tide", duration: "43m" },
			{ episode: 4, title: "The Blitzkrieg Button", duration: "43m" },
			{ episode: 5, title: "The Iron Ceiling", duration: "45m" },
			{ episode: 6, title: "A Sin to Err", duration: "43m" },
			{ episode: 7, title: "Snafu", duration: "43m" },
			{ episode: 8, title: "Valediction", duration: "45m" },
		],
		// 6. Metadata
		posterPath: "/gqyjmfFOrKY8iouNTXWj9KW7cC5.jpg",
		thumbnailPath: "/6oDTpqIvHa9a7kkn79uEOpx7V9X.jpg",
		description: "Follows Peggy Carter's adventures after World War II",
		note: "Timeline-adjacent Marvel Television series",
	},
	{
		// 1. Identity
		title: "Agent Carter",
		kind: "Series",
		// 2. Release information
		releaseDate: "2016",
		released: true,
		// 3. Chronological information
		when: "July 1947",
		timelineOrder: 41,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		season: 2,
		episodes: [
			{ episode: 1, title: "The Lady in the Lake", duration: "44m" },
			{ episode: 2, title: "A View in the Dark", duration: "45m" },
			{ episode: 3, title: "Better Angels", duration: "45m" },
			{ episode: 4, title: "Smoke & Mirrors", duration: "45m" },
			{ episode: 5, title: "The Edge of Mystery", duration: "44m" },
			{ episode: 6, title: "Life of the Party", duration: "45m" },
			{ episode: 7, title: "The Atomic Job", duration: "45m" },
			{ episode: 8, title: "Hollywood Ending", duration: "45m" },
			{ episode: 9, title: "A Little Song and Dance", duration: "44m" },
			{ episode: 10, title: "Hollywood Ending", duration: "43m" },
		],
		// 6. Metadata
		posterPath: "/h3yPRRiWZk6HrFD2oo3xqpLt6bc.jpg",
		thumbnailPath: "/oeIpXukhV78iecb1ybS92tkQbHx.jpg",
		description: "Follows Peggy Carter again after the events of the first season",
		note: "Timeline-adjacent Marvel Television series",
	},
	{
		// 1. Identity
		title: "Captain Marvel",
		kind: "Film",
		// 2. Release information
		releaseDate: "2019",
		released: true,
		// 3. Chronological information
		when: "June 1995",
		timelineOrder: 50,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Three",
		// 5. Runtime
		duration: "2h 8m",
		// 6. Metadata
		posterPath: "/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg",
		thumbnailPath: "/k5V2cbDZvYIu6BKIK0Q0KGyAUDB.jpg",
		description: "Origin story of Carol Danvers, a former U.S. Air Force pilot who becomes the intergalactic hero Captain Marvel",
		note: "Timeline-adjacent Marvel Studios film",
	},
	{
		// 1. Identity
		title: "Iron Man",
		kind: "Film",
		// 2. Release information
		releaseDate: "May 2, 2008",
		released: true,
		// 3. Chronological information
		when: "2008",
		timelineOrder: 60,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase One",
		// 5. Runtime
		duration: "2h 8m",
		// 6. Metadata
		posterPath: "/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
		thumbnailPath: "/rZ9N585XWwWZU7j9vaPzLAH0Yp5.jpg",
		description: "Tony Stark, a billionaire industrialist and genius inventor, becomes the armored superhero Iron Man",
		note: "Timeline-adjacent Marvel Studios film",
	},
	{
		// 1. Identity
		title: "Iron Man 2",
		kind: "Film",
		// 2. Release information
		releaseDate: "2010",
		released: true,
		// 3. Chronological information
		when: "Spring 2010",
		timelineOrder: 70,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase One",
		// 5. Runtime
		duration: "2h 6m",
		// 6. Metadata
		posterPath: "/1NHEyFPxKnsLdMuDVPy6AI7GRmE.jpg",
		thumbnailPath: "/u4UXTGu6mT0L6NrVZTlhbecEp26.jpg",
		description: "Tony Stark deals with the fallout of revealing his identity as Iron Man while facing a new threat in the form of Justin Hammer and Ivan Vanko",
		note: "Timeline-adjacent Marvel Studios film",
	},
	{
		// 1. Identity
		title: "The Incredible Hulk",
		kind: "Film",
		// 2. Release information
		releaseDate: "June 13, 2008",
		released: true,
		// 3. Chronological information
		when: "Spring 2010",
		timelineOrder: 80,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase One",
		// 5. Runtime
		duration: "1h 53m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/8vJs0uUKeJpqQCIbrHVB0QwFbLw.jpg",
		description: "Bruce Banner becomes the Hulk after a gamma radiation experiment goes wrong",
		note: "Timeline-adjacent Marvel Studios film",
	},
	{
		// 1. Identity
		title: "Marvel One-Shot: A Funny Thing Happened on the Way to Thor's Hammer",
		kind: "One-shot",
		// 2. Release information
		releaseDate: "2011",
		released: true,
		// 3. Chronological information
		when: "2011",
		timelineOrder: 85,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase One",
		// 5. Runtime
		duration: "4m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/elzfgCIHalPXppNYWZofm6pSdAc.jpg",
		description: "On his way to New Mexico, agent Coulson stops at a gas station - and encounters a crime in progress.",
		note: "Timeline-adjacent Marvel Studios one-shot",
	},
	{
		// 1. Identity
		title: "Thor",
		kind: "Film",
		// 2. Release information
		releaseDate: "2011",
		released: true,
		// 3. Chronological information
		when: "May 2011",
		timelineOrder: 90,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase One",
		// 5. Runtime
		duration: "1h 58m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/g3v0G2IAFSoaf1VfkaS6mFQwp4X.jpg",
		description: "Thor gets banished to Earth and must regain his powers to stop Loki and save Asgard",
		note: "Timeline-adjacent Marvel Studios film",
	},
	{
		// 1. Identity
		title: "Marvel One-Shot: The Consultant",
		kind: "One-shot",
		// 2. Release information
		releaseDate: "September 13, 2011",
		released: true,
		// 3. Chronological information
		when: "2011",
		timelineOrder: 95,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase One",
		// 5. Runtime
		duration: "4m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/q9EHF50eEL6WgWZQolsmHrHvl2I.jpg",
		description: "Agent Coulson and Sitwell sabotage General Ross' plans to free Emil Blonsky...with a secret weapon.",
		note: "Timeline-adjacent Marvel Studios one-shot",
	},
	{
		// 1. Identity
		title: "The Avengers",
		kind: "Film",
		// 2. Release information
		releaseDate: "2012",
		released: true,
		// 3. Chronological information
		when: "May 2012",
		timelineOrder: 100,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase One",
		// 5. Runtime
		duration: "2h 27m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/lKeMgJq4VTg0X7Blw3NL2XgpALZ.jpg",
		description:
			"Earth's mightiest heroes must come together and learn to fight as a team if they are to stop the mischievous Loki and his Chitauri army from enslaving humanity.",
		note: "Timeline-adjacent Marvel Studios film",
	},
	{
		// 1. Identity
		title: "Marvel One-Shot: Item 47",
		kind: "One-shot",
		// 2. Release information
		releaseDate: "2012",
		released: true,
		// 3. Chronological information
		when: "2012",
		timelineOrder: 105,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase One",
		// 5. Runtime
		duration: "12m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/la4YVv0RGC09ECP8VGkrzhbn6ja.jpg",
		description: "A couple discovers a Chitauri weapon and must deal with the consequences.",
		note: "Timeline-adjacent Marvel Studios one-shot",
	},
	{
		// 1. Identity
		title: "Thor: The Dark World",
		kind: "Film",
		// 2. Release information
		releaseDate: "2013",
		released: true,
		// 3. Chronological information
		when: "2013",
		timelineOrder: 110,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Two",
		// 5. Runtime
		duration: "1h 56m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/20RTiq4X2Pw0VKFuJZIBTR3ncVz.jpg",
		description: "Thor must team up with Jane Foster and his fellow Asgardians to stop the Dark Elves from plunging the universe into darkness.",
		note: "Timeline-adjacent Marvel Studios film",
	},
	{
		// 1. Identity
		title: "Iron Man 3",
		kind: "Film",
		// 2. Release information
		releaseDate: "2013",
		released: true,
		// 3. Chronological information
		when: "Christmas 2013",
		timelineOrder: 120,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Two",
		// 5. Runtime
		duration: "2h 13m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/v5nmVIgmxwNYmeUfTRUT04EViKK.jpg",
		description: "Tony Stark faces a powerful enemy in the form of the Mandarin while dealing with the aftermath of the Battle of New York.",
		note: "Timeline-adjacent Marvel Studios film",
	},
	{
		// 1. Identity
		title: "Marvel One-Shot: All Hail the King",
		kind: "One-shot",
		// 2. Release information
		releaseDate: "2014",
		released: true,
		// 3. Chronological information
		when: "2014",
		timelineOrder: 125,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Two",
		// 5. Runtime
		duration: "14m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/giRF5Wc7jtvTsp5RmDefPbzXFR2.jpg",
		description: "Trevor Slattery's life takes an unexpected turn after the events of Iron Man 3.",
		note: "Timeline-adjacent Marvel Studios one-shot",
	},
	{
		// 1. Identity
		title: "Captain America: The Winter Soldier",
		kind: "Film",
		// 2. Release information
		releaseDate: "2014",
		released: true,
		// 3. Chronological information
		when: "2014",
		timelineOrder: 130,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Two",
		// 5. Runtime
		duration: "2h 20m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/6npwUmUtkSsSAjQlmg6oil3jOvP.jpg",
		description: "Steve Rogers struggles to adapt to the modern world while facing a new threat from the mysterious Winter Soldier.",
		note: "Timeline-adjacent Marvel Studios film",
	},
	{
		// 1. Identity
		title: "Guardians of the Galaxy",
		kind: "Film",
		// 2. Release information
		releaseDate: "2014",
		released: true,
		// 3. Chronological information
		when: "2014",
		timelineOrder: 140,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Two",
		// 5. Runtime
		duration: "2h 3m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/nUO6ta738FIW5pDJwEbKFxadtQ3.jpg",
		description: "A group of intergalactic misfits must come together to save the galaxy from a powerful villain.",
		note: "Timeline-adjacent Marvel Studios film",
	},
	{
		// 1. Identity
		title: "Guardians of the Galaxy Vol. 2",
		kind: "Film",
		// 2. Release information
		releaseDate: "2017",
		released: true,
		// 3. Chronological information
		when: "2014 (shortly after Vol. 1)",
		timelineOrder: 141,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Three",
		// 5. Runtime
		duration: "2h 19m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/eBTMg4dsxfHiP1k8sf0Rx51jiKT.jpg",
		description: "The Guardians struggle to keep their newfound family together while dealing with personal issues and a powerful new threat.",
		note: "Timeline-adjacent Marvel Studios film",
	},
	{
		// 1. Identity
		title: "I Am Groot",
		kind: "Series",
		// 2. Release information
		releaseDate: "2022",
		released: true,
		// 3. Chronological information
		when: "2014",
		timelineOrder: 142,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Episodes
		season: 1,
		episodes: [
			{ episode: 1, title: "Groot's First Steps", duration: "6m" },
			{ episode: 2, title: "The Little Guy", duration: "6m" },
			{ episode: 3, title: "Groot's Pursuit", duration: "6m" },
			{ episode: 4, title: "Groot Takes a Bath", duration: "6m" },
			{ episode: 5, title: "Magnus Opus", duration: "6m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/6bfV0WSL4Iw7ARQqc7DLVlmENeg.jpg",
		description: "A series of shorts following the adventures of Baby Groot.",
		note: "Timeline-adjacent Marvel Studios series",
	},
	{
		// 1. Identity
		title: "I Am Groot",
		kind: "Series",
		// 2. Release information
		releaseDate: "2023",
		released: true,
		// 3. Chronological information
		when: "2014",
		timelineOrder: 143,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Episodes
		season: 2,
		episodes: [
			{ episode: 1, title: "Are You My Groot?", duration: "5m" },
			{ episode: 2, title: "Groot Noses Around", duration: "4m" },
			{ episode: 3, title: "Groot's Snow Day", duration: "5m" },
			{ episode: 4, title: "Groot's Sweet Treat", duration: "5m" },
			{ episode: 5, title: "Groot and the Great Prophecy", duration: "6m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/4Uks4LoLqVt7hCSiLasGIdiGzYg.jpg",
		description: "A series of shorts following the adventures of Baby Groot.",
		note: "Timeline-adjacent Marvel Studios series",
	},
	{
		// 1. Identity
		title: "Daredevil",
		kind: "Series",
		// 2. Release information
		releaseDate: "2015",
		released: true,
		// 3. Chronological information
		when: "2015",
		timelineOrder: 150,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		season: 1,
		episodes: [
			{ episode: 1, title: "Into the Ring", duration: "55m" },
			{ episode: 2, title: "Cut Man", duration: "54m" },
			{ episode: 3, title: "Rabbit in a Snowstorm", duration: "54m" },
			{ episode: 4, title: "In the Blood", duration: "54m" },
			{ episode: 5, title: "World on Fire", duration: "57m" },
			{ episode: 6, title: "Condemned", duration: "50m" },
			{ episode: 7, title: "Stick", duration: "52m" },
			{ episode: 8, title: "Shadows in the Glass", duration: "55m" },
			{ episode: 9, title: "Speak of the Devil", duration: "59m" },
			{ episode: 10, title: "Nelson v. Murdock", duration: "58m" },
			{ episode: 11, title: "The Path of the Righteous", duration: "60m" },
			{ episode: 12, title: "The Ones We Leave Behind", duration: "60m" },
			{ episode: 13, title: "Daredevil", duration: "57m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/82fW9XCV6eVbmgBAYST7lA7OwEe.jpg",
		description: "Daredevil's journey as a blind lawyer by day and vigilante by night.",
		note: "Timeline-adjacent; street-level MCU continuity",
	},
	{
		// 1. Identity
		title: "Jessica Jones",
		kind: "Series",
		// 2. Release information
		releaseDate: "2015",
		released: true,
		// 3. Chronological information
		when: "2015",
		timelineOrder: 160,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		season: 1,
		episodes: [
			{ episode: 1, title: "A.K.A. Ladies Night", duration: "54m" },
			{ episode: 2, title: "A.K.A. Crush Syndrome", duration: "53m" },
			{ episode: 3, title: "A.K.A. It's Called Whiskey", duration: "56m" },
			{ episode: 4, title: "A.K.A. 99 Friends", duration: "50m" },
			{ episode: 5, title: "A.K.A. The Sandwich Saved Me", duration: "52m" },
			{ episode: 6, title: "A.K.A. You're a Winner!", duration: "55m" },
			{ episode: 7, title: "A.K.A. Top Shelf Perverts", duration: "57m" },
			{ episode: 8, title: "A.K.A. WWJD?", duration: "52m" },
			{ episode: 9, title: "A.K.A. Sin Bin", duration: "57m" },
			{ episode: 10, title: "A.K.A. 1,000 Cuts", duration: "48m" },
			{ episode: 11, title: "A.K.A. I've Got the Blues", duration: "52m" },
			{ episode: 12, title: "A.K.A. Take a Bloody Number", duration: "55m" },
			{ episode: 13, title: "A.K.A. Smile", duration: "54m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/npgHuYm8Sl1oDVLhAXOTSP1FpCs.jpg",
		description: "Jessica Jones, a former superhero turned private investigator, navigates her life in New York City.",
		note: "Timeline-adjacent; street-level MCU continuity",
	},
	{
		// 1. Identity
		title: "Avengers: Age of Ultron",
		kind: "Film",
		// 2. Release information
		releaseDate: "2015",
		released: true,
		// 3. Chronological information
		when: "2015",
		timelineOrder: 170,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Two",
		// 5. Runtime
		duration: "2h 25m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/g9JWRhdAhBWuM2SJn8qu2kccmZ2.jpg",
		description: "The Avengers must stop Ultron, an artificial intelligence bent on human extinction.",
		note: "Timeline-adjacent; major MCU event",
	},
	{
		// 1. Identity
		title: "Ant-Man",
		kind: "Film",
		// 2. Release information
		releaseDate: "2015",
		released: true,
		// 3. Chronological information
		when: "2015",
		timelineOrder: 180,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Two",
		// 5. Runtime
		duration: "2h",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/ukIhDosxChjO2KtG0PgA0eL5EbT.jpg",
		description: "Scott Lang becomes the Ant-Man, using a suit that allows him to shrink in size but increase in strength.",
		note: "Timeline-adjacent; major MCU event",
	},
	{
		// 1. Identity
		title: "Daredevil",
		kind: "Series",
		// 2. Release information
		releaseDate: "2016",
		released: true,
		// 3. Chronological information
		when: "2016",
		timelineOrder: 190,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		season: 2,
		episodes: [
			{ episode: 1, title: "Bang", duration: "49m" },
			{ episode: 2, title: "Dogs to a Gunfight", duration: "50m" },
			{ episode: 3, title: "New York's Finest", duration: "48m" },
			{ episode: 4, title: "Penny and Dime", duration: "60m" },
			{ episode: 5, title: "Kinbaku", duration: "56m" },
			{ episode: 6, title: "Regrets Only", duration: "56m" },
			{ episode: 7, title: "Semper Fidelis", duration: "57m" },
			{ episode: 8, title: "Guilty as Sin", duration: "55m" },
			{ episode: 9, title: "Seven Minutes in Heaven", duration: "60m" },
			{ episode: 10, title: "Blindsided", duration: "53m" },
			{ episode: 11, title: " .380", duration: "56m" },
			{ episode: 12, title: "The Dark at the End of the Tunnel", duration: "53m" },
			{ episode: 13, title: "A Cold Day in Hell's Kitchen", duration: "58m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/eY5IJYsaXgFqUaCLvYuuCdfKpte.jpg",
		description: "Matt Murdock, a blind lawyer by day and vigilante by night, fights crime in Hell's Kitchen as Daredevil.",
		note: "",
	},
	{
		// 1. Identity
		title: "Luke Cage",
		kind: "Series",
		// 2. Release information
		releaseDate: "2016",
		released: true,
		// 3. Chronological information
		when: "2016",
		timelineOrder: 200,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		season: 1,
		episodes: [
			{ episode: 1, title: "Moment of Truth", duration: "55m" },
			{ episode: 2, title: "Code of the Streets", duration: "59m" },
			{ episode: 3, title: "Who's Gonna Take the Weight?", duration: "57m" },
			{ episode: 4, title: "Step in the Arena", duration: "53m" },
			{ episode: 5, title: "Just to Get a Rep", duration: "52m" },
			{ episode: 6, title: "Suckas Need Bodyguards", duration: "54m" },
			{ episode: 7, title: "Manifest", duration: "52m" },
			{ episode: 8, title: "Blowin' Up the Spot", duration: "49m" },
			{ episode: 9, title: "DWYCK", duration: "1h 6m" },
			{ episode: 10, title: "Take It Personal", duration: "48m" },
			{ episode: 11, title: "Now You're Mine", duration: "51m" },
			{ episode: 12, title: "Soliloquy of Chaos", duration: "1h 2m" },
			{ episode: 13, title: "You Know My Steez", duration: "46m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/qT5O1S8ksR2kSIM63gGQcx8lYg2.jpg",
		description: "Luke Cage, a man with superhuman strength and unbreakable skin, fights crime in Harlem.",
		note: "",
	},
	{
		// 1. Identity
		title: "Iron Fist",
		kind: "Series",
		// 2. Release information
		releaseDate: "2017",
		released: true,
		// 3. Chronological information
		when: "2017",
		timelineOrder: 210,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		season: 1,
		episodes: [
			{ episode: 1, title: "Snow Gives Way", duration: "57m" },
			{ episode: 2, title: "Shadow Hawk Takes Flight", duration: "1h 2m" },
			{ episode: 3, title: "Rolling Thunder Cannon Punch", duration: "1h" },
			{ episode: 4, title: "Eight Diagram Dragon Palm", duration: "54m" },
			{ episode: 5, title: "Under Leaf Pluck Lotus", duration: "57m" },
			{ episode: 6, title: "Immortal Emerges from Cave", duration: "53m" },
			{ episode: 7, title: "Felling Tree with Roots", duration: "58m" },
			{ episode: 8, title: "The Blessing of Many Fractures", duration: "55m" },
			{ episode: 9, title: "The Mistress of All Agonies", duration: "55m" },
			{ episode: 10, title: "Black Tiger Steals Heart", duration: "57m" },
			{ episode: 11, title: "Lead Horse Back to Stable", duration: "53m" },
			{ episode: 12, title: "Bar the Big Boss", duration: "50m" },
			{ episode: 13, title: "Dragon Plays with Fire", duration: "54m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/zURVcihFXEhntVLEzWMA10jLODQ.jpg",
		description: "Danny Rand returns to New York City after being presumed dead for years and seeks to reclaim his family's company and legacy as the Iron Fist.",
		note: "",
	},
	{
		// 1. Identity
		title: "The Defenders",
		kind: "Series",
		// 2. Release information
		releaseDate: "2017",
		released: true,
		// 3. Chronological information
		when: "2017",
		timelineOrder: 220,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		episodes: [
			{ episode: 1, title: "The H Word", duration: "55m" },
			{ episode: 2, title: "Mean Right Hook", duration: "55m" },
			{ episode: 3, title: "Worst Behavior", duration: "55m" },
			{ episode: 4, title: "Royal Dragon", duration: "55m" },
			{ episode: 5, title: "Take Shelter", duration: "55m" },
			{ episode: 6, title: "Ashes, Ashes", duration: "55m" },
			{ episode: 7, title: "Fish in the Jailhouse", duration: "55m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/yZ7nixXBbxVx0Sbxmgd4m1EKDwc.jpg",
		description: "Daredevil, Jessica Jones, Luke Cage, and Iron Fist team up to save New York City from a mysterious threat.",
		note: "",
	},
	{
		// 1. Identity
		title: "Captain America: Civil War",
		kind: "Film",
		// 2. Release information
		releaseDate: "2016",
		released: true,
		// 3. Chronological information
		when: "2016",
		timelineOrder: 230,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		phase: "Phase Three",
		continuity: "MCU",
		// 5. Runtime
		duration: "2h 32m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/qPghrh3RMB7qzxK66skhiH5RZvF.jpg",
		description: "Dealing with the aftermath of the Sokovia Accords, the Avengers are divided, leading to a conflict between Team Iron Man and Team Captain America.",
		note: "",
	},
	{
		// 1. Identity
		title: "Black Widow",
		kind: "Film",
		// 2. Release information
		releaseDate: "2021",
		released: true,
		// 3. Chronological information
		when: "2016 (after Civil War)",
		timelineOrder: 240,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Runtime
		duration: "2h 17m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/ApH5y0E92GiAYzFJPNLDws3v5oK.jpg",
		description: "Natasha Romanoff confronts her past and deals with unfinished business while on the run after the events of Civil War.",
		note: "",
	},
	{
		// 1. Identity
		title: "Black Panther",
		kind: "Film",
		// 2. Release information
		releaseDate: "2018",
		released: true,
		// 3. Chronological information
		when: "2016",
		timelineOrder: 250,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Three",
		// 5. Runtime
		duration: "2h 19m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/99BohxTulsMlkOFLzIQ3jsR0gyE.jpg",
		description: "T'Challa returns home to Wakanda to take his place as king, but he faces challenges from factions within his country and a powerful enemy from the past.",
		note: "",
	},
	{
		// 1. Identity
		title: "Spider-Man: Homecoming",
		kind: "Film",
		// 2. Release information
		releaseDate: "2017",
		released: true,
		// 3. Chronological information
		when: "2016",
		timelineOrder: 260,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Three",
		// 5. Runtime
		duration: "2h 14m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/7PhC0zGZNRWNQSXJz9Y3kAooGer.jpg",
		description: "Peter Parker balances his life as a high school student and his role as Spider-Man while facing the Vulture threat.",
		note: "",
	},
	{
		// 1. Identity
		title: "The Punisher",
		kind: "Series",
		// 2. Release information
		releaseDate: "2017",
		released: true,
		// 3. Chronological information
		when: "2017",
		timelineOrder: 270,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		season: 1,
		episodes: [
			{ episode: 1, title: "3 AM", duration: "52m" },
			{ episode: 2, title: "Two Dead Men", duration: "58m" },
			{ episode: 3, title: "Kandahar", duration: "58m" },
			{ episode: 4, title: "Resupply", duration: "50m" },
			{ episode: 5, title: "Gunner", duration: "56m" },
			{ episode: 6, title: "The Judas Goat", duration: "56m" },
			{ episode: 7, title: "Crosshairs", duration: "49m" },
			{ episode: 8, title: "Cold Steel", duration: "54m" },
			{ episode: 9, title: "Front Toward Enemy", duration: "55m" },
			{ episode: 10, title: "Virtue of the Vicious", duration: "50m" },
			{ episode: 11, title: "Danger Close", duration: "53m" },
			{ episode: 12, title: "Home", duration: "52m" },
			{ episode: 13, title: "Memento Mori", duration: "56m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/kWZK3CBC2Lgr8Sk97SAXTZ78r4k.jpg",
		description: "Frank Castle becomes the vigilante known as the Punisher after the murder of his family, seeking justice and revenge against those responsible.",
		note: "",
	},
	{
		// 1. Identity
		title: "Doctor Strange",
		kind: "Film",
		// 2. Release information
		releaseDate: "2016",
		released: true,
		// 3. Chronological information
		when: "2016-2017",
		timelineOrder: 280,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Three",
		// 5. Runtime
		duration: "1h 57m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/brbkEQAe6BKmPCLdqBkVNNZqlql.jpg",
		description: "Doctor Stephen Strange, a brilliant but arrogant surgeon, discovers the mystic arts after a career-ending car accident.",
		note: "",
	},
	{
		// 1. Identity
		title: "Jessica Jones",
		kind: "Series",
		// 2. Release information
		releaseDate: "2018",
		released: true,
		// 3. Chronological information
		when: "2017",
		timelineOrder: 290,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		season: 2,
		episodes: [
			{ episode: 1, title: "A.K.A. Start at the Beginning", duration: "54m" },
			{ episode: 2, title: "A.K.A. Freak Accident", duration: "56m" },
			{ episode: 3, title: "A.K.A. Sole Survivor", duration: "55m" },
			{ episode: 4, title: "A.K.A. God Help the Hobo", duration: "50m" },
			{ episode: 5, title: "A.K.A. The Octopus", duration: "53m" },
			{ episode: 6, title: "A.K.A. Facetime", duration: "49m" },
			{ episode: 7, title: "A.K.A. I Want Your Cray Cray", duration: "54m" },
			{ episode: 8, title: "A.K.A. Ain't We Got Fun", duration: "51m" },
			{ episode: 9, title: "A.K.A. Shark in the Bathtub", duration: "50m" },
			{ episode: 10, title: "A.K.A. Pork Chop", duration: "55m" },
			{ episode: 11, title: "A.K.A. Three Lives and Counting", duration: "49m" },
			{ episode: 12, title: "A.K.A. Pray for My Patsy", duration: "47m" },
			{ episode: 13, title: "A.K.A. Playland", duration: "53m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/llIIZ7acmM5SoUCZFR2em0k3f5e.jpg",
		description: "Jessica Jones, a former superhero turned private investigator, deals with cases involving people with extraordinary abilities.",
		note: "",
	},
	{
		// 1. Identity
		title: "Luke Cage",
		kind: "Series",
		// 2. Release information
		releaseDate: "2018",
		released: true,
		// 3. Chronological information
		when: "2017",
		timelineOrder: 300,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		season: 2,
		episodes: [
			{ episode: 1, title: "Soul Brother #1", duration: "56m" },
			{ episode: 2, title: "Straighten It Out", duration: "55m" },
			{ episode: 3, title: "Wig Out", duration: "1h" },
			{ episode: 4, title: "I Get Physical", duration: "54m" },
			{ episode: 5, title: "All Souled Out", duration: "57m" },
			{ episode: 6, title: "the Basement", duration: "1h 4m" },
			{ episode: 7, title: "On and On", duration: "56m" },
			{ episode: 8, title: "If It Ain't Rough, It Ain't Right", duration: "55m" },
			{ episode: 9, title: "For Pete's Sake", duration: "59m" },
			{ episode: 10, title: "The Main Ingredient", duration: "59m" },
			{ episode: 11, title: "The Creator", duration: "56m" },
			{ episode: 12, title: "Can't Front on Me", duration: "1h 2m" },
			{ episode: 13, title: "They Reminisce Over You", duration: "1h 9m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/w7OGBMRqtkwqMpNzwua0tC9XsiD.jpg",
		description: "Luke Cage, a former convict with superhuman strength and unbreakable skin, fights crime in Harlem.",
		note: "",
	},
	{
		// 1. Identity
		title: "Iron Fist",
		kind: "Series",
		// 2. Release information
		releaseDate: "2018",
		released: true,
		// 3. Chronological information
		when: "2017",
		timelineOrder: 310,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		season: 2,
		episodes: [
			{ episode: 1, title: "The Fury of Iron Fist", duration: "57m" },
			{ episode: 2, title: "The City's Not for Burning", duration: "53m" },
			{ episode: 3, title: "This Deadly Secret...", duration: "52m" },
			{ episode: 4, title: "Target: Iron Fist", duration: "53m" },
			{ episode: 5, title: "Heart of the Dragon", duration: "55m" },
			{ episode: 6, title: "The Dragon Dies at Dawn", duration: "51m" },
			{ episode: 7, title: "Morning of the Mindstorm", duration: "54m" },
			{ episode: 8, title: "Citadel on the Edge of Vengeance", duration: "49m" },
			{ episode: 9, title: "War Without End", duration: "50m" },
			{ episode: 10, title: "A Duel of Iron", duration: "52m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/dNzBtV7f0Q3EeX2qrDZDh28gxjA.jpg",
		description: "Danny Rand returns to New York City after being presumed dead for years, and must reclaim his family's company and his identity as the Iron Fist.",
		note: "",
	},
	{
		// 1. Identity
		title: "Daredevil",
		kind: "Series",
		// 2. Release information
		releaseDate: "2018",
		released: true,
		// 3. Chronological information
		when: "2017",
		timelineOrder: 320,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		season: 3,
		episodes: [
			{ episode: 1, title: "Resurrection", duration: "53m" },
			{ episode: 2, title: "Please", duration: "49m" },
			{ episode: 3, title: "No Good Deed", duration: "49m" },
			{ episode: 4, title: "Please", duration: "54m" },
			{ episode: 5, title: "Blindsided", duration: "49m" },
			{ episode: 6, title: "The Devil You Know", duration: "54m" },
			{ episode: 7, title: "Aftermath", duration: "49m" },
			{ episode: 8, title: "A New Napkin", duration: "50m" },
			{ episode: 9, title: "Revelations", duration: "54m" },
			{ episode: 10, title: "Karen", duration: "46m" },
			{ episode: 11, title: "Ben", duration: "49m" },
			{ episode: 12, title: "Reunion", duration: "55m" },
			{ episode: 13, title: "A New Napkin", duration: "54m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/2We2XCyYFgxN0Xccps2E5sbCE1Z.jpg",
		description: "Matt Murdock, a blind lawyer with heightened senses, fights crime as Daredevil in Hell's Kitchen.",
		note: "",
	},
	{
		// 1. Identity
		title: "Thor: Ragnarok",
		kind: "Film",
		// 2. Release information
		releaseDate: "2017",
		released: true,
		// 3. Chronological information
		when: "2017",
		timelineOrder: 330,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Three",
		// 5. Runtime
		duration: "2h 14m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/pQm5yycugLghyZKbf4kr80CtIjB.jpg",
		description: "Thor must escape the alien planet Sakaar and return to Asgard to stop Ragnarok, the prophesied destruction of his homeworld.",
		note: "",
	},
	{
		// 1. Identity
		title: "The Punisher",
		kind: "Series",
		// 2. Release information
		releaseDate: "2019",
		released: true,
		// 3. Chronological information
		when: "2018",
		timelineOrder: 340,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		season: 2,
		episodes: [
			{ episode: 1, title: "Roadhouse Blues", duration: "53m" },
			{ episode: 2, title: "Fight or Flight", duration: "54m" },
			{ episode: 3, title: "Trouble the Water", duration: "51m" },
			{ episode: 4, title: "Scar Tissue", duration: "57m" },
			{ episode: 5, title: "One-Eyed Jacks", duration: "51m" },
			{ episode: 6, title: "Nakazat", duration: "56m" },
			{ episode: 7, title: "One Bad Day", duration: "51m" },
			{ episode: 8, title: "My Brother's Keeper", duration: "48m" },
			{ episode: 9, title: "Flustercluck", duration: "57m" },
			{ episode: 10, title: "The hearts of men", duration: "47m" },
			{ episode: 11, title: "The Abyss", duration: "54m" },
			{ episode: 12, title: "Collision Course", duration: "49m" },
			{ episode: 13, title: "The Whirlwind", duration: "57m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/hGmR92kk87uRLpeyCS9sYOvkzze.jpg",
		description: "Frank Castle becomes the vigilante known as the Punisher after the murder of his family.",
		note: "",
	},
	{
		// 1. Identity
		title: "Jessica Jones",
		kind: "Series",
		// 2. Release information
		releaseDate: "2019",
		released: true,
		// 3. Chronological information
		when: "2018",
		timelineOrder: 350,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "Marvel Television",
		// 5. Episodes
		season: 3,
		episodes: [
			{ episode: 1, title: "A.K.A. The Perfect Burger", duration: "52m" },
			{ episode: 2, title: "A.K.A. You're Welcome", duration: "55m" },
			{ episode: 3, title: "A.K.A. I Have No Spleen", duration: "56m" },
			{ episode: 4, title: "A.K.A. Customer Service Is Standing By", duration: "46m" },
			{ episode: 5, title: "A.K.A. I Wish", duration: "53m" },
			{ episode: 6, title: "A.K.A. Sorry Face", duration: "53m" },
			{ episode: 7, title: "A.K.A. The Double Half-Wappinger", duration: "50m" },
			{ episode: 8, title: "A.K.A. Camera Friendly", duration: "44m" },
			{ episode: 9, title: "A.K.A. I Did Something Today", duration: "52m" },
			{ episode: 10, title: "A.K.A. Hero Pants", duration: "50m" },
			{ episode: 11, title: "A.K.A. Hellcat", duration: "48m" },
			{ episode: 12, title: "A.K.A. A Lotta Worms", duration: "49m" },
			{ episode: 13, title: "A.K.A. Everything", duration: "51m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/pPZHUC4NXAt8cMwfFdooXrTq7Wp.jpg",
		description: "Jessica Jones continues her journey as a private investigator dealing with her past and new threats.",
		note: "",
	},
	{
		// 1. Identity
		title: "Ant-Man and the Wasp",
		kind: "Film",
		// 2. Release information
		releaseDate: "2018",
		released: true,
		// 3. Chronological information
		when: "2018 (before the Snap; mid/post-credit after)",
		timelineOrder: 360,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Three",
		// 5. Runtime
		duration: "2h 3m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/kfrgWYSkiJ8L4BEeUgiUwOvfT03.jpg",
		description: "Scott Lang balances being both a superhero and a father while teaming up with Hope van Dyne to uncover secrets from the past.",
		note: "",
	},
	{
		// 1. Identity
		title: "Avengers: Infinity War",
		kind: "Film",
		// 2. Release information
		releaseDate: "2018",
		released: true,
		// 3. Chronological information
		when: "2018",
		timelineOrder: 370,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Three",
		// 5. Runtime
		duration: "2h 35m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/4hFLXqEflFdcBjTF3Z2nQjQm8qO.jpg",
		description:
			"The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Mad Titan Thanos before his blitz of devastation and ruin puts an end to the universe.",
		note: "",
	},
	{
		// 1. Identity
		title: "Avengers: Endgame",
		kind: "Film",
		// 2. Release information
		releaseDate: "2019",
		released: true,
		// 3. Chronological information
		when: "2018 & 2023",
		timelineOrder: 380,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Three",
		// 5. Runtime
		duration: "3h 6m",
		alternateVersions: [{ title: "Avengers: Endgame Encore", releaseDate: "2026", duration: "3h 9m" }],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/yaRps1bMQLyz54M8ib5YdA2a2RZ.jpg",
		description: "The Avengers assemble once more to undo the devastation wrought by Thanos and restore balance to the universe.",
		note: "",
	},
	{
		// 1. Identity
		title: "Loki",
		kind: "Series",
		// 2. Release information
		releaseDate: "2021",
		released: true,
		// 3. Chronological information
		when: "Outside linear time (branches from 2012)",
		timelineOrder: 390,
		branch: "Main",
		universe: "TVA / outside time",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Episodes
		season: 1,
		episodes: [
			{ episode: 1, title: "Glorious Purpose", duration: "53m" },
			{ episode: 2, title: "The Variant", duration: "56m" },
			{ episode: 3, title: "Lamentis", duration: "44m" },
			{ episode: 4, title: "The Nexus Event", duration: "51m" },
			{ episode: 5, title: "Journey into Mystery", duration: "51m" },
			{ episode: 6, title: "For All Time. Always.", duration: "48m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/kXja7L9cRlsRmINMpxyWEdp9r3u.jpg",
		description: "Loki finds himself caught in a time loop and must navigate the complexities of the multiverse while dealing with the Time Variance Authority.",
		note: "",
	},
	{
		// 1. Identity
		title: "What If…?",
		kind: "Series",
		// 2. Release information
		releaseDate: "2021",
		released: true,
		// 3. Chronological information
		when: "Multiverse / alternate realities",
		timelineOrder: 400,
		branch: "Main",
		universe: "Multiverse",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Episodes
		season: 1,
		episodes: [
			{ episode: 1, title: "What If... Captain Carter Were the First Avenger?", duration: "37m" },
			{ episode: 2, title: "What If... T'Challa Became Star-Lord?", duration: "38m" },
			{ episode: 3, title: "What If... The World Lost Its Mightiest Heroes?", duration: "36m" },
			{ episode: 4, title: "What If... Doctor Strange Lost His Heart Instead of His Hands?", duration: "39m" },
			{ episode: 5, title: "What If... Zombies?!", duration: "35m" },
			{ episode: 6, title: "What If... Killmonger Rescued Tony Stark?", duration: "36m" },
			{ episode: 7, title: "What If... Thor Were an Only Child?", duration: "39m" },
			{ episode: 8, title: "What If... Ultron Won?", duration: "33m" },
			{ episode: 9, title: "What If... The Watcher Broke His Oath?", duration: "38m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/us4lwjVLR2MF2c0vcOS8A4tC9h4.jpg",
		description: "An animated anthology series exploring alternate realities in the Marvel Cinematic Universe.",
		note: "",
	},
	{
		// 1. Identity
		title: "Marvel Zombies",
		kind: "Series",
		// 2. Release information
		releaseDate: "2025",
		released: true,
		// 3. Chronological information
		when: "Alternate universe",
		timelineOrder: 410,
		branch: "Main",
		universe: "Earth-89521",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Six",
		// 5. Episodes
		episodes: [
			{ episode: 1, title: "Episode 1", duration: "38m" },
			{ episode: 2, title: "Episode 2", duration: "34m" },
			{ episode: 3, title: "Episode 3", duration: "33m" },
			{ episode: 4, title: "Episode 4", duration: "32m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/5jQ3l0TuRCKW0IdUF8JXBksANQP.jpg",
		description: "An animated series exploring a universe where Marvel heroes become zombies.",
		note: "",
	},
	{
		// 1. Identity
		title: "WandaVision",
		kind: "Series",
		// 2. Release information
		releaseDate: "2021",
		released: true,
		// 3. Chronological information
		when: "2023 (3 weeks after Endgame)",
		timelineOrder: 420,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Episodes
		episodes: [
			{ episode: 1, title: "Filmed Before a Live Studio Audience", duration: "32m" },
			{ episode: 2, title: "Don't Touch That Dial", duration: "39m" },
			{ episode: 3, title: "Now in Color", duration: "35m" },
			{ episode: 4, title: "We Interrupt This Program", duration: "37m" },
			{ episode: 5, title: "On a Very Special Episode...", duration: "43m" },
			{ episode: 6, title: "All-New Halloween Spooktacular!", duration: "40m" },
			{ episode: 7, title: "Breaking the Fourth Wall", duration: "40m" },
			{ episode: 8, title: "Previously On", duration: "48m" },
			{ episode: 9, title: "The Series Finale", duration: "52m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/jcQ5ez9AdJIq9IHVo61PqDPLQsS.jpg",
		description: "A series following Wanda Maximoff and Vision in a suburban setting, exploring grief and reality manipulation.",
		note: "",
	},
	{
		// 1. Identity
		title: "Shang-Chi and the Legend of the Ten Rings",
		kind: "Film",
		// 2. Release information
		releaseDate: "2021",
		released: true,
		// 3. Chronological information
		when: "2024",
		timelineOrder: 430,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Duration
		duration: "2h 16m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/fw6KTUtXxBpMpoJvu7akxEsjhlX.jpg",
		description: "A martial arts superhero film following Shang-Chi as he confronts his past and the Ten Rings organization.",
		note: "",
	},
	{
		// 1. Identity
		title: "The Falcon and the Winter Soldier",
		kind: "Series",
		// 2. Release information
		releaseDate: "2021",
		released: true,
		// 3. Chronological information
		when: "2024",
		timelineOrder: 440,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Episodes
		episodes: [
			{ episode: 1, title: "New World Order", duration: "52m" },
			{ episode: 2, title: "The Star-Spangled Man", duration: "52m" },
			{ episode: 3, title: "Power Broker", duration: "55m" },
			{ episode: 4, title: "The Whole World Is Watching", duration: "56m" },
			{ episode: 5, title: "Truth", duration: "1h 3m" },
			{ episode: 6, title: "One World, One People", duration: "54m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/7lStQvlN75b1pvrfRAIq76ftCMv.jpg",
		description: "A series following Sam Wilson and Bucky Barnes as they navigate life after Captain America.",
		note: "",
	},
	{
		// 1. Identity
		title: "Spider-Man: Far From Home",
		kind: "Film",
		// 2. Release information
		releaseDate: "2019",
		released: true,
		// 3. Chronological information
		when: "Summer 2024",
		timelineOrder: 450,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Three",
		// 5. Duration
		duration: "2h 10m",
		alternateVersions: [{ title: "IMAX Enhanced - Spider-Man: Far From Home", releaseDate: "2019", duration: "2h 10m" }],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/d5E3qLwmU6TyCHfcya1c6kFJnUQ.jpg",
		description: "Peter Parker goes on a school trip to Europe, where he faces the threat of Mysterio and the fallout from the events of Avengers: Endgame.",
		note: "",
	},
	{
		// 1. Identity
		title: "Eternals",
		kind: "Film",
		// 2. Release information
		releaseDate: "2021",
		released: true,
		// 3. Chronological information
		when: "2024",
		timelineOrder: 460,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Duration
		duration: "2h 39m",
		alternateVersions: [{ title: "IMAX Enhanced - Eternals", releaseDate: "2021", duration: "2h 39m" }],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/gFOtje3PgB0sDd7TLo78AAC9pTr.jpg",
		description: "The Eternals, an immortal alien race, emerge from hiding to protect Earth from their ancient enemies, the Deviants.",
		note: "",
	},
	{
		// 1. Identity
		title: "Spider-Man: No Way Home",
		kind: "Film",
		// 2. Release information
		releaseDate: "2021",
		released: true,
		// 3. Chronological information
		when: "Late 2024",
		timelineOrder: 470,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Duration
		duration: "2h 28m",
		alternateVersions: [{ title: "IMAX Enhanced - Spider-Man: No Way Home", releaseDate: "2021", duration: "2h 28m" }],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/utxfKMtH91Q5uPvFMFDLnxohXHV.jpg",
		description: "Peter Parker seeks help from Doctor Strange to make the world forget his identity as Spider-Man, leading to multiversal chaos.",
		note: "",
	},
	{
		// 1. Identity
		title: "Doctor Strange in the Multiverse of Madness",
		kind: "Film",
		// 2. Release information
		releaseDate: "2022",
		released: true,
		// 3. Chronological information
		when: "2025",
		timelineOrder: 480,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Duration
		duration: "2h 9m",
		alternateVersions: [{ title: "IMAX Enhanced - Doctor Strange in the Multiverse of Madness", releaseDate: "2022", duration: "2h 9m" }],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/shDYfjtNFyZmf7uZNtOLaI6iJXM.jpg",
		description: "Doctor Strange teams up with Wanda Maximoff to navigate the multiverse and confront new threats.",
		note: "",
	},
	{
		// 1. Identity
		title: "Hawkeye",
		kind: "Series",
		// 2. Release information
		releaseDate: "2021",
		released: true,
		// 3. Chronological information
		when: "Christmas 2024",
		timelineOrder: 490,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Episodes
		episodes: [
			{ episode: 1, title: "Never Meet Your Heroes", duration: "52m" },
			{ episode: 2, title: "Hide and Seek", duration: "53m" },
			{ episode: 3, title: "Echoes", duration: "45m" },
			{ episode: 4, title: "Partners, Am I Right?", duration: "42m" },
			{ episode: 5, title: "Ronin", duration: "46m" },
			{ episode: 6, title: "So This Is Christmas?", duration: "1h 3m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/mrCVSb6I3i2sL7de3L7lfu4OZms.jpg",
		description: "Clint Barton, also known as Hawkeye, teams up with Kate Bishop to confront threats from his past during the holiday season.",
		note: "",
	},
	{
		// 1. Identity
		title: "Moon Knight",
		kind: "Series",
		// 2. Release information
		releaseDate: "2022",
		released: true,
		// 3. Chronological information
		when: "2025 (approx.)",
		timelineOrder: 500,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Episodes
		episodes: [
			{ episode: 1, title: "The Goldfish Problem", duration: "48m" },
			{ episode: 2, title: "Summon the Suit", duration: "54m" },
			{ episode: 3, title: "The Friendly Type", duration: "53m" },
			{ episode: 4, title: "The Tomb", duration: "54m" },
			{ episode: 5, title: "Asylum", duration: "50m" },
			{ episode: 6, title: "Gods and Monsters", duration: "46m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/1z90dL3BY2nDa1mCLNtkjpsP0yV.jpg",
		description: "Marc Spector, a former mercenary with dissociative identity disorder, becomes the avatar of the Egyptian moon god Khonshu.",
		note: "",
	},
	{
		// 1. Identity
		title: "Black Panther: Wakanda Forever",
		kind: "Film",
		// 2. Release information
		releaseDate: "2022",
		released: true,
		// 3. Chronological information
		when: "2025 (approx.)",
		timelineOrder: 510,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Runtime
		duration: "2h 44m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/nrMva6TcOaImwmFxpliyXXmNSOc.jpg",
		description: "The people of Wakanda fight to protect their nation following the death of King T'Challa.",
		note: "",
	},
	{
		// 1. Identity
		title: "Echo",
		kind: "Series",
		// 2. Release information
		releaseDate: "2024",
		released: true,
		// 3. Chronological information
		when: "2025 (approx.)",
		timelineOrder: 520,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Five",
		// 5. Episodes
		episodes: [
			{ episode: 1, title: "Chafa", duration: "51m" },
			{ episode: 2, title: "Lowak", duration: "42m" },
			{ episode: 3, title: "Tuklo", duration: "45m" },
			{ episode: 4, title: "Taloa", duration: "40m" },
			{ episode: 5, title: "Maya", duration: "37m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/e3geW7xRqXl26NivbpqpARtRDOK.jpg",
		description: "Maya Lopez, also known as Echo, navigates her life as a deaf anti-hero while confronting her past.",
		note: "",
	},
	{
		// 1. Identity
		title: "She-Hulk: Attorney at Law",
		kind: "Series",
		// 2. Release information
		releaseDate: "2022",
		released: true,
		// 3. Chronological information
		when: "2025 (approx.)",
		timelineOrder: 530,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Episodes
		episodes: [
			{ episode: 1, title: "A Normal Amount of Rage", duration: "38m" },
			{ episode: 2, title: "Superhuman Law", duration: "31m" },
			{ episode: 3, title: "The People vs. Emil Blonsky", duration: "35m" },
			{ episode: 4, title: "Is This Not Real Magic?", duration: "37m" },
			{ episode: 5, title: "Mean, Green, and Straight Poured into These Jeans", duration: "32m" },
			{ episode: 6, title: "Just Jen", duration: "31m" },
			{ episode: 7, title: "The Retreat", duration: "35m" },
			{ episode: 8, title: "Ribbit and Rip It", duration: "37m" },
			{ episode: 9, title: "Whose Show Is This?", duration: "36m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/kat4QOmQTGnQf6KsGFzD0Zcl1xL.jpg",
		description: "Jennifer Walters, a lawyer who gains Hulk-like abilities, navigates her dual life as a superhero and attorney.",
		note: "",
	},
	{
		// 1. Identity
		title: "Ms. Marvel",
		kind: "Series",
		// 2. Release information
		releaseDate: "2022",
		released: true,
		// 3. Chronological information
		when: "2025",
		timelineOrder: 540,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. Episodes
		episodes: [
			{ episode: 1, title: "Generation Why", duration: "50m" },
			{ episode: 2, title: "Crushed", duration: "52m" },
			{ episode: 3, title: "Destined", duration: "48m" },
			{ episode: 4, title: "Seeing Red", duration: "49m" },
			{ episode: 5, title: "Time and Again", duration: "42m" },
			{ episode: 6, title: "No Normal", duration: "50m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/85XBS9wOytGvcOEL1qmNr3OPuMg.jpg",
		description: "Kamala Khan, a teenage superhero fan, gains shape-shifting abilities and navigates her new life as Ms. Marvel.",
		note: "",
	},
	{
		// 1. Identity
		title: "Thor: Love and Thunder",
		kind: "Film",
		// 2. Release information
		releaseDate: "2022",
		released: true,
		// 3. Chronological information
		when: "2025 (approx.)",
		timelineOrder: 550,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. runtime
		duration: "2h 1m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/6eFDnvpsgPMrxcVnLCM12rBv8Fk.jpg",
		description: "Thor embarks on a journey of self-discovery while facing a new threat in the form of Gorr the God Butcher.",
		note: "",
	},
	{
		// 1. Identity
		title: "Ironheart",
		kind: "Series",
		// 2. Release information
		releaseDate: "2024",
		released: true,
		// 3. Chronological information
		when: "2026 (approx.)",
		timelineOrder: 560,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Five",
		// 5. Episodes
		episodes: [
			{ episode: 1, title: "Take Me Home", duration: "44m" },
			{ episode: 2, title: "Will the Real Natalie Please Stand Up?", duration: "51m" },
			{ episode: 3, title: "We in Danger, Girl", duration: "56m" },
			{ episode: 4, title: "Bad Magic", duration: "53m" },
			{ episode: 5, title: "Karma's Glitch", duration: "1h" },
			{ episode: 6, title: "The Past Is the Past", duration: "42m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/3yJ5DeoOHSWjc23yYYgoAHn7e9b.jpg",
		description: "Riri Williams, a young genius, creates the Ironheart armor and steps into the superhero world.",
		note: "",
	},
	{
		// 1. Identity
		title: "Werewolf by Night",
		kind: "Special",
		// 2. Release information
		releaseDate: "2022",
		released: true,
		// 3. Chronological information
		when: "2025 (approx.)",
		timelineOrder: 570,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. runtime
		duration: "55m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/wqh54zv29b3x6x3ua53u4orS5lt.jpg",
		description: "A special that delves into the mysterious world of werewolves within the MCU.",
		note: "",
	},
	{
		// 1. Identity
		title: "The Guardians of the Galaxy Holiday Special",
		kind: "Special",
		// 2. Release information
		releaseDate: "2022",
		released: true,
		// 3. Chronological information
		when: "Christmas 2025",
		timelineOrder: 580,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Four",
		// 5. runtime
		duration: "45m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/AtzSuOZ16Idwn5wibj5dNuqjPh5.jpg",
		description: "A holiday special featuring the Guardians of the Galaxy.",
		note: "",
	},
	{
		// 1. Identity
		title: "Ant-Man and the Wasp: Quantumania",
		kind: "Film",
		// 2. Release information
		releaseDate: "2023",
		released: true,
		// 3. Chronological information
		when: "2026 (approx.)",
		timelineOrder: 590,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Five",
		// 5. runtime
		duration: "2h 5m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/uSqlHyA7s2N4QKPYVzc1PwAJ4uc.jpg",
		description: "The third installment in the Ant-Man film series, exploring the Quantum Realm.",
		note: "",
	},
	{
		// 1. Identity
		title: "Guardians of the Galaxy Vol. 3",
		kind: "Film",
		// 2. Release information
		releaseDate: "2023",
		released: true,
		// 3. Chronological information
		when: "2026",
		timelineOrder: 600,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Five",
		// 5. runtime
		duration: "2h 30m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/u3a7hKGhQehkgVq9dt1DohzNk8F.jpg",
		description: "The third installment in the Guardians of the Galaxy film series.",
		note: "",
	},
	{
		// 1. Identity
		title: "Secret Invasion",
		kind: "Series",
		// 2. Release information
		releaseDate: "2023",
		released: true,
		// 3. Chronological information
		when: "2026",
		timelineOrder: 610,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Five",
		// 5. Episodes
		episodes: [
			{ episode: 1, title: "Ressurrection", duration: "55m" },
			{ episode: 2, title: "Promises", duration: "58m" },
			{ episode: 3, title: "Betrayed", duration: "44m" },
			{ episode: 4, title: "Beloved", duration: "38m" },
			{ episode: 5, title: "Harvest", duration: "39m" },
			{ episode: 6, title: "Home", duration: "38m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/8nmbwPqqRGCRQKiCiY7nU4oqlOs.jpg",
		description: "A series about the Skrull infiltration of Earth.",
		note: "",
	},
	{
		// 1. Identity
		title: "The Marvels",
		kind: "Film",
		// 2. Release information
		releaseDate: "2023",
		released: true,
		// 3. Chronological information
		when: "2026",
		timelineOrder: 620,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Five",
		// 5. Runtime
		duration: "1h 47m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/4OPMEWwn5rgccx3pFNSEeNFIVMA.jpg",
		description: "The sequel to Captain Marvel, featuring Carol Danvers and Kamala Khan.",
		note: "",
	},
	{
		// 1. Identity
		title: "Loki",
		kind: "Series",
		// 2. Release information
		releaseDate: "2023",
		released: true,
		// 3. Chronological information
		when: "Outside linear time",
		timelineOrder: 630,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Five",
		// 5. Episodes
		season: 2,
		episodes: [
			{ episode: 1, title: "Ouroboros", duration: "48m" },
			{ episode: 2, title: "Breaking brad", duration: "52m" },
			{ episode: 3, title: "1893", duration: "56m" },
			{ episode: 4, title: "Heart of the TVA", duration: "51m" },
			{ episode: 5, title: "Science/Fiction", duration: "47m" },
			{ episode: 6, title: "Glorious Purpose", duration: "59m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/6uEGQvlfel4E1TSFXMpr8i5Rux7.jpg",
		description: "The second season of Loki, continuing the adventures of the God of Mischief.",
		note: "",
	},
	{
		// 1. Identity
		title: "What If…?",
		kind: "Series",
		// 2. Release information
		releaseDate: "2023",
		released: true,
		// 3. Chronological information
		when: "Multiverse / alternate realities",
		timelineOrder: 640,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Five",
		// 5. Episodes
		season: 2,
		episodes: [
			{ episode: 1, title: "What If... Nebula Joined the Nova Corps?", duration: "31m" },
			{ episode: 2, title: "What If... Peter Quill Attacked Earth's Mightiest Heroes?", duration: "33m" },
			{ episode: 3, title: "What If... Happy Hogan Saved Christmas?", duration: "30m" },
			{ episode: 4, title: "What If... Iron Man Crashed Into the Grandmaster?", duration: "34m" },
			{ episode: 5, title: "What If... Captain Carter Fought the Hydra Stomper?", duration: "33m" },
			{ episode: 6, title: "What If... Kahhori Reshaped the World?", duration: "34m" },
			{ episode: 7, title: "What If... Hela Found the Ten Rings?", duration: "31m" },
			{ episode: 8, title: "What If... the Avengers Assembled in 1602?", duration: "32m" },
			{ episode: 9, title: "What If... Strange Supreme Intervened?", duration: "30m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/5wQYA38UusSqFCJ1a7RkGM4KOY8.jpg",
		description: "The second season of What If…?, exploring alternate realities in the MCU.",
		note: "",
	},
	{
		// 1. Identity
		title: "Deadpool & Wolverine",
		kind: "Film",
		// 2. Release information
		releaseDate: "2024",
		released: true,
		// 3. Chronological information
		when: "2024 / TVA (multiverse)",
		timelineOrder: 650,
		branch: "Main",
		universe: "TVA / outside time",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Five",
		// 5. Runtime
		duration: "2h 11m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/wNa8cZp4fjF5Fa1oE5HhF6Km7kK.jpg",
		description: "Deadpool & Wolverine film set in the MCU multiverse.",
		note: "",
	},
	{
		// 1. Identity
		title: "Agatha All Along",
		kind: "Series",
		// 2. Release information
		releaseDate: "2024",
		released: true,
		// 3. Chronological information
		when: "2026 (approx.)",
		timelineOrder: 660,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Five",
		// 5. Episodes
		episodes: [
			{ episode: 1, title: "Seekest Thou the Road", duration: "43m" },
			{ episode: 2, title: "Circle Sewn With Fate / Unlock Thy Hidden Gate", duration: "44m" },
			{ episode: 3, title: "Through Many Miles / Of Tricks and Trails", duration: "39m" },
			{ episode: 4, title: "If I Can't Reach You / Let My Song Teach You", duration: "44m" },
			{ episode: 5, title: "Darkest Hour / Wake Thy Power", duration: "32m" },
			{ episode: 6, title: "Familiar by Thy Side", duration: "50m" },
			{ episode: 7, title: "Death's Hand in Mine", duration: "37m" },
			{ episode: 8, title: "Follow Me My Friend / To Glory at the End", duration: "49m" },
			{ episode: 9, title: "Hidden Mother Crone", duration: "42m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/3ViiCcM5GNSUkbjNFTw4hB4wxuz.jpg",
		description: "Agatha All Along series set in the MCU.",
		note: "",
	},
	{
		// 1. Identity
		title: "What If…?",
		kind: "Series",
		// 2. Release information
		releaseDate: "2024",
		released: true,
		// 3. Chronological information
		when: "Multiverse / alternate realities",
		timelineOrder: 670,
		branch: "Main",
		universe: "TVA / outside time",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Five",
		// 5. Episodes
		season: 3,
		episodes: [
			{ episode: 1, title: "What If... The Hulk Fought the Mech Avengers?", duration: "31m" },
			{ episode: 2, title: "What If... Agatha Went to Hollywood?", duration: "30m" },
			{ episode: 3, title: "What If... The Red Guardian Stopped the Winter Soldier?", duration: "33m" },
			{ episode: 4, title: "What If... Howard the Duck Got Hitched?", duration: "33m" },
			{ episode: 5, title: "What If... The Emergence Destroyed the Earth?", duration: "33m" },
			{ episode: 6, title: "What If... 1872?", duration: "33m" },
			{ episode: 7, title: "What If... The Watcher Disappeared?", duration: "28m" },
			{ episode: 8, title: "What If... What If?", duration: "28m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/1Lwiircsz8txVOlNCoIA9e8fxfH.jpg",
		description: "What If…? series set in the MCU.",
		note: "",
	},
	{
		// 1. Identity
		title: "Daredevil: Born Again",
		kind: "Series",
		// 2. Release information
		releaseDate: "2025",
		released: true,
		// 3. Chronological information
		when: "2026",
		timelineOrder: 680,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Five",
		// 5. Episodes
		season: 1,
		episodes: [
			{ episode: 1, title: "Heaven's Half Hour", duration: "1h" },
			{ episode: 2, title: "Optics", duration: "50m" },
			{ episode: 3, title: "The Hollow of His Hand", duration: "47m" },
			{ episode: 4, title: "Sic Semper Systema", duration: "55m" },
			{ episode: 5, title: "With Interest", duration: "42m" },
			{ episode: 6, title: "Excessive Force", duration: "45m" },
			{ episode: 7, title: "Art for Art's Sake", duration: "43m" },
			{ episode: 8, title: "Isle of Joy", duration: "52m" },
			{ episode: 9, title: "Straight to Hell", duration: "1h" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/oRbyCL4LrFMWBJRHJ3utB5H2ctc.jpg",
		description: "Daredevil: Born Again series set in the MCU.",
		note: "",
	},
	{
		// 1. Identity
		title: "Captain America: Brave New World",
		kind: "Film",
		// 2. Release information
		releaseDate: "2025",
		released: true,
		// 3. Chronological information
		when: "2027",
		timelineOrder: 690,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Five",
		// 5. Runtime
		duration: "2h",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/kpdDX6fjkvqyv2EocsH7AaTBt4.jpg",
		description: "Captain America must unravel a nefarious global plot before the mastermind has the world seeing red.",
		note: "",
	},
	{
		// 1. Identity
		title: "Thunderbolts*",
		kind: "Film",
		// 2. Release information
		releaseDate: "2025",
		released: true,
		// 3. Chronological information
		when: "2027",
		timelineOrder: 700,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Five",
		// 5. Runtime
		duration: "2h 9m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/cDWm1Onn5SFbKVZy42eHxEcCnv9.jpg",
		description: "an unconventional team of antiheroes embarks on a dangerous mission.",
		note: "",
	},
	{
		// 1. Identity
		title: "The Fantastic Four: First Steps",
		kind: "Film",
		// 2. Release information
		releaseDate: "2025",
		released: true,
		// 3. Chronological information
		when: "1960s (Earth-828)",
		timelineOrder: 710,
		branch: "Main",
		universe: "Earth-828",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Six",
		// 5. Runtime
		duration: "1h 55m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/zIDW9EWN8FRJyVd1bQBjkWlnfqB.jpg",
		description: "The origin story of the Fantastic Four in the MCU.",
		note: "",
	},
	{
		// 1. Identity
		title: "Wonder Man",
		kind: "Series",
		// 2. Release information
		releaseDate: "2026",
		released: true,
		// 3. Chronological information
		when: "2026",
		timelineOrder: 720,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Six",
		// 5. Runtime
		episodes: [
			{ episode: 1, title: "Matinee", duration: "35m" },
			{ episode: 2, title: "Self-Tape", duration: "34m" },
			{ episode: 3, title: "Pacoima", duration: "34m" },
			{ episode: 4, title: "Doorman", duration: "32m" },
			{ episode: 5, title: "Found Footage", duration: "26m" },
			{ episode: 6, title: "Callback", duration: "36m" },
			{ episode: 7, title: "Kathy Friedman", duration: "35m" },
			{ episode: 8, title: "Yucca Valley", duration: "35m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/6hOdQXmTXCuukXSmKnj9FVZMPPf.jpg",
		description: "The story of Wonder Man in the MCU.",
		note: "",
	},
	{
		// 1. Identity
		title: "Daredevil: Born Again",
		kind: "Series",
		// 2. Release information
		releaseDate: "2026",
		released: true,
		// 3. Chronological information
		when: "2027",
		timelineOrder: 730,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Six",
		// 5. Episodes
		season: 2,
		episodes: [
			{ episode: 1, title: "The Northern Star", duration: "54m" },
			{ episode: 2, title: "Shoot the Moon", duration: "49m" },
			{ episode: 3, title: "The Scales & The Sword", duration: "50m" },
			{ episode: 4, title: "Gloves off", duration: "54m" },
			{ episode: 5, title: "The Grand Design", duration: "53m" },
			{ episode: 6, title: "Requiem", duration: "52m" },
			{ episode: 7, title: "The Hateful Darkness", duration: "54m" },
			{ episode: 8, title: "The Southern Cross", duration: "55m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/zuqjhHp97lJ3XrfAS8g6CGcRvBi.jpg",
		description: "The story of Daredevil in the MCU.",
		note: "",
	},
	{
		// 1. Identity
		title: "The Punisher: One Last Kill",
		kind: "Special",
		// 2. Release information
		releaseDate: "2026",
		released: true,
		// 3. Chronological information
		when: "2027",
		timelineOrder: 740,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Six",
		// 5. Runtime
		duration: "51m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/mYfUgi1QvJl89eDmTpkU1oPuohC.jpg",
		description: "The story of The Punisher in the MCU.",
		note: "",
	},
	{
		// 1. Identity
		title: "Spider-Man: Brand New Day",
		kind: "Film",
		// 2. Release information
		releaseDate: "2026",
		released: true,
		// 3. Chronological information
		when: "2028",
		timelineOrder: 750,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Six",
		// 5. Runtime
		duration: "2h 25m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/2vXgjHbqHncCuT3kdQLgsXc5Fmh.jpg",
		description: "The story of Spider-Man in the MCU.",
		note: "Upcoming; placement is provisional, after One Last Kill",
	},
	{
		// 1. Identity
		title: "VisionQuest",
		kind: "Series",
		// 2. Release information
		releaseDate: "2026",
		released: true,
		// 3. Chronological information
		when: "2028 (approx.)",
		timelineOrder: 760,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Six",
		// 5. Episodes
		episodes: [
			{ episode: 1, title: "No Strings", duration: "56m" },
			{ episode: 2, title: "Theseus", duration: "48m" },
			{ episode: 3, title: "Reboot", duration: "54m" },
			{ episode: 4, title: "Malware", duration: "51m" },
			{ episode: 5, title: "Firewall", duration: "48m" },
			{ episode: 6, title: "Deadlock", duration: "57m" },
			{ episode: 7, title: "Immolation", duration: "1h 5m" },
			{ episode: 8, title: "Forever", duration: "1h 12m" },
		],
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/hzuvw1ypblYg2uJxVgz1dkeIvKd.jpg",
		description: "The story of Vision in the MCU.",
		note: "Upcoming; exact chronology may change",
	},
	{
		// 1. Identity
		title: "Avengers: Doomsday",
		kind: "Film",
		// 2. Release information
		releaseDate: "2026",
		released: false,
		// 3. Chronological information
		when: "TBA",
		timelineOrder: 770,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Six",
		// 5. Runtime
		duration: "2h 45m",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/43bW9GR6HHWoh5H99yA4lzbLq2g.jpg",
		description: "The story of the Avengers in the MCU.",
		note: "Upcoming; exact chronology may change",
	},
	{
		// 1. Identity
		title: "Avengers: Secret Wars",
		kind: "Film",
		// 2. Release information
		releaseDate: "2027",
		released: false,
		// 3. Chronological information
		when: "TBA",
		timelineOrder: 780,
		branch: "Main",
		universe: "Earth-616",
		canonStatus: "MCU canon",
		// 4. Classification
		continuity: "MCU",
		phase: "Phase Six",
		// 5. Runtime
		duration: "TBA",
		// 6. Metadata
		posterPath: "",
		thumbnailPath: "/rytc6Lf4447C0CDncwFa4gxe0vY.jpg",
		description: "The story of the Avengers in the MCU.",
		note: "Upcoming; exact chronology may change",
	},
];
