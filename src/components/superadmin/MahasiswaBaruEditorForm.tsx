"use client";

import { useState, useEffect } from "react";
import { upsertMahasiswaBaruContent } from "@/actions/pages";
import {
  MahasiswaBaruContent,
  DEFAULT_MARU,
  FaqItem,
  ContactPerson,
} from "@/lib/mahasiswa-baru";
import { toast } from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

interface Props {
  initial: MahasiswaBaruContent;
}

type Tab = "hero" | "countdown" | "artikel" | "faq" | "contact";

interface CategoryOption {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export default function MahasiswaBaruEditorForm({ initial }: Props) {
  const [data, setData] = useState<MahasiswaBaruContent>(initial);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("hero");

  // Available categories for multi-select
  const [allCategories, setAllCategories] = useState<CategoryOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "artikel") {
      setCategoriesLoading(true);
      const supabase = createClient();
      supabase
        .from("categories")
        .select("id, title, description, icon")
        .order("id", { ascending: true })
        .then(({ data: rows }) => {
          if (rows) setAllCategories(rows as CategoryOption[]);
          setCategoriesLoading(false);
        });
    }
  }, [activeTab]);

  const handleSave = async () => {
    setSaving(true);
    const result = await upsertMahasiswaBaruContent(data);
    setSaving(false);
    if (result.success) {
      toast.success("Halaman Mahasiswa Baru berhasil disimpan!");
    } else {
      toast.error(result.error || "Gagal menyimpan.");
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────

  const tabClass = (tab: Tab) =>
    `px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
      activeTab === tab
        ? "bg-primary-purple text-white"
        : "text-[#ad92c9] hover:bg-white/5"
    }`;

  const inputClass =
    "w-full px-3 py-2 bg-[#1f1535] border border-[#3b2a6e] rounded-lg text-white placeholder-[#7a6ba0] text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple/50 focus:border-primary-purple";
  const labelClass =
    "block text-xs font-semibold text-[#ad92c9] uppercase tracking-wider mb-1";

  // Countdown helpers
  const updateCountdown = (
    key: "snbp" | "snbt" | "mandiri",
    field: "label" | "date" | "active",
    value: string | boolean
  ) =>
    setData((d) => ({
      ...d,
      countdowns: {
        ...d.countdowns,
        [key]: { ...d.countdowns[key], [field]: value },
      },
    }));

  // FAQ helpers
  const updateFaq = (idx: number, field: keyof FaqItem, value: string) => {
    const next = [...data.faq];
    next[idx] = { ...next[idx], [field]: value };
    setData((d) => ({ ...d, faq: next }));
  };
  const addFaq = () =>
    setData((d) => ({ ...d, faq: [...d.faq, { question: "", answer: "" }] }));
  const removeFaq = (idx: number) =>
    setData((d) => ({ ...d, faq: d.faq.filter((_, i) => i !== idx) }));

  // Contact helpers
  const updateContact = (
    idx: number,
    field: keyof ContactPerson,
    value: string
  ) => {
    const next = [...data.contact_persons];
    next[idx] = { ...next[idx], [field]: value };
    setData((d) => ({ ...d, contact_persons: next }));
  };
  const addContact = () =>
    setData((d) => ({
      ...d,
      contact_persons: [
        ...d.contact_persons,
        { label: "", href: "", icon: "link" },
      ],
    }));
  const removeContact = (idx: number) =>
    setData((d) => ({
      ...d,
      contact_persons: d.contact_persons.filter((_, i) => i !== idx),
    }));

  // Category multi-select toggle
  const toggleCategory = (id: number) => {
    const current = data.recommended_category_ids;
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    setData((d) => ({ ...d, recommended_category_ids: next }));
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Tabs — horizontal scroll on mobile */}
      <div className="flex gap-1.5 sm:gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {(
          [
            ["hero", "Hero"],
            ["countdown", "Countdown"],
            ["artikel", "Artikel"],
            ["faq", "FAQ"],
            ["contact", "Contact"],
          ] as [Tab, string][]
        ).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={tabClass(tab)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Hero Tab */}
      {activeTab === "hero" && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Judul Utama</label>
            <input
              className={inputClass}
              value={data.hero.title}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  hero: { ...d.hero, title: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <label className={labelClass}>Subtitle / Deskripsi Singkat</label>
            <textarea
              rows={3}
              className={inputClass}
              value={data.hero.subtitle}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  hero: { ...d.hero, subtitle: e.target.value },
                }))
              }
            />
          </div>
        </div>
      )}

      {/* Countdown Tab */}
      {activeTab === "countdown" && (
        <div className="space-y-6">
          {(["snbp", "snbt", "mandiri"] as const).map((key) => (
            <div
              key={key}
              className="p-4 bg-[#1f1535] border border-[#3b2a6e] rounded-xl space-y-3"
            >
              {/* Header: label + toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white uppercase">{key.toUpperCase()}</span>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-xs text-[#ad92c9]">
                    {(data.countdowns[key].active ?? true) ? "Aktif" : "Nonaktif"}
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={data.countdowns[key].active ?? true}
                      onChange={(e) => updateCountdown(key, "active", e.target.checked)}
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${(data.countdowns[key].active ?? true) ? "bg-primary-purple" : "bg-[#3b2a6e]"}`} />
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${(data.countdowns[key].active ?? true) ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Label</label>
                  <input
                    className={inputClass}
                    value={data.countdowns[key].label}
                    onChange={(e) =>
                      updateCountdown(key, "label", e.target.value)
                    }
                    placeholder={`mis. ${key.toUpperCase()} 2025`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Tanggal &amp; Waktu Target</label>
                  <input
                    type="datetime-local"
                    className={inputClass}
                    value={data.countdowns[key].date.slice(0, 16)}
                    onChange={(e) =>
                      updateCountdown(key, "date", e.target.value + ":00")
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Artikel Rekomendasi Tab */}
      {activeTab === "artikel" && (
        <div className="space-y-4">
          <p className="text-[#ad92c9] text-sm">
            Pilih kategori yang isinya akan ditampilkan sebagai artikel rekomendasi di halaman Mahasiswa Baru.
            Semua artikel yang dipublikasikan dari kategori terpilih akan otomatis muncul.
          </p>
          {categoriesLoading ? (
            <p className="text-[#7a6ba0] text-sm">Memuat daftar kategori...</p>
          ) : allCategories.length === 0 ? (
            <p className="text-[#7a6ba0] text-sm">Belum ada kategori tersedia.</p>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {allCategories.map((cat) => {
                const selected = data.recommended_category_ids.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${
                      selected
                        ? "bg-primary-purple/20 border-primary-purple text-white"
                        : "bg-[#1f1535] border-[#3b2a6e] text-[#ad92c9] hover:border-primary-purple/50"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-xl shrink-0 ${
                        selected ? "text-primary-purple" : "text-[#5a4a7a]"
                      }`}
                    >
                      {selected ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    <div className="min-w-0 flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg shrink-0 text-[#7a6ba0]">
                        {cat.icon || "folder"}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{cat.title}</p>
                        {cat.description && (
                          <p className="text-xs text-[#7a6ba0] mt-0.5 line-clamp-1">{cat.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          {data.recommended_category_ids.length > 0 && (
            <p className="text-xs text-primary-purple">
              {data.recommended_category_ids.length} kategori dipilih
            </p>
          )}
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === "faq" && (
        <div className="space-y-4">
          {data.faq.map((item, i) => (
            <div
              key={i}
              className="p-4 bg-[#1f1535] border border-[#3b2a6e] rounded-xl space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white">
                  Pertanyaan #{i + 1}
                </span>
                <button
                  onClick={() => removeFaq(i)}
                  className="text-red-400 hover:text-red-300 text-xs transition-colors"
                >
                  Hapus
                </button>
              </div>
              <div>
                <label className={labelClass}>Pertanyaan</label>
                <input
                  className={inputClass}
                  value={item.question}
                  onChange={(e) => updateFaq(i, "question", e.target.value)}
                  placeholder="Tuliskan pertanyaan..."
                />
              </div>
              <div>
                <label className={labelClass}>Jawaban</label>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={item.answer}
                  onChange={(e) => updateFaq(i, "answer", e.target.value)}
                  placeholder="Tuliskan jawaban lengkap..."
                />
              </div>
            </div>
          ))}
          <button
            onClick={addFaq}
            className="w-full py-3 border border-dashed border-[#3b2a6e] rounded-xl text-[#ad92c9] hover:border-primary-purple hover:text-white transition-colors text-sm"
          >
            + Tambah Pertanyaan
          </button>
        </div>
      )}

      {/* Contact Person Tab */}
      {activeTab === "contact" && (
        <div className="space-y-4">
          {/* Banner Text */}
          <div className="p-4 bg-[#1f1535] border border-[#3b2a6e] rounded-xl space-y-3">
            <span className="text-sm font-semibold text-white">Teks Banner</span>
            <div>
              <label className={labelClass}>Judul</label>
              <input
                className={inputClass}
                value={data.contact_section?.title ?? ""}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    contact_section: { ...d.contact_section, title: e.target.value },
                  }))
                }
                placeholder="mis. Butuh Bantuan?"
              />
            </div>
            <div>
              <label className={labelClass}>Deskripsi</label>
              <textarea
                rows={2}
                className={inputClass}
                value={data.contact_section?.description ?? ""}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    contact_section: { ...d.contact_section, description: e.target.value },
                  }))
                }
                placeholder="mis. Tim kami siap membantu..."
              />
            </div>
          </div>

          <p className="text-[#ad92c9] text-sm">
            Tambahkan tombol kontak yang akan ditampilkan di bagian bawah halaman.
            Gunakan nama icon dari{" "}
            <a
              href="https://fonts.google.com/icons"
              target="_blank"
              rel="noopener"
              className="underline text-primary-purple"
            >
              fonts.google.com/icons
            </a>
            .
          </p>
          {data.contact_persons.map((cp, i) => (
            <div
              key={i}
              className="p-4 bg-[#1f1535] border border-[#3b2a6e] rounded-xl space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white">
                  Tombol #{i + 1}
                </span>
                <button
                  onClick={() => removeContact(i)}
                  className="text-red-400 hover:text-red-300 text-xs transition-colors"
                >
                  Hapus
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className={labelClass}>Label Tombol</label>
                  <input
                    className={inputClass}
                    value={cp.label}
                    onChange={(e) =>
                      updateContact(i, "label", e.target.value)
                    }
                    placeholder="mis. Hubungi via WA"
                  />
                </div>
                <div>
                  <label className={labelClass}>Link / URL</label>
                  <input
                    className={inputClass}
                    value={cp.href}
                    onChange={(e) => updateContact(i, "href", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className={labelClass}>Ikon (Material Symbol)</label>
                  <input
                    className={inputClass}
                    value={cp.icon}
                    onChange={(e) => updateContact(i, "icon", e.target.value)}
                    placeholder="mis. chat"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addContact}
            className="w-full py-3 border border-dashed border-[#3b2a6e] rounded-xl text-[#ad92c9] hover:border-primary-purple hover:text-white transition-colors text-sm"
          >
            + Tambah Tombol Kontak
          </button>
        </div>
      )}

      {/* Save */}
      <div className="mt-6 sm:mt-8 flex items-center justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-primary-purple text-white text-sm font-bold rounded-lg hover:bg-[#56298b] transition-colors disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
