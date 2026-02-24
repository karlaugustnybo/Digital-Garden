/**
 * Clickable card navigation script.
 *
 * Cards use `data-card-link="/path"` instead of an <a> wrapper,
 * so text selection works normally. Clicking (without selecting text)
 * navigates to the link.
 */
function initCardClicks(): void {
    document.addEventListener("click", (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const card = target.closest<HTMLElement>("[data-card-link]");
        if (!card) return;

        // Don't navigate if user selected text
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;

        // Don't navigate if user clicked an actual link or button inside the card
        if (target.closest("a, button")) return;

        const href = card.dataset.cardLink;
        if (!href) return;

        const cardTarget = card.dataset.cardTarget;
        if (cardTarget === "_blank") {
            window.open(href, "_blank", "noopener,noreferrer");
        } else {
            window.location.href = href;
        }
    });
}

// Run once on initial load
initCardClicks();
