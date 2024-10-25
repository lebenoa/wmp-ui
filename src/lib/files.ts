import { tracks } from "./store/tracks";
import { history } from "./store/history";
import type { ApiReponse } from "./types";

export async function fetchFilesAndHistory() {
    const response = await fetch("/api/files");
    const data: ApiReponse = await response.json();

    tracks.set(data.files);
    history.set(data.recently_played);
}
