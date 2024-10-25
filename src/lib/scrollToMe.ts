export function scrollIf(node: Element, cond: boolean) {
    if (cond) {
        // Wait for other node to render otherwise this will not work!
        // >= 50ms for mobile devices
        setTimeout(() => {
            node.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 100);
    }
}
