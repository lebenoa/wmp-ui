<script lang="ts">
    export let data: Track[];
    export let searchTerm: string = "";
    export let editMode: boolean = false;

    import type { Track } from "$lib/types";
    import { queue } from "$lib/store/queue";
    import { settings } from "$lib/store/settings";
    import { flyAndScale } from "$lib/utils";
    import { fade } from "svelte/transition";

    import * as Sheet from "./ui/sheet";
    import Spinner from "./icon/spinner.svelte";
    import { Button } from "./ui/button";
    import { Input } from "./ui/input";
    import { Label } from "./ui/label";
    import X from "./icon/x.svelte";
    import ImageContainer from "./ImageContainer.svelte";
    import Trash from "./icon/trash.svelte";

    interface Filtered extends Track {
        displayTitle: string | undefined;
        displayArtist: string | undefined;
    }

    // @ts-ignore
    let displayData: Filtered[] = data;

    $: if (searchTerm != "") {
        const filtered: Filtered[] = [];

        for (let i = 0; i < data.length; i++) {
            const file: Filtered = {
                ...data[i],
                displayTitle: data[i].title,
                displayArtist: data[i].artist
            };

            const titleLowerCase = file.title.toLowerCase();
            const artistLowerCase = file.artist.toLowerCase();
            const searchTermLowerCase = searchTerm.toLowerCase();

            if (titleLowerCase.includes(searchTermLowerCase)) {
                const startIndex = titleLowerCase.indexOf(searchTermLowerCase);
                file.displayTitle =
                    file.title.substring(0, startIndex) +
                    '<span class="bg-primary text-primary-foreground font-bold">' +
                    file.title.substring(startIndex, startIndex + searchTerm.length) +
                    "</span>" +
                    file.title.substring(startIndex + searchTerm.length);
            } else if (artistLowerCase.includes(searchTermLowerCase)) {
                const startIndex = artistLowerCase.indexOf(searchTermLowerCase);
                file.displayArtist =
                    file.artist.substring(0, startIndex) +
                    '<span class="bg-primary text-primary-foreground font-bold">' +
                    file.artist.substring(startIndex, startIndex + searchTerm.length) +
                    "</span>" +
                    file.artist.substring(startIndex + searchTerm.length);
            } else {
                continue;
            }

            filtered.push(file);
        }

        displayData = filtered;
    } else {
        // @ts-ignore
        displayData = data;
    }

    let containerStyle = "";
    let imgContainerStyle = "";
    let buttonStyle = "";
    let textContainerStyle = "";
    let textStyle = "";

    $: if ($settings.localFileLayout === "list") {
        containerStyle = "flex h-full flex-col overflow-auto";
        imgContainerStyle = "mr-2 w-16";
        buttonStyle = "grid grid-cols-[auto_1fr]";
        textContainerStyle = "text-start";
        textStyle = " overflow-hidden text-ellipsis whitespace-nowrap";
    } else {
        // Defulat to grid
        containerStyle =
            "grid h-full grid-cols-3 overflow-auto sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8";
        imgContainerStyle = "mb-2";
        buttonStyle = "flex flex-col";
        textContainerStyle = "";
        textStyle = "";
    }

    let stateHolder: any = {};

    // @ts-ignore
    let info: Track | Filtered = {};
    let drawerState = false;
</script>

