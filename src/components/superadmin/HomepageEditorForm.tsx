"use client";

import { useState } from "react";
import { upsertHomepageContent } from "@/actions/pages";
import { HomepageContent, DEFAULT_HOMEPAGE } from "@/lib/homepage";
import { toast } from "react-hot-toast";
import ImageUploadInput from "@/components/superadmin/ImageUploadInput";

interface Props {
  initial: HomepageContent;
}

export default function HomepageEditorForm({ initial }: Props) {
  const [data, setData] = useState<HomepageContent>(initial);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "mission_vision" | "values" | "cta">("hero");

  const handleSave = async () => {
    setSaving(true);
    const result = await upsertHomepageContent(data);
    setSaving(false);
    if (result.success) {
      toast.success("Perubahan Beranda berhasil disimpan!");
    } else {
      toast.error(result.error || "Gagal menyimpan.");
    }
  };

  const updateHero = (field: keyof HomepageContent["hero"], value: string) =>
    setData((d) => ({ ...d, hero: { ...d.hero, [field]: value } }));

  const updateMV = (field: keyof HomepageContent["mission_vision"], value: any) =>
    setData((d) => ({ ...d, mission_vision: { ...d.mission_vision, [field]: value } }));

  const updateMisi = (idx: number, value: string) => {
    const next = [...data.mission_vision.misi];
    next[idx] = value;
    updateMV("misi", next);
  };

  const addMisi = () => updateMV("misi", [...data.mission_vision.misi, ""]);
  const removeMisi = (idx: number) => updateMV("misi", data.mission_vision.misi.filter((_, i) => i !== idx));

  const updateValue = (idx: number, field: "icon" | "title" | "desc", value: string) => {
    const next = [...data.values];
    next[idx] = { ...next[idx], [field]: value };
    setData((d) => ({ ...d, values: next }));
  };

  const addValue = () =>
    setData((d) => ({ ...d, values: [...d.values, { icon: "star", title: "", desc: "" }] }));
  const removeValue = (idx: number) =>
    setData((d) => ({ ...d, values: d.values.filter((_, i) => i !== idx) }));

  const updateCta = (field: keyof HomepageContent["cta"], value: string) =>
    setData((d) => ({ ...d, cta: { ...d.cta, [field]: value } }));

  const tabClass = (tab: string) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
      activeTab === tab
        ? "bg-primary-purple text-white"
        : "text-[#ad92c9] hover:bg-white/5"
    }`;

  const inputClass = "w-full px-3 py-2 bg-[#1f1535] border border-[#3b2a6e] rounded-lg text-white placeholder-[#7a6ba0] text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple/50 focus:border-primary-purple";
  const labelClass = "block text-xs font-semibold text-[#ad92c9] uppercase tracking-wider mb-1";

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["hero", "mission_vision", "values", "cta"].map((t) => (
          <button key={t} onClick={() => setActiveTab(t as any)} className={tabClass(t)}>
            {t === "hero" && "Hero"}
            {t === "mission_vision" && "Visi & Misi"}
            {t === "values" && "Nilai-Nilai"}
            {t === "cta" && "CTA"}
          </button>
        ))}
      </div>

      {/* Hero */}
      {activeTab === "hero" && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Judul Hero</label>
            <input className={inputClass} value={data.hero.title} onChange={(e) => updateHero("title", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Deskripsi Hero</label>
            <textarea rows={3} className={inputClass} value={data.hero.description} onChange={(e) => updateHero("description", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>URL Gambar Hero</label>
            <ImageUploadInput
              value={data.hero.image_url}
              onChange={(url) => updateHero("image_url", url)}
              inputClass={inputClass}
              bucket="images"
            />
          </div>
        </div>
      )}

      {/* Mission & Vision */}
      {activeTab === "mission_vision" && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Teks Visi</label>
            <textarea rows={3} className={inputClass} value={data.mission_vision.visi} onChange={(e) => updateMV("visi", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Poin Misi</label>
            {data.mission_vision.misi.map((m, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input className={inputClass} value={m} onChange={(e) => updateMisi(i, e.target.value)} />
                <button onClick={() => removeMisi(i)} className="px-2 text-red-400 hover:text-red-300 transition-colors">✕</button>
              </div>
            ))}
            <button onClick={addMisi} className="text-primary-purple text-sm hover:text-[#a980e8] transition-colors mt-1">+ Tambah poin</button>
          </div>
          <div>
            <label className={labelClass}>URL Gambar Misi & Visi</label>
            <ImageUploadInput
              value={data.mission_vision.image_url}
              onChange={(url) => updateMV("image_url", url)}
              inputClass={inputClass}
              bucket="images"
            />
          </div>
        </div>
      )}

      {/* Values */}
      {activeTab === "values" && (
        <div className="space-y-4">
          {data.values.map((v, i) => (
            <div key={i} className="p-4 bg-[#1f1535] border border-[#3b2a6e] rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white">Nilai #{i + 1}</span>
                <button onClick={() => removeValue(i)} className="text-red-400 hover:text-red-300 text-xs transition-colors">Hapus</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Ikon (Material Symbol)</label>
                  <input className={inputClass} value={v.icon} onChange={(e) => updateValue(i, "icon", e.target.value)} placeholder="mis: verified_user" />
                  <p className="text-[#7a6ba0] text-xs mt-1">Lihat icon di <a href="https://fonts.google.com/icons" target="_blank" rel="noopener" className="underline">fonts.google.com/icons</a></p>
                </div>
                <div>
                  <label className={labelClass}>Judul</label>
                  <input className={inputClass} value={v.title} onChange={(e) => updateValue(i, "title", e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Deskripsi</label>
                <textarea rows={2} className={inputClass} value={v.desc} onChange={(e) => updateValue(i, "desc", e.target.value)} />
              </div>
            </div>
          ))}
          <button onClick={addValue} className="w-full py-3 border border-dashed border-[#3b2a6e] rounded-xl text-[#ad92c9] hover:border-primary-purple hover:text-white transition-colors text-sm">
            + Tambah Nilai Baru
          </button>
        </div>
      )}

      {/* CTA */}
      {activeTab === "cta" && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Judul CTA</label>
            <input className={inputClass} value={data.cta.title} onChange={(e) => updateCta("title", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Deskripsi CTA</label>
            <textarea rows={3} className={inputClass} value={data.cta.description} onChange={(e) => updateCta("description", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Label Tombol Utama</label>
              <input className={inputClass} value={data.cta.primary_label} onChange={(e) => updateCta("primary_label", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Link Tombol Utama</label>
              <input className={inputClass} value={data.cta.primary_href} onChange={(e) => updateCta("primary_href", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Label Tombol Sekunder</label>
              <input className={inputClass} value={data.cta.secondary_label} onChange={(e) => updateCta("secondary_label", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Link Tombol Sekunder</label>
              <input className={inputClass} value={data.cta.secondary_href} onChange={(e) => updateCta("secondary_href", e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-8 flex items-center justify-end">
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-primary-purple text-white text-sm font-bold rounded-lg hover:bg-[#56298b] transition-colors disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
