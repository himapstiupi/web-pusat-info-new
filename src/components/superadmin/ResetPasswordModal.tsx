'use client'

import { useState } from 'react'
import { resetAdminPassword } from '@/app/superadmin/(dashboard)/admins/actions'

export default function ResetPasswordModal({ userId, onClose }: { userId: string, onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError('')
        setSuccess('')

        const formData = new FormData(event.currentTarget)
        const newPassword = formData.get('newPassword') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (newPassword !== confirmPassword) {
            setError('Password tidak cocok')
            setIsLoading(false)
            return
        }

        const result = await resetAdminPassword(userId, formData)

        if (result?.error) {
            setError(result.error)
        } else {
            setSuccess('Password berhasil direset!')
            setTimeout(() => {
                onClose()
            }, 1500)
        }
        setIsLoading(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#1e1528] border border-[#362348] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-[#362348] flex justify-between items-center bg-[#2a1f36]/50">
                    <h3 className="text-white text-lg font-bold">Reset Password Admin</h3>
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
                    {success && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg">
                            {success}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#ad92c9] uppercase tracking-wider ml-1">Password Baru</label>
                        <div className="relative">
                            <input
                                name="newPassword"
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

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#ad92c9] uppercase tracking-wider ml-1">Konfirmasi Password</label>
                        <input
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={6}
                            className="w-full bg-[#0f0a15] border border-[#362348] rounded-xl py-3 px-4 text-white placeholder-[#5d447a] focus:ring-1 focus:ring-primary-purple focus:border-primary-purple transition-all outline-none"
                            placeholder="******"
                        />
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
                            className="bg-yellow-500 hover:bg-yellow-400 text-[#191022] px-6 py-2 rounded-lg font-bold shadow-lg shadow-yellow-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="animate-spin material-symbols-outlined text-lg">progress_activity</span>
                                    Mereset...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
