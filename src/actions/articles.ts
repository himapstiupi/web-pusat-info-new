"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function incrementArticleLike(slug: string) {
    const supabase = await createClient();

    // RPC call would be ideal for atomicity, but standard update works for simple cases
    // To ensure atomicity without RPC, we can use a raw query or just fetch-then-update (optimistic usually fine for this scale)
    // Better approach: use `.rpc('increment', { ... })` if we had a function, but we'll stick to simple update for now
    // Actually, supabase-js doesn't have a simple "increment" method on `update`.
    // Let's first fetch the current count.

    const { data: article, error: fetchError } = await supabase
        .from("articles")
        .select("likes")
        .eq("id", slug)
        .single();

    if (fetchError || !article) {
        return { error: "Failed to fetch article" };
    }

    const newLikes = (article.likes || 0) + 1;

    const { error: updateError } = await supabase
        .from("articles")
        .update({ likes: newLikes })
        .eq("id", slug);

    if (updateError) {
        return { error: "Failed to update like count" };
    }

    revalidatePath(`/articles/${slug}`);
    return { success: true, likes: newLikes };
}

export async function incrementArticleDislike(slug: string) {
    const supabase = await createClient();

    const { data: article, error: fetchError } = await supabase
        .from("articles")
        .select("dislikes")
        .eq("id", slug)
        .single();

    if (fetchError || !article) {
        return { error: "Failed to fetch article" };
    }

    const newDislikes = (article.dislikes || 0) + 1;

    const { error: updateError } = await supabase
        .from("articles")
        .update({ dislikes: newDislikes })
        .eq("id", slug);

    if (updateError) {
        return { error: "Failed to update dislike count" };
    }

    revalidatePath(`/articles/${slug}`);
    return { success: true, dislikes: newDislikes };
}