<Sheet.Root bind:open={drawerState}>
    <Sheet.Content>
        <div class="flex size-full flex-col items-center justify-center">
            <Sheet.Header class="w-full">
                <Sheet.Title>Edit: {info.title}</Sheet.Title>
                <Sheet.Description>By: {info.artist}</Sheet.Description>
                <Button
                    variant="destructive"
                    class="my-4 w-full"
                    on:click={async () => {
                        stateHolder.deleting = info.title;

                        // await new Promise((resolve) => setTimeout(resolve, 1000000));

                        const response = await fetch("/api/delete", {
                            method: "POST",
                            body: info.filename
                        });

                        if (response.ok) {
                            drawerState = false;
                            for (let i = 0; i < data.length; i++) {
                                const file = data[i];
                                if (file.filename === info.filename) {
                                    data.splice(i, 1);
                                    data = data;
                                    break;
                                }
                            }
                        } else {
                            console.error("Error deleting track: ", response.statusText);
                        }

                        delete stateHolder.deleting;
                    }}
                >
                    {#if stateHolder.deleting}
                        <Spinner
                            containerClass="w-8 h-8 mr-2 flex items-center w-full"
                            className="w-8 h-8"
                            color="fill-white"
                        />
                        Deleting...
                    {:else}
                        <Trash />
                        Delete This File
                    {/if}
                </Button>
            </Sheet.Header>

            <form
                action="/api/edit"
                method="POST"
                enctype="multipart/form-data"
                class="flex flex-col gap-2"
                on:submit|preventDefault={async (e) => {
                    const response = await fetch("/api/edit", {
                        method: "POST",
                        // @ts-ignore
                        body: new FormData(e.target)
                    });

                    if (response.ok) {
                        drawerState = false;

                        for (let i = 0; i < data.length; i++) {
                            const file = data[i];
                            if (file.filename === info.filename) {
                                file.title = info.title;
                                file.artist = info.artist;
                                file.thumbnail = info.thumbnail;
                                break;
                            }
                        }

                        data = data;
                    } else {
                        console.error("Error editing track: ", response.statusText);
                    }
                }}
            >
                <input type="hidden" name="filename" value={info.filename} />
                <Label>
                    <span class="mb-2">Title</span>
                    <Input
                        class="text-lg"
                        type="text"
                        name="title"
                        placeholder="Title"
                        bind:value={info.title}
                    />
                </Label>
                <Label>
                    <span class="mb-2">Artist</span>
                    <Input
                        class="text-lg"
                        type="text"
                        name="artist"
                        placeholder="Artist"
                        bind:value={info.artist}
                    />
                </Label>
                <Label>
                    <span>Cover</span>
                    <span class="text-muted-foreground">(Click to upload)</span>
                    <div class="relative mt-1">
                        <input
                            type="file"
                            name="thumbnail"
                            class="absolute h-full w-full cursor-pointer opacity-0"
                            accept="image/jpeg,image/png"
                            on:input={(e) => {
                                const target = e.target;
                                // @ts-ignore
                                const file = target.files?.[0];
                                if (file) {
                                    info.thumbnail = URL.createObjectURL(file);
                                    info.thumbnail = info.thumbnail;
                                }
                            }}
                        />
                        <img src={info.thumbnail} alt={info.title} />
                    </div>
                </Label>
                <Button
                    type="button"
                    variant="secondary"
                    class="mb-4"
                    on:click={async () => {
                        const response = await fetch("/api/crop", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                filename: info.filename,
                                image: info.thumbnail
                            })
                        });

                        if (response.ok) {
                            drawerState = false;

                            for (let i = 0; i < data.length; i++) {
                                const file = data[i];
                                if (file.filename === info.filename) {
                                    file.thumbnail = `${info.thumbnail}?t=${Date.now()}`;
                                    break;
                                }
                            }

                            data = data;
                        } else {
                            console.error("Error cropping track: ", response.statusText);
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
                        <path d="M6 2v14a2 2 0 0 0 2 2h14" /><path d="M18 22V8a2 2 0 0 0-2-2H2" />
                    </svg>
                    Crop Cover to Square
                </Button>

                <Button type="submit">
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
                        <path
                            d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
                        />
                        <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
                        <path d="M7 3v4a1 1 0 0 0 1 1h7" />
                    </svg>
                    Save
                </Button>
            </form>

            <Sheet.Footer class="w-full pt-0 lg:mb-10">
                <Sheet.Close asChild let:builder>
                    <Button variant="outline" class="w-full" builders={[builder]}>
                        <X />
                        Cancel
                    </Button>
                </Sheet.Close>
            </Sheet.Footer>
        </div>
    </Sheet.Content>
</Sheet.Root>

<div transition:fade class={containerStyle}>
    {#each displayData as file}
        <button
            class="relative w-full cursor-pointer {buttonStyle} items-center p-1 transition-all active:bg-secondary lg:hover:bg-secondary"
            on:click={async () => {
                if (editMode) {
                    info = file;
                    drawerState = true;
                } else {
                    // player.playAudio(`/m/${file.filename}`, file);
                    // addToHistory(file);
                    queue.addToQueue({ ...file, url: `/m/${file.filename}` });
                }
            }}
            in:flyAndScale={{ y: 20, delay: 200, duration: 200 }}
            out:flyAndScale={{ y: 20, duration: 200 }}
        >
            <!-- <div
                class="flex aspect-square items-center justify-center bg-black {imgContainerStyle}"
            >
                <img class="w-full" src={file.thumbnail ?? "/wide-idle.png"} alt={file.title} />
            </div> -->
            <ImageContainer CLASS={imgContainerStyle} src={file.thumbnail} alt={file.title} />
            <div class={textContainerStyle}>
                <h1 class="w-full text-xl{textStyle}">
                    {@html file.displayTitle ?? file.title}
                </h1>
                <h2 class="w-full text-muted-foreground{textStyle}">
                    {@html file.displayArtist ?? file.artist}
                </h2>
            </div>
        </button>
    {/each}
</div>
