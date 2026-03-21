"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadInputProps {
    value: string;
    onChange: (url: string) => void;
    inputClass?: string;
    label?: string;
    bucket?: string;
}

export default function ImageUploadInput({
    value,
    onChange,
    inputClass = "",
    bucket = "images",
}: ImageUploadInputProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const supabase = createClient();
            const ext = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
            onChange(data.publicUrl);
        } catch (err: any) {
            setError(err.message ?? "Upload gagal");
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const previewUrl = value
        ? `/api/img-proxy?url=${encodeURIComponent(value)}`
        : null;

    return (
        <div className="space-y-2">
            {/* URL input row */}
            <div className="flex gap-2 items-center">
                <input
                    className={`${inputClass} flex-1`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://..."
                />
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    title="Upload gambar"
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-base leading-none">
                        {uploading ? "hourglass_empty" : "upload"}
                    </span>
                    {uploading ? "Uploading..." : "Upload"}
                </button>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                />
            </div>

            {/* Error */}
            {error && <p className="text-red-400 text-xs">{error}</p>}

            {/* Preview */}
            {value && (
                <img
                    src={previewUrl ?? value}
                    alt="preview"
                    className="rounded-lg h-32 object-cover w-full opacity-80"
                    onError={(e) => {
                        // Fallback: try direct URL if proxy fails
                        const img = e.currentTarget;
                        if (!img.src.includes("img-proxy")) return;
                        img.src = value;
                    }}
                />
            )}
        </div>
    );
}
