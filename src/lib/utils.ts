export function stripHtml(html: string): string {
    if (!html) return "";

    // First remove HTML tags
    let text = html.replace(/<[^>]*>/g, ' ');

    // Replace common HTML entities
    text = text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    // Remove multiple spaces and trim
    return text.replace(/\s+/g, ' ').trim();
}
