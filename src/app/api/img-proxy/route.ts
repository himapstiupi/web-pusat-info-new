import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
        return new NextResponse("Missing url parameter", { status: 400 });
    }

    // Basic validation — only allow http/https URLs
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return new NextResponse("Invalid URL", { status: 400 });
    }

    // Extract origin of the image URL to use as Referer (bypasses same-site hotlink protection)
    let imageOrigin = "";
    try {
        imageOrigin = new URL(url).origin;
    } catch {
        return new NextResponse("Invalid URL format", { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                "Accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                // Spoof Referer so it looks like the request comes from the same site
                "Referer": imageOrigin + "/",
                "Origin": imageOrigin,
            },
        });

        if (!response.ok) {
            return new NextResponse(`Upstream error: ${response.status}`, {
                status: response.status,
            });
        }

        const contentType = response.headers.get("content-type") ?? "image/jpeg";
        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=3600, s-maxage=86400",
            },
        });
    } catch (e) {
        return new NextResponse("Failed to fetch image", { status: 502 });
    }
}
