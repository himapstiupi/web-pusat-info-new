"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
        ],
    }), []);

    const formats = [
        'header',
        'bold', 'italic', 'underline',
        'align',
        'list',
        'link'
    ];

    return (
        <div className="rich-text-editor">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder || "Tulis konten artikel di sini..."}
                className="bg-white dark:bg-background-dark text-text-main dark:text-white rounded-lg"
            />
            <style jsx global>{`
                .rich-text-editor .ql-container {
                    min-height: 300px;
                    font-size: 16px;
                    border-bottom-left-radius: 0.5rem;
                    border-bottom-right-radius: 0.5rem;
                }
                .rich-text-editor .ql-toolbar {
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    background: white;
                }
                .dark .rich-text-editor .ql-toolbar {
                    background: #1a2230;
                    border-color: #2a3447;
                }
                .dark .rich-text-editor .ql-container {
                    background: #101622;
                    border-color: #2a3447;
                    color: white;
                }
                .dark .rich-text-editor .ql-editor.ql-blank::before {
                    color: #6b7280;
                }
                .rich-text-editor .ql-editor {
                    line-height: 1.75;
                }
                .dark .rich-text-editor .ql-stroke {
                    stroke: #9ca3af;
                }
                .dark .rich-text-editor .ql-fill {
                    fill: #9ca3af;
                }
                .dark .rich-text-editor .ql-picker-label {
                    color: #9ca3af;
                }
            `}</style>
        </div>
    );
}
