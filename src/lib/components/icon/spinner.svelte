<script lang="ts">
    export let containerClass = "flex size-full items-center justify-center";
    export let className = "w-32 h-32";
    export let color = "fill-primary";
</script>

<div class={containerClass}>
    <svg class="{className} {color}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect class="spinner_GmWz" x="1" y="4" width="6" height="14" />
        <rect class="spinner_GmWz spinner_NuDr" x="9" y="4" width="6" height="14" />
        <rect class="spinner_GmWz spinner_OlQ0" x="17" y="4" width="6" height="14" />
    </svg>
</div>

<style>
    .spinner_GmWz {
        animation: spinner_Ctle 0.8s linear infinite;
        animation-delay: -0.8s;
    }
    .spinner_NuDr {
        animation-delay: -0.65s;
    }
    .spinner_OlQ0 {
        animation-delay: -0.5s;
    }
    @keyframes spinner_Ctle {
        93.75%,
        100% {
            opacity: 0.2;
        }
    }
</style>
