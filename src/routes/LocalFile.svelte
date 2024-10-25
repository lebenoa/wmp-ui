<script lang="ts">
    import { settings } from "$lib/store/settings";
    import { history } from "$lib/store/history";
    import { tracks } from "$lib/store/tracks";

    import * as Select from "$lib/components/ui/select";
    import Spinner from "$lib/components/icon/spinner.svelte";
    import Refresh from "$lib/components/icon/refresh.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import FilesContainer from "$lib/components/FilesContainer.svelte";
    import * as Collapsible from "$lib/components/ui/collapsible";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import * as Drawer from "$lib/components/ui/drawer";
    import RecentCard from "$lib/components/RecentCard.svelte";
    import { fetchFilesAndHistory } from "$lib/files";

    let searchTerm = "";

    let promise = fetchFilesAndHistory();
    let drawerState = false;
    let editMode = false;
    let activeSearchTimeout: number | undefined = undefined;
</script>

<div class="mb-2 flex flex-row">
    <Button class="mr-auto" variant="ghost" on:click={() => (promise = fetchFilesAndHistory())}>
        <Refresh />
    </Button>
    <Input
        class="w-full text-lg"
        type="search"
        placeholder="Search..."
        on:input={(e) => {
            if (!e.target) return;
            if (activeSearchTimeout) clearTimeout(activeSearchTimeout);

            activeSearchTimeout = setTimeout(() => {
                // @ts-ignore
                searchTerm = e.target.value;
                activeSearchTimeout = undefined;
            }, 300);
        }}
    />

    <Button
        on:click={() => {
            if (editMode) {
                editMode = false;
            } else {
                drawerState = true;
                editMode = true;
            }
        }}
    >
        {#if editMode == false}
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
                class="md:mr-2"
            >
                <path d="M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5" /><path
                    d="M14 2v4a2 2 0 0 0 2 2h4"
                />
                <path
                    d="M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
                />
            </svg>
            <span class="hidden md:block">Edit Mode</span>
        {:else}
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
                class="md:mr-2"
            >
                <path d="M20 6 9 17l-5-5" />
            </svg>
            <span class="hidden md:block">Exit Edit Mode</span>
        {/if}
    </Button>
    <Drawer.Root bind:open={drawerState}>
        <Drawer.Content>
            <div class="mx-auto w-full text-center">
                <Drawer.Header>
                    <Drawer.Title class="text-center">Edit Mode</Drawer.Title>
                    <Drawer.Description class="text-center">
                        Click on a file to edit them!
                    </Drawer.Description>
                </Drawer.Header>
            </div>
        </Drawer.Content>
    </Drawer.Root>

    <Select.Root
        selected={{ value: $settings.localFileLayout }}
        onSelectedChange={(select) => {
            if (select) $settings.localFileLayout = select.value;
        }}
    >
        <Select.Trigger class="w-[180px]">
            <Select.Value placeholder="Layout" />
        </Select.Trigger>
        <Select.Content>
            <Select.Group>
                <Select.Item value="list" label="List">List</Select.Item>
                <Select.Item value="grid" label="Grid">Grid</Select.Item>
            </Select.Group>
        </Select.Content>
        <Select.Input name="favoriteFruit" />
    </Select.Root>
</div>
{#await promise}
    <Spinner />
{:then}
    <Collapsible.Root bind:open={$settings.history_open}>
        <Collapsible.Trigger class="w-full text-start">
            <div
                class="mb-2 flex w-full flex-row justify-between border border-input px-4 py-1 transition-colors active:border-muted-foreground lg:hover:border-muted-foreground"
            >
                <p>Recently Played</p>
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
                    <path d="m18 15-6-6-6 6" />
                </svg>
            </div>
        </Collapsible.Trigger>
        <Collapsible.Content>
            <ScrollArea type="auto" class="mb-2" orientation="horizontal">
                <div class="mb-2 flex flex-row">
                    {#each $history as file}
                        <RecentCard info={file} />
                    {/each}
                </div>
            </ScrollArea>
        </Collapsible.Content>
    </Collapsible.Root>
    <FilesContainer data={$tracks} {searchTerm} {editMode} />
{:catch error}
    <p>Error: {error}</p>
{/await}

<style>
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(180deg);
        }
    }

    @keyframes rotate-back {
        from {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    button[data-state="open"] div svg {
        animation: rotate-back 0.2s ease-out;
    }

    button[data-state="closed"] div svg {
        transform: rotate(180deg);
        animation: rotate 0.2s ease-out;
    }
</style>
