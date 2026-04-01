import { getHomepageContent } from "@/actions/pages";
import HomepageEditorForm from "@/components/superadmin/HomepageEditorForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Beranda | Superadmin",
};

export default async function EditHomepagePage() {
  const content = await getHomepageContent();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary-purple/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary-purple">home</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-main dark:text-white">Edit Beranda</h1>
          <p className="text-text-sub dark:text-[#ad92c9] text-sm">Kelola konten yang tampil di halaman utama website.</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-2 px-4 py-2 text-sm text-text-sub dark:text-[#ad92c9] hover:text-text-main dark:hover:text-white border border-border-light dark:border-[#3b2a6e] hover:bg-black/5 dark:hover:bg-[#3b2a6e]/50 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-base">open_in_new</span>
          Lihat Halaman
        </a>
      </div>

      {/* Editor */}
      <div className="bg-surface-light dark:bg-[#180f2e] border border-border-light dark:border-[#3b2a6e] rounded-2xl p-6">
        <HomepageEditorForm initial={content} />
      </div>
    </div>
  );
}
