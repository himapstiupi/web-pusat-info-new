import { getMahasiswaBaruContent } from "@/actions/pages";
import MahasiswaBaruEditorForm from "@/components/superadmin/MahasiswaBaruEditorForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Mahasiswa Baru | Superadmin",
};

export default async function EditMahasiswaBaruPage() {
  const content = await getMahasiswaBaruContent();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-purple/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary-purple text-xl">school</span>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-text-main dark:text-white">Edit Mahasiswa Baru</h1>
          <p className="text-text-sub dark:text-[#ad92c9] text-xs sm:text-sm">
            Kelola konten halaman sambutan mahasiswa baru PSTI.
          </p>
        </div>
        <a
          href="/maru"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm text-text-sub dark:text-[#ad92c9] hover:text-text-main dark:hover:text-white border border-border-light dark:border-[#3b2a6e] rounded-lg transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-sm sm:text-base">open_in_new</span>
          <span className="hidden xs:inline">Lihat Halaman</span>
          <span className="xs:hidden">Lihat</span>
        </a>
      </div>

      {/* Editor */}
      <div className="bg-surface-light dark:bg-[#180f2e] border border-border-light dark:border-[#3b2a6e] rounded-2xl p-4 sm:p-6">
        <MahasiswaBaruEditorForm initial={content} />
      </div>
    </div>
  );
}
