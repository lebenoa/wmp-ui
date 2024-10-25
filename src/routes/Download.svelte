<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import DownloadCard from "$lib/components/DownloadCard.svelte";
    import * as ContextMenu from "$lib/components/ui/context-menu";

    let history: Map<string, boolean> = new Map();

    let urlOrId = "";
    let lastContextMenuOn = {
        key: "",
        info: ""
    };
</script>

<form
    class="mb-2 flex flex-row"
    on:submit|preventDefault={async () => {
        history.set(urlOrId, false);
        history = history;
        urlOrId = "";
    }}
>
    <Input
        class="text-lg"
        type="text"
        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        bind:value={urlOrId}
    />
    <Button type="submit">
        <svg class="mr-2" width="24" height="24" version="2.0">
            <use href="#download-icon"></use>
        </svg>
        Download
    </Button>
</form>

<ContextMenu.Root
    onOpenChange={(open) => {
        if (!open) {
            lastContextMenuOn = {
                key: "",
                info: ""
            };
        }
    }}
>
    <ContextMenu.Trigger class="h-full w-full">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="grid h-full w-full grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
            {#each history as [item, hidden]}
                {#if !hidden}
                    <DownloadCard
                        on:dismiss={() => {
                            history.set(item, true);
                            history = history;
                        }}
                        on:contextmenu={(e) => {
                            lastContextMenuOn = {
                                key: item,
                                info: e.detail.info
                            };
                        }}
                        urlOrId={item}
                    />
                {/if}
            {/each}
        </div>
    </ContextMenu.Trigger>
    <ContextMenu.Content>
        {#if lastContextMenuOn.key}
            <ContextMenu.Item
                on:click={() => {
                    history.set(lastContextMenuOn.key, true);
                    history = history;
                    lastContextMenuOn = {
                        key: "",
                        info: ""
                    };
                }}
            >
                Dismiss <span class="ml-1 font-bold text-secondary-foreground"
                    >{lastContextMenuOn.info}</span
                >
            </ContextMenu.Item>
        {/if}
        <ContextMenu.Item
            on:click={() => {
                lastContextMenuOn = {
                    key: "",
                    info: ""
                };
                history = new Map();
            }}
        >
            Clear History
        </ContextMenu.Item>
    </ContextMenu.Content>
</ContextMenu.Root>
