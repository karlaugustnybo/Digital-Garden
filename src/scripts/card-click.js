/**
 * Clickable card navigation script.
 *
 * Cards use `data-card-link="/path"` instead of an <a> wrapper,
 * so text selection works normally. Clicking (without selecting text)
 * navigates to the link.
 */
function initCardClicks() {
    document.addEventListener("click", (e) => {
        const card = e.target.closest("[data-card-link]");
        if (!card) return;

        // Don't navigate if user selected text
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;

        // Don't navigate if user clicked an actual link or button inside the card
        if (e.target.closest("a, button")) return;

        const href = card.dataset.cardLink;
        if (!href) return;

        const target = card.dataset.cardTarget;
        if (target === "_blank") {
            window.open(href, "_blank", "noopener,noreferrer");
        } else {
            window.location.href = href;
        }
    });
}

// Run once on initial load
initCardClicks();
