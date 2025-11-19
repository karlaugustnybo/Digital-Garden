export function slugifyTopic(topic: string): string {
    const slug = topic
        .toString()
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    return slug;
}

export function deslugifyTopic(slug: string): string {
    const topic = slug.toString().replace(/-/g, " ");
    return topic;
}
