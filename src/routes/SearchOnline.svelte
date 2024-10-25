<script lang="ts">
    import Search from "$lib/components/icon/search.svelte";
    import Spinner from "$lib/components/icon/spinner.svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import * as Dropdown from "$lib/components/ui/dropdown-menu";
    import { Input } from "$lib/components/ui/input";
    import * as Select from "$lib/components/ui/select";
    import Clipboard from "$lib/components/icon/clipboard.svelte";

    import { fetchFilesAndHistory } from "$lib/files";
    import { player } from "$lib/store/player";
    import { durationToText, flyAndScale } from "$lib/utils";
    import type { Track } from "$lib/types";
    import type { Selected } from "bits-ui";

    let searchTerm = "";
    let searchService: Selected<string>[] = [
        { value: "msearch", label: "YouTube Music" },
        { value: "search", label: "YouTube" }
    ];
    let selectedService = searchService[0];

    async function fetchData(): Promise<Track[]> {
        const response = await fetch(`/api/${selectedService.value}`, {
            method: "POST",
            body: searchTerm
        });

        return response.json();
    }

    async function nextPage(): Promise<Track[]> {
        if (selectedService.value != "msearch") throw new Error("not youtube music");
        const response = await fetch(`/api/msearch`, {
            method: "POST",
            body: "CODE:NEXT_PAGE"
        });

        return response.json();
    }

    let promise: Promise<Track[]>;
</script>

<form class="flex flex-row" on:submit|preventDefault={() => (promise = fetchData())}>
    <Input class="text-lg" type="search" name="q" bind:value={searchTerm} placeholder="Search..." />
    <Select.Root
        selected={selectedService}
        onSelectedChange={(select) => {
            if (select) selectedService = select;
        }}
    >
        <Select.Trigger class="w-[180px]">
            <Select.Value placeholder="Search Service" />
        </Select.Trigger>
        <Select.Content>
            <Select.Group>
                {#each searchService as service}
                    <Select.Item value={service.value} label={service.label}>
                        {service.label}
                    </Select.Item>
                {/each}
            </Select.Group>
        </Select.Content>
        <Select.Input name="favoriteFruit" />
    </Select.Root>
    <Button type="submit">
        <Search />
        Search
    </Button>
</form>
{#if promise}
    {#await promise}
        <Spinner />
    {:then data}
        <div
            class="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5"
            transition:flyAndScale
        >
            {#each data as file}
                <Card.Root class="flex flex-col">
                    <Card.Header class="p-1">
                        <div class="relative w-full">
                            <img
                                class="w-full"
                                class:aspect-square={selectedService.value == "msearch"}
                                src={file.thumbnail}
                                alt={file.title}
                            />
                            <span class="absolute bottom-1 right-1 bg-background px-1">
                                {durationToText(file.duration)}
                            </span>
                        </div>
                        <Card.Title class="text-center">{file.title}</Card.Title>
                        <Card.Description
                            class="mt-auto flex flex-row items-center justify-center gap-1 text-center"
                        >
                            {#if file.artist_thumbnail}
                                <img
                                    width="30"
                                    height="30"
                                    src={file.artist_thumbnail}
                                    alt={file.artist}
                                />
                            {/if}
                            {#if file.artists != null}
                                <p>
                                    {#each file.artists as artist, idx}
                                        <button
                                            class="lg:hover:cursor-pointer lg:hover:underline"
                                            on:click={() => {
                                                searchTerm = artist;
                                                promise = fetchData();
                                            }}
                                        >
                                            {artist}
                                        </button>
                                        {#if idx != file.artists.length - 1}
                                            ,&nbsp;
                                        {/if}
                                    {/each}
                                </p>
                            {:else}
                                <button
                                    class="lg:hover:cursor-pointer lg:hover:underline"
                                    on:click={() => {
                                        searchTerm = file.artist;
                                        promise = fetchData();
                                    }}
                                >
                                    {file.artist}
                                </button>
                            {/if}
                        </Card.Description>
                    </Card.Header>
                    <Card.Footer class="mt-auto p-1">
                        <Button
                            class="w-full"
                            on:click={async () => {
                                const response = await fetch(`/temp-download/${file.filename}`);

                                if (!response.ok) {
                                    console.error("Error downloading track: ", response.statusText);
                                } else {
                                    const newUrl = await response.text();
                                    player.playAudio(newUrl, file);
                                }
                            }}
                        >
                            <svg class="lg:mr-2" width="24" height="24" version="2.0">
                                <use href="#play-icon"></use>
                            </svg>
                            <span class="hidden lg:block">Play</span>
                        </Button>
                        <Button
                            class="w-full"
                            variant="secondary"
                            on:click={async () => {
                                const response = await fetch("/download", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: file.filename
                                });

                                if (!response.ok) {
                                    console.error("Error downloading track: ", response.statusText);
                                } else {
                                    console.log("Downloaded track: ", file.filename);
                                    fetchFilesAndHistory();
                                }
                            }}
                        >
                            <svg class="lg:mr-2" width="24" height="24" version="2.0">
                                <use href="#download-icon"></use>
                            </svg>
                            <span class="hidden lg:block">Download</span>
                        </Button>
                        <Button class="aspect-square p-2">
                            <Dropdown.Root>
                                <Dropdown.Trigger>
                                    <svg
                                        class="p-1 text-black"
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
                                        <circle cx="12" cy="12" r="1" />
                                        <circle cx="12" cy="5" r="1" />
                                        <circle cx="12" cy="19" r="1" />
                                    </svg>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Group>
                                        <Dropdown.Item
                                            on:click={() => {
                                                navigator.clipboard.writeText(
                                                    `https://youtu.be/${file.filename}`
                                                );
                                            }}
                                        >
                                            <Clipboard />
                                            Copy URL
                                        </Dropdown.Item>
                                    </Dropdown.Group>
                                </Dropdown.Content>
                            </Dropdown.Root>
                        </Button>
                    </Card.Footer>
                </Card.Root>
            {/each}
        </div>
        {#if selectedService.value == "msearch"}
            <Button class="my-2 w-full" on:click={() => (promise = nextPage())}>Next Page</Button>
        {/if}
    {:catch error}
        <p>Error: {error}</p>
    {/await}
{/if}
