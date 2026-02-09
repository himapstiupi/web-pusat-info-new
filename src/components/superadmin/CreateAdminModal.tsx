'use client'

import { useState } from 'react'
import { createAdmin } from '@/app/superadmin/(dashboard)/admins/actions'

export default function CreateAdminModal({ onClose }: { onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError('')

        const formData = new FormData(event.currentTarget)
        const result = await createAdmin(formData)

        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        } else {
            onClose()
            // Optional: Show success toast/alert
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#1e1528] border border-[#362348] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-[#362348] flex justify-between items-center bg-[#2a1f36]/50">
                    <h3 className="text-white text-lg font-bold">Tambah Admin Baru</h3>
                    <button onClick={onClose} className="text-[#ad92c9] hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#ad92c9] uppercase tracking-wider ml-1">Nama Lengkap</label>
                        <input
                            name="fullName"
                            type="text"
                            required
                            className="w-full bg-[#0f0a15] border border-[#362348] rounded-xl py-3 px-4 text-white placeholder-[#5d447a] focus:ring-1 focus:ring-primary-purple focus:border-primary-purple transition-all outline-none"
                            placeholder="Contoh: Budi Santoso"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#ad92c9] uppercase tracking-wider ml-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full bg-[#0f0a15] border border-[#362348] rounded-xl py-3 px-4 text-white placeholder-[#5d447a] focus:ring-1 focus:ring-primary-purple focus:border-primary-purple transition-all outline-none"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#ad92c9] uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
                                className="w-full bg-[#0f0a15] border border-[#362348] rounded-xl py-3 pl-4 pr-12 text-white placeholder-[#5d447a] focus:ring-1 focus:ring-primary-purple focus:border-primary-purple transition-all outline-none"
                                placeholder="******"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ad92c9] hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-[#ad92c9] font-medium hover:bg-[#362348] transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary-purple hover:bg-primary-purple/90 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-primary-purple/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                                    Menyimpan...
                                </>
                            ) : (
                                'Buat Admin'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
