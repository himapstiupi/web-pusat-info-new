"use client"

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
            <div className="layout-container flex h-16 items-center justify-between px-4 md:px-10 max-w-7xl mx-auto w-full">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                        <img src="/hima-logo.png" alt="HIMA PSTI Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-text-main dark:text-white text-lg font-bold leading-none tracking-tight group-hover:text-primary transition-colors">HIMA PSTI</h1>
                        <p className="text-text-sub dark:text-gray-400 text-xs font-medium">Pusat Informasi</p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <nav className="flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-text-main dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium"
                        >
                            Beranda
                        </Link>
                    </nav>
                    <div className="h-6 w-px bg-border-light dark:bg-border-dark"></div>
                    <Link
                        href="https://tr.ee/himapstiupi"
                        className="flex items-center justify-center overflow-hidden rounded-lg h-9 px-5 bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all shadow-sm hover:shadow-md"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span>Hubungi Kami</span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className="material-symbols-outlined">
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark shadow-xl animate-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-6 space-y-4">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-text-main dark:text-gray-200 hover:text-primary dark:hover:text-primary font-medium text-base py-2 border-b border-gray-100 dark:border-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Beranda
                            </Link>
                        </nav>
                        <div className="pt-2">
                            <Link
                                href="https://tr.ee/himapstiupi"
                                className="flex items-center justify-center w-full rounded-lg h-11 bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-sm"
                                onClick={() => setIsMobileMenuOpen(false)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span>Hubungi Kami</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
