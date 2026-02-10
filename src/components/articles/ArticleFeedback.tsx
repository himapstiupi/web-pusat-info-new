"use client";

import { useState, useEffect } from "react";
import { incrementArticleLike, incrementArticleDislike } from "@/actions/articles";

interface ArticleFeedbackProps {
    slug: string;
    initialLikes: number;
    initialDislikes: number;
}

export default function ArticleFeedback({ slug, initialLikes, initialDislikes }: ArticleFeedbackProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        // Check if user has already voted stored in localStorage
        const vote = localStorage.getItem(`vote_${slug}`);
        if (vote === 'like' || vote === 'dislike') {
            setUserVote(vote);
        }
    }, [slug]);

    const handleLike = async () => {
        if (userVote || isPending) return; // Prevent multiple votes

        setIsPending(true);
        // Optimistic update
        setLikes(prev => prev + 1);
        setUserVote('like');
        localStorage.setItem(`vote_${slug}`, 'like');

        try {
            const result = await incrementArticleLike(slug);
            if (result.error) {
                // Revert if failed
                setLikes(prev => prev - 1);
                setUserVote(null);
                localStorage.removeItem(`vote_${slug}`);
                console.error(result.error);
            } else if (result.likes !== undefined) {
                // Sync with server value
                setLikes(result.likes);
            }
        } catch (error) {
            console.error("Error liking article:", error);
            setLikes(prev => prev - 1); // Revert
            setUserVote(null);
        } finally {
            setIsPending(false);
        }
    };

    const handleDislike = async () => {
        if (userVote || isPending) return; // Prevent multiple votes

        setIsPending(true);
        // Optimistic update
        setDislikes(prev => prev + 1);
        setUserVote('dislike');
        localStorage.setItem(`vote_${slug}`, 'dislike');

        try {
            const result = await incrementArticleDislike(slug);
            if (result.error) {
                // Revert if failed
                setDislikes(prev => prev - 1);
                setUserVote(null);
                localStorage.removeItem(`vote_${slug}`);
                console.error(result.error);
            } else if (result.dislikes !== undefined) {
                // Sync with server value
                setDislikes(result.dislikes);
            }
        } catch (error) {
            console.error("Error disliking article:", error);
            setDislikes(prev => prev - 1); // Revert
            setUserVote(null);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="mt-16 pt-8 border-t border-border-light dark:border-border-dark text-center">
            <h4 className="text-lg font-bold text-text-main dark:text-white mb-4">Apakah artikel ini membantu?</h4>
            <div className="flex justify-center gap-4">
                <button
                    onClick={handleLike}
                    disabled={!!userVote || isPending}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${userVote === 'like'
                        ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                        : 'border-border-light dark:border-border-dark hover:bg-green-50 hover:border-green-200 hover:text-green-600 dark:hover:bg-green-900/20'
                        } ${!!userVote && userVote !== 'like' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span className="material-symbols-outlined">{userVote === 'like' ? 'thumb_up_alt' : 'thumb_up'}</span>
                    {likes}
                </button>
                <button
                    onClick={handleDislike}
                    disabled={!!userVote || isPending}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${userVote === 'dislike'
                        ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                        : 'border-border-light dark:border-border-dark hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20'
                        } ${!!userVote && userVote !== 'dislike' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span className="material-symbols-outlined">{userVote === 'dislike' ? 'thumb_down_alt' : 'thumb_down'}</span>
                    {dislikes}
                </button>
            </div>
            {userVote && (
                <p className="mt-2 text-sm text-text-sub dark:text-gray-400 animate-fade-in">
                    Terima kasih atas tanggapan Anda!
                </p>
            )}
        </div>
    );
}
