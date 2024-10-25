export interface Player {
	title: string | null;
	artist: string;
	thumbnail: string | null;
	duration: number;
	isPlaying: boolean;
	isLooping: boolean;
}

export interface Track {
	filename: string;
	title: string;
	artist: string;
	artists: string[] | null;
	thumbnail: string | null;
	artist_thumbnail: string | null;
	duration: number;
}

export interface QueueItem extends Track {
	url: string;
}

export type ApiReponse = {
	recently_played: Track[];
	files: Track[];
};

export type Session = {
	current_time: number;
	current_index: number;
	queue: QueueItem[];
}
