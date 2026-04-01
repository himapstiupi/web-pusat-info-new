"use client";

import { useState } from "react";
import { upsertTentangKamiContent } from "@/actions/pages";
import { TentangKamiContent, DEFAULT_TENTANG_KAMI, ProgramKerjaItem } from "@/lib/tentang-kami";
import { toast } from "react-hot-toast";
import ImageUploadInput from "@/components/superadmin/ImageUploadInput";

interface Props { initial: TentangKamiContent }

export default function TentangKamiEditorForm({ initial }: Props) {
  const [data, setData] = useState<TentangKamiContent>({ 
    ...initial, 
    kabinet: initial.kabinet || DEFAULT_TENTANG_KAMI.kabinet 
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "sejarah" | "kabinet" | "visi_misi" | "program_kerja" | "cta">("hero");

  const handleSave = async () => {
    setSaving(true);
    const result = await upsertTentangKamiContent(data);
    setSaving(false);
    if (result.success) {
      toast.success("Perubahan Tentang Kami berhasil disimpan!");
    } else {
      toast.error(result.error || "Gagal menyimpan.");
    }
  };

  const updateHero = (f: keyof TentangKamiContent["hero"], v: string) =>
    setData(d => ({ ...d, hero: { ...d.hero, [f]: v } }));
  const updateSejarah = (f: keyof TentangKamiContent["sejarah"], v: string) =>
    setData(d => ({ ...d, sejarah: { ...d.sejarah, [f]: v } }));
  const updateKabinet = (f: keyof TentangKamiContent["kabinet"], v: string) =>
    setData(d => ({ ...d, kabinet: { ...d.kabinet, [f]: v } }));
  const updateVM = (f: keyof TentangKamiContent["visi_misi"], v: any) =>
    setData(d => ({ ...d, visi_misi: { ...d.visi_misi, [f]: v } }));
  const updateMisi = (i: number, v: string) => {
    const next = [...data.visi_misi.misi]; next[i] = v; updateVM("misi", next);
  };
  const updatePK = (i: number, f: keyof ProgramKerjaItem, v: string) => {
    const next = [...data.program_kerja]; next[i] = { ...next[i], [f]: v };
    setData(d => ({ ...d, program_kerja: next }));
  };
  const updateCta = (f: keyof TentangKamiContent["cta"], v: string) =>
    setData(d => ({ ...d, cta: { ...d.cta, [f]: v } }));

  const tabClass = (t: string) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === t ? "bg-primary-purple text-white" : "text-text-sub dark:text-[#ad92c9] hover:bg-black/5 dark:hover:bg-white/5"}`;
  const iClass = "w-full px-3 py-2 bg-background-light dark:bg-[#1f1535] border border-border-light dark:border-[#3b2a6e] rounded-lg text-text-main dark:text-white placeholder-gray-400 dark:placeholder-[#7a6ba0] text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple/50";
  const lClass = "block text-xs font-semibold text-text-sub dark:text-[#ad92c9] uppercase tracking-wider mb-1";

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["hero", "sejarah", "kabinet", "visi_misi", "program_kerja", "cta"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={tabClass(t)}>
            {t === "hero" && "Hero"}
            {t === "sejarah" && "Sejarah"}
            {t === "kabinet" && "Kabinet"}
            {t === "visi_misi" && "Visi & Misi"}
            {t === "program_kerja" && "Program Kerja"}
            {t === "cta" && "CTA"}
          </button>
        ))}
      </div>

      {/* Hero */}
      {activeTab === "hero" && (
        <div className="space-y-4">
          <div><label className={lClass}>Judul Halaman</label><input className={iClass} value={data.hero.title} onChange={e => updateHero("title", e.target.value)} /></div>
          <div><label className={lClass}>Deskripsi Hero</label><textarea rows={3} className={iClass} value={data.hero.description} onChange={e => updateHero("description", e.target.value)} /></div>
          <div>
            <label className={lClass}>URL Gambar Hero</label>
            <ImageUploadInput
              value={data.sejarah.image_url}
              onChange={(url) => updateSejarah("image_url", url)}
              inputClass={iClass}
              bucket="images"
            />
          </div>
        </div>
      )}

      {/* Sejarah */}
      {activeTab === "sejarah" && (
        <div className="space-y-4">
          <div>
            <label className={lClass}>Deskripsi Sejarah</label>
            <textarea
              rows={12}
              className={iClass}
              value={[data.sejarah.paragraf1, data.sejarah.paragraf2].filter(Boolean).join("\n\n")}
              onChange={e => {
                updateSejarah("paragraf1", e.target.value);
                updateSejarah("paragraf2", "");
              }}
              placeholder="Tulis sejarah lengkap di sini. Pisahkan paragraf dengan baris kosong."
            />
            <p className="text-xs text-slate-500 mt-1">Pisahkan antar paragraf dengan satu baris kosong (tekan Enter dua kali).</p>
          </div>
        </div>
      )}

      {/* Kabinet */}
      {activeTab === "kabinet" && (
        <div className="space-y-4">
          <div><label className={lClass}>Nama Kabinet</label><input className={iClass} value={data.kabinet?.nama || ""} onChange={e => updateKabinet("nama", e.target.value)} /></div>
          <div><label className={lClass}>Deskripsi Kabinet</label><textarea rows={5} className={iClass} value={data.kabinet?.deskripsi || ""} onChange={e => updateKabinet("deskripsi", e.target.value)} placeholder="Tuliskan filosofi atau penjelasan tentang kabinet..." /></div>
          <div>
            <label className={lClass}>URL Gambar Logo/Kabinet</label>
            <ImageUploadInput
              value={data.kabinet?.image_url || ""}
              onChange={(url) => updateKabinet("image_url", url)}
              inputClass={iClass}
              bucket="images"
            />
          </div>
        </div>
      )}

      {/* Visi & Misi */}
      {activeTab === "visi_misi" && (
        <div className="space-y-4">
          <div><label className={lClass}>Teks Visi</label><textarea rows={3} className={iClass} value={data.visi_misi.visi} onChange={e => updateVM("visi", e.target.value)} /></div>
          <div>
            <label className={lClass}>Poin Misi</label>
            {data.visi_misi.misi.map((m, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input className={iClass} value={m} onChange={e => updateMisi(i, e.target.value)} />
                <button onClick={() => updateVM("misi", data.visi_misi.misi.filter((_, j) => j !== i))} className="px-2 text-red-400 hover:text-red-300">✕</button>
              </div>
            ))}
            <button onClick={() => updateVM("misi", [...data.visi_misi.misi, ""])} className="text-primary-purple text-sm hover:text-[#a980e8] mt-1">+ Tambah poin</button>
          </div>
        </div>
      )}

      {/* Program Kerja */}
      {activeTab === "program_kerja" && (
        <div className="space-y-4">
          {data.program_kerja.map((pk, i) => (
            <div key={i} className="p-4 bg-background-light dark:bg-[#1f1535] border border-border-light dark:border-[#3b2a6e] rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-text-main dark:text-white">Program #{i + 1}</span>
                <button onClick={() => setData(d => ({ ...d, program_kerja: d.program_kerja.filter((_, j) => j !== i) }))} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-xs transition-colors">Hapus</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className={lClass}>Judul</label><input className={iClass} value={pk.title} onChange={e => updatePK(i, "title", e.target.value)} /></div>
                <div>
                  <label className={lClass}>Ikon Material Symbol</label>
                  <input className={iClass} value={pk.icon} onChange={e => updatePK(i, "icon", e.target.value)} placeholder="mis: campaign" />
                  <p className="text-gray-500 dark:text-[#7a6ba0] text-xs mt-1">Dipakai jika URL gambar kosong</p>
                </div>
              </div>

              <div>
                <label className={lClass}>URL Gambar Ikon (opsional, menggantikan ikon)</label>
                <input className={iClass} value={pk.image_url || ""} onChange={e => updatePK(i, "image_url", e.target.value)} placeholder="https://..." />
                {pk.image_url && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={pk.image_url} alt="preview" className="h-12 w-12 object-cover rounded-xl border border-border-light dark:border-[#3b2a6e]" />
                    <span className="text-gray-500 dark:text-[#7a6ba0] text-xs">Preview gambar ikon</span>
                  </div>
                )}
              </div>

              <div><label className={lClass}>Deskripsi</label><textarea rows={2} className={iClass} value={pk.desc} onChange={e => updatePK(i, "desc", e.target.value)} /></div>
            </div>
          ))}
          <button
            onClick={() => setData(d => ({ ...d, program_kerja: [...d.program_kerja, { icon: "star", image_url: "", title: "", desc: "" }] }))}
            className="w-full py-3 border border-dashed border-border-light dark:border-[#3b2a6e] rounded-xl text-text-sub dark:text-[#ad92c9] hover:border-primary-purple hover:text-text-main dark:hover:text-white transition-colors text-sm"
          >+ Tambah Program Kerja</button>
        </div>
      )}

      {/* CTA */}
      {activeTab === "cta" && (
        <div className="space-y-4">
          <div><label className={lClass}>Judul CTA</label><input className={iClass} value={data.cta.title} onChange={e => updateCta("title", e.target.value)} /></div>
          <div><label className={lClass}>Deskripsi CTA</label><textarea rows={3} className={iClass} value={data.cta.description} onChange={e => updateCta("description", e.target.value)} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={lClass}>Label Tombol Utama</label><input className={iClass} value={data.cta.primary_label} onChange={e => updateCta("primary_label", e.target.value)} /></div>
            <div><label className={lClass}>Link Tombol Utama</label><input className={iClass} value={data.cta.primary_href} onChange={e => updateCta("primary_href", e.target.value)} /></div>
            <div><label className={lClass}>Label Tombol Sekunder</label><input className={iClass} value={data.cta.secondary_label} onChange={e => updateCta("secondary_label", e.target.value)} /></div>
            <div><label className={lClass}>Link Tombol Sekunder</label><input className={iClass} value={data.cta.secondary_href} onChange={e => updateCta("secondary_href", e.target.value)} /></div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex items-center justify-end">
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-primary-purple text-white text-sm font-bold rounded-lg hover:bg-[#56298b] transition-colors disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
