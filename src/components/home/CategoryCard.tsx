import Link from 'next/link'

interface CategoryCardProps {
    name: string
    description: string
    icon: string
    slug: string
}

export default function CategoryCard({ name, description, icon, slug }: CategoryCardProps) {
    return (
        <Link
            href={`/kategori/${slug}`}
            className="group flex flex-col p-6 rounded-2xl bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-none transition-all duration-300"
        >
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <h4 className="text-lg font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors leading-snug">
                {name}
            </h4>
            <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed line-clamp-3">{description}</p>
        </Link>
    )
}
