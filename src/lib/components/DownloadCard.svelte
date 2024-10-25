<script lang="ts">
    export let urlOrId: string;

    import { player } from "$lib/store/player";

    import { Button } from "./ui/button";
    import { Skeleton } from "./ui/skeleton";
    import Refresh from "./icon/refresh.svelte";
    import X from "./icon/x.svelte";
    import * as Card from "./ui/card";

    import { durationToText, flyAndScale } from "$lib/utils";
    import { fetchFilesAndHistory } from "$lib/files";
    import { createEventDispatcher } from "svelte";
    import ImageContainer from "./ImageContainer.svelte";

    const dispatch = createEventDispatcher();

    let info: {
        title: string;
        artist: string;
        thumbnail: string;
        duration: number;
    } = {
        title: "",
        artist: "",
        thumbnail: "",
        duration: 0
    };

    async function download(): Promise<any> {
        // await new Promise((r) => setTimeout(r, 9999999));
        const response = await fetch(`/download`, {
            method: "POST",
            body: urlOrId
        });

        if (!response.ok) {
            throw new Error(await response.text());
        } else {
            info = await response.json();
            fetchFilesAndHistory();
            return info;
        }
    }

    let promise = download();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="relative flex w-full flex-col items-center"
    in:flyAndScale={{ y: 20, delay: 200, duration: 200 }}
    out:flyAndScale={{ y: 20, duration: 200 }}
    on:contextmenu={() =>
        dispatch("contextmenu", {
            info: info.title != "" ? info.title : urlOrId
        })}
>
    {#await promise}
        <Card.Root class="flex w-full flex-col">
            <Card.Header class="p-1">
                <div class="relative w-full">
                    <Skeleton class="aspect-square w-full" />
                    <span class="absolute bottom-1 right-1 bg-background px-1"> -:-- </span>
                </div>
                <Card.Title class="flex items-center justify-center text-center">
                    <Skeleton class="h-4 w-36" />
                </Card.Title>
                <Card.Description class="flex items-center justify-center text-center">
                    <Skeleton class="h-4 w-28" />
                </Card.Description>
            </Card.Header>
            <Card.Footer class="mt-auto p-1">
                <Skeleton class="h-8 w-full" />
            </Card.Footer>
        </Card.Root>
    {:then info}
        <Card.Root class="flex w-full flex-col">
            <Card.Header class="p-1">
                <div class="relative w-full">
                    <img class="w-full" src={info.thumbnail} alt={info.title} />
                    <span class="absolute bottom-1 right-1 bg-background px-1">
                        {durationToText(info.duration)}
                    </span>
                </div>
                <Card.Title class="text-center">{info.title}</Card.Title>
                <Card.Description class="flex items-center justify-center text-center">
                    {info.artist}
                </Card.Description>
            </Card.Header>
            <Card.Footer class="mt-auto p-1">
                <Button
                    class="flex w-full flex-row"
                    on:click={() => {
                        player.playAudio(`/m/${info.title}.mp3`, {
                            title: info.title,
                            artist: info.artist,
                            artists: null,
                            thumbnail: info.thumbnail,
                            duration: info.duration,
                            filename: info.title,
                            artist_thumbnail: null
                        });
                    }}
                >
                    <svg class="mr-2" width="24" height="24" version="2.0">
                        <use href="#play-icon"></use>
                    </svg>
                    Play
                </Button>
                <Button
                    variant="secondary"
                    class="flex w-full flex-row"
                    on:click={() => dispatch("dismiss")}
                >
                    <X />
                    Dismiss
                </Button>
            </Card.Footer>
        </Card.Root>
    {:catch error}
        <Card.Root class="flex w-full flex-col">
            <Card.Header class="p-1">
                <div class="relative w-full">
                    <img class="w-full" src="/idle.png" alt="idle" />
                    <span class="absolute bottom-1 right-1 bg-background px-1"> -:-- </span>
                </div>
                <Card.Title class="text-center text-red-500">ERROR</Card.Title>
                <Card.Description class="flex items-center justify-center text-center">
                    {error}
                </Card.Description>
            </Card.Header>
            <Card.Footer class="mt-auto p-1">
                <Button class="w-full" on:click={() => (promise = download())}>
                    <Refresh />
                    Try Again
                </Button>
                <Button variant="secondary" class="w-full" on:click={() => dispatch("dismiss")}>
                    <X />
                    Dismiss
                </Button>
            </Card.Footer>
        </Card.Root>
    {/await}
</div>
