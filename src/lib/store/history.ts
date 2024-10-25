import { writable, type Writable } from "svelte/store";
import type { Track } from "$lib/types";

export const history: Writable<Track[]> = writable([]);

export async function addToHistory(track: Track) {
    const response = await fetch("/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(track)
    });

    if (response.ok) {
        const data = await response.json();
        history.set(data);
    }
}
