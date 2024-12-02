import { tracks } from "./store/tracks";
import { history } from "./store/history";
import type { ApiReponse, Track } from "./types";
import { groupByArtist } from "./store/group-by-artist";

export async function fetchFilesAndHistory() {
	const response = await fetch("/api/files");
	const data: ApiReponse = await response.json();

	tracks.set(data.files);
	history.set(data.recently_played);
}

export async function fetchGroupByArtist() {
	const response = await fetch("/api/artist-playlist");
	const data: Record<string, Track[]> = await response.json();

	groupByArtist.set(data);
}
