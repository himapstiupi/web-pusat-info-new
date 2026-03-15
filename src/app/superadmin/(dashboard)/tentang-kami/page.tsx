import { getTentangKamiContent } from "@/actions/pages";
import TentangKamiEditorForm from "@/components/superadmin/TentangKamiEditorForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Tentang Kami | Superadmin",
};

export default async function EditTentangKamiPage() {
  const content = await getTentangKamiContent();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary-purple/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary-purple">groups</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Edit Tentang Kami</h1>
          <p className="text-[#ad92c9] text-sm">Kelola konten yang tampil di halaman Tentang Kami.</p>
        </div>
        <a
          href="/tentang-kami"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-2 px-4 py-2 text-sm text-[#ad92c9] hover:text-white border border-[#3b2a6e] rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined text-base">open_in_new</span>
          Lihat Halaman
        </a>
      </div>

      {/* Editor */}
      <div className="bg-[#180f2e] border border-[#3b2a6e] rounded-2xl p-6">
        <TentangKamiEditorForm initial={content} />
      </div>
    </div>
  );
}
