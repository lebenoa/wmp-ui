<script lang="ts">
    import ImageContainer from "./ImageContainer.svelte";
    import { Button } from "./ui/button";
    import QueueSheet from "./QueueSheet.svelte";
    import * as Command from "./ui/command";
    import { Slider } from "./ui/slider";

    import { player, currentTime } from "$lib/store/player";
    import { queue } from "$lib/store/queue";
    import { durationToText, flyAndScale, shuffleArray } from "$lib/utils";
    import { tracks } from "$lib/store/tracks";
    import { addToHistory } from "$lib/store/history";
    import { settings } from "$lib/store/settings";
    import Trash from "./icon/trash.svelte";

    let open = false;
    let queueOpen = false;
</script>

<Command.Dialog bind:open>
    <Command.Input placeholder="Type a command or search..." />
    <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group heading="Player Controls">
            <Command.Item
                onSelect={() => {
                    player.toggleLoop();
                }}
            >
                <svg class="mr-2" width="24" height="24" version="2.0"
                    ><use href="#loop-icon"></use></svg
                >
                Set Loop to {$player.isLooping ? "off" : "on"}
            </Command.Item>
        </Command.Group>
        <Command.Group heading="Magic">
            <Command.Item
                onSelect={() => {
                    const randed = $tracks[Math.floor(Math.random() * $tracks.length)];
                    player.playAudio(`/m/${randed.filename}`, randed);
                    addToHistory(randed);
                    open = false;
                }}
            >
                <svg
                    class="mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <path d="M12 12h.01" />
                </svg>
                Pick one for me!
            </Command.Item>
            <Command.Item
                onSelect={() => {
                    let copy = $tracks.map((t) => ({ ...t, url: `/m/${t.filename}` }));
                    shuffleArray(copy);
                    queue.setQueue(copy);
                    open = false;
                }}
            >
                <svg
                    class="mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path
                        d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"
                    />
                    <path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path
                        d="M10 2v2"
                    />
                    <path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></svg
                >
                Shuffle ALL local files to playlist
            </Command.Item>
        </Command.Group>
        <Command.Group heading="Playlist">
            <Command.Item
                onSelect={async () => {
                    let response = await fetch("/load-playlist");

                    if (response.ok) {
                        let data = await response.json();
                        queue.setSession(data);
                        open = false;
                    }
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                >
                    <path d="m16 6-4-4-4 4" />
                    <path d="M12 2v8" />
                    <rect width="20" height="8" x="2" y="14" rx="2" />
                    <path d="M6 18h.01" />
                    <path d="M10 18h.01" />
                </svg>
                Load Playlist
            </Command.Item>
            <Command.Item
                onSelect={async () => {
                    await fetch("/save-playlist", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(queue.getSession())
                    });
                    open = false;
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                >
                    <path d="M12 2v8" />
                    <path d="m16 6-4 4-4-4" />
                    <rect width="20" height="8" x="2" y="14" rx="2" />
                    <path d="M6 18h.01" />
                    <path d="M10 18h.01" />
                </svg>
                Save Playlist
            </Command.Item>
        </Command.Group>
        <Command.Group heading="Misc">
            <Command.Item
                onSelect={() => {
                    open = false;
                    queueOpen = true;
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="mr-2"
                >
                    <path d="M5 12s2.545-5 7-5c4.454 0 7 5 7 5s-2.546 5-7 5c-4.455 0-7-5-7-5z" />
                    <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /><path
                        d="M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"
                    />
                    <path d="M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" /></svg
                >
                View Queue
            </Command.Item>
            <Command.Item
                onSelect={() => {
                    queue.clearQueue();
                }}
            >
                <Trash />
                Clear Queue
            </Command.Item>
        </Command.Group>
    </Command.List>
</Command.Dialog>

<QueueSheet manualTrigger={true} bind:open={queueOpen} />

<div
    class="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-[auto_1fr] items-center gap-4 border-t border-secondary bg-background p-4 pb-6 shadow-background/70 lg:pb-4"
    style="box-shadow: 0px -10px 11px 1px var(--tw-shadow-color);"
>
    <ImageContainer
        CLASS="border border-secondary w-[125px] h-[125px] md:w-[175px] md:h-[175px] lg:w-[225px] lg:h-[225px]"
        src={$player?.thumbnail}
    />
    <div class="flex h-full w-full flex-col justify-evenly overflow-hidden">
        <div class="w-full overflow-x-auto text-start">
            <h1 class="text-nowrap text-xl font-bold lg:text-2xl">
                {$player.title ?? "Nothing is playing"}
            </h1>
            <h2 class="text-md text-nowrap text-gray-400 lg:text-lg">
                {$player.artist ?? "No Artist"}
            </h2>
        </div>
        <div class="mt-auto flex w-full flex-row text-lg">
            <span>{durationToText($currentTime)}</span>
            <span class="ml-auto">{durationToText($player.duration)}</span>
        </div>
        <input
            class="w-full cursor-pointer"
            type="range"
            min="0"
            max={$player.duration}
            step="0.01"
            on:input={(e) => {
                // @ts-ignore
                player.seek(parseFloat(e.target.value));
            }}
            value={$currentTime}
        />
        <div class="mb-2 flex w-full flex-row items-center justify-start lg:mt-auto">
            <Button variant="secondary" on:click={() => queue.prev()} title="Previous">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </Button>
            <Button
                on:click={async () => {
                    player.togglePlayPause();

                    if (!player.isPlaying()) {
                        await fetch("/save-playlist", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(queue.getSession())
                        });
                    }
                }}
                title={$player.isPlaying ? "Pause" : "Play"}
            >
                {#if $player.isPlaying}
                    <svg width="24" height="24" version="2.0" in:flyAndScale={{ y: -40 }}>
                        <use href="#pause-icon"></use>
                    </svg>
                {:else}
                    <svg width="24" height="24" version="2.0" in:flyAndScale={{ y: -40 }}>
                        <use href="#play-icon"></use>
                    </svg>
                {/if}
            </Button>
            <Button variant="secondary" on:click={() => queue.next()} title="Next">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </Button>
            <Button variant="outline" class="ml-auto mr-1" on:click={() => (open = !open)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
            </Button>
        </div>

        <div class="hidden w-full pb-[0.3rem] md:block">
            <p class="mb-1 text-start">Volume: {Math.floor($settings.volume * 100)}%</p>
            <Slider
                class="flex cursor-pointer"
                onValueChange={(value) => ($settings.volume = value[0])}
                value={[$settings.volume]}
                min={0}
                max={1}
                step={0.01}
            />
        </div>
    </div>
</div>
