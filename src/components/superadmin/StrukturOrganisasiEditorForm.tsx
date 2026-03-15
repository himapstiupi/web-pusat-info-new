"use client";

import { useState } from "react";
import { upsertStrukturOrganisasiContent } from "@/actions/pages";
import { StrukturOrganisasiContent, DEFAULT_STRUKTUR, OrganizationUnit, StaffMember } from "@/lib/struktur-organisasi";
import { toast } from "react-hot-toast";

interface Props { initial: StrukturOrganisasiContent }

type MainTab = "header" | "legislatif" | "eksekutif";

export default function StrukturOrganisasiEditorForm({ initial }: Props) {
  const [data, setData] = useState<StrukturOrganisasiContent>(initial);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>("header");
  const [openUnit, setOpenUnit] = useState<number | null>(null);

  const handleSave = async () => {
    setSaving(true);
    const result = await upsertStrukturOrganisasiContent(data);
    setSaving(false);
    if (result.success) {
      toast.success("Perubahan Struktur berhasil disimpan!");
    } else {
      toast.error(result.error || "Gagal menyimpan.");
    }
  };

  const updateUnitInSection = (
    section: "legislatif" | "eksekutif",
    idx: number,
    field: keyof OrganizationUnit,
    value: any
  ) => {
    setData(d => {
      const units = [...d[section]];
      units[idx] = { ...units[idx], [field]: value };
      return { ...d, [section]: units };
    });
  };

  const updateStaff = (
    section: "legislatif" | "eksekutif",
    unitIdx: number,
    staffIdx: number,
    field: keyof StaffMember,
    value: string
  ) => {
    setData(d => {
      const units = [...d[section]];
      const staff = [...units[unitIdx].staff];
      staff[staffIdx] = { ...staff[staffIdx], [field]: value };
      units[unitIdx] = { ...units[unitIdx], staff };
      return { ...d, [section]: units };
    });
  };

  const addUnit = (section: "legislatif" | "eksekutif") =>
    setData(d => ({ ...d, [section]: [...d[section], { nama: "Unit Baru", image_url: "", staff: [] }] }));

  const removeUnit = (section: "legislatif" | "eksekutif", idx: number) =>
    setData(d => ({ ...d, [section]: d[section].filter((_, i) => i !== idx) }));

  const addStaff = (section: "legislatif" | "eksekutif", unitIdx: number) => {
    const units = [...data[section]];
    units[unitIdx] = { ...units[unitIdx], staff: [...units[unitIdx].staff, { nama: "", jabatan: "" }] };
    setData(d => ({ ...d, [section]: units }));
  };

  const removeStaff = (section: "legislatif" | "eksekutif", unitIdx: number, staffIdx: number) => {
    setData(d => {
      const units = [...d[section]];
      units[unitIdx] = { ...units[unitIdx], staff: units[unitIdx].staff.filter((_, i) => i !== staffIdx) };
      return { ...d, [section]: units };
    });
  };

  const iClass = "w-full px-3 py-2 bg-[#1f1535] border border-[#3b2a6e] rounded-lg text-white placeholder-[#7a6ba0] text-sm focus:outline-none focus:ring-2 focus:ring-primary-purple/50";
  const lClass = "block text-xs font-semibold text-[#ad92c9] uppercase tracking-wider mb-1";
  const tabClass = (t: string) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === t ? "bg-primary-purple text-white" : "text-[#ad92c9] hover:bg-white/5"}`;

  const renderSection = (section: "legislatif" | "eksekutif") => (
    <div className="space-y-3">
      {data[section].map((unit, i) => (
        <div key={i} className="border border-[#3b2a6e] rounded-xl overflow-hidden">
          {/* Unit header / accordion toggle */}
          <div
            className="flex items-center justify-between p-4 cursor-pointer bg-[#1f1535] hover:bg-[#2a1a4a] transition-colors"
            onClick={() => setOpenUnit(openUnit === i ? null : i)}
          >
            <div className="flex items-center gap-3">
              {unit.image_url && (
                <div className="size-8 rounded-full bg-center bg-cover flex-shrink-0 border border-primary/20"
                  style={{ backgroundImage: `url("${unit.image_url}")` }} />
              )}
              <span className="text-white text-sm font-semibold">{unit.nama || `Unit #${i + 1}`}</span>
              <span className="text-[#7a6ba0] text-xs">{unit.staff.length} staff</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); removeUnit(section, i); }}
                className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded transition-colors">Hapus</button>
              <span className="material-symbols-outlined text-[#ad92c9] text-sm">
                {openUnit === i ? "expand_less" : "expand_more"}
              </span>
            </div>
          </div>

          {/* Unit detail */}
          {openUnit === i && (
            <div className="p-4 space-y-4 bg-[#150c28]">
              <div>
                <label className={lClass}>Nama Badan / Departemen</label>
                <input className={iClass} value={unit.nama}
                  onChange={e => updateUnitInSection(section, i, "nama", e.target.value)} />
              </div>
              <div>
                <label className={lClass}>URL Foto</label>
                <input className={iClass} value={unit.image_url}
                  onChange={e => updateUnitInSection(section, i, "image_url", e.target.value)}
                  placeholder="https://..." />
                {unit.image_url && (
                  <img src={unit.image_url} alt="preview"
                    className="mt-2 h-24 w-24 object-cover rounded-xl border border-[#3b2a6e]" />
                )}
              </div>

              {/* Staff list */}
              <div>
                <label className={lClass}>Daftar Staff</label>
                <div className="space-y-2">
                  {unit.staff.map((s, si) => (
                    <div key={si} className="flex gap-2 items-center">
                      <input className={`${iClass} flex-1`} value={s.nama} placeholder="Nama"
                        onChange={e => updateStaff(section, i, si, "nama", e.target.value)} />
                      <input className={`${iClass} flex-1`} value={s.jabatan || ""} placeholder="Jabatan (opsional)"
                        onChange={e => updateStaff(section, i, si, "jabatan", e.target.value)} />
                      <button onClick={() => removeStaff(section, i, si)}
                        className="text-red-400 hover:text-red-300 px-2 shrink-0 transition-colors">✕</button>
                    </div>
                  ))}
                </div>
                <button onClick={() => addStaff(section, i)}
                  className="mt-2 text-primary-purple text-sm hover:text-[#a980e8] transition-colors">
                  + Tambah Staff
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <button onClick={() => addUnit(section)}
        className="w-full py-3 border border-dashed border-[#3b2a6e] rounded-xl text-[#ad92c9] hover:border-primary-purple hover:text-white transition-colors text-sm">
        + Tambah Badan / Departemen
      </button>
    </div>
  );

  return (
    <div>
      {/* Main tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["header", "legislatif", "eksekutif"] as MainTab[]).map(t => (
          <button key={t} onClick={() => { setActiveTab(t); setOpenUnit(null); }} className={tabClass(t)}>
            {t === "header" && "Header"}
            {t === "legislatif" && `Badan Legislatif (${data.legislatif.length})`}
            {t === "eksekutif" && `Badan Eksekutif (${data.eksekutif.length})`}
          </button>
        ))}
      </div>

      {activeTab === "header" && (
        <div className="space-y-4">
          <div>
            <label className={lClass}>Judul Halaman</label>
            <input className={iClass} value={data.header.title}
              onChange={e => setData(d => ({ ...d, header: { ...d.header, title: e.target.value } }))} />
          </div>
          <div>
            <label className={lClass}>Deskripsi</label>
            <input className={iClass} value={data.header.description}
              onChange={e => setData(d => ({ ...d, header: { ...d.header, description: e.target.value } }))} />
          </div>
        </div>
      )}

      {activeTab === "legislatif" && renderSection("legislatif")}
      {activeTab === "eksekutif" && renderSection("eksekutif")}

      {/* Footer */}
      <div className="mt-8 flex items-center justify-end">
        <div className="flex gap-3">
          <button onClick={() => setData(DEFAULT_STRUKTUR)}
            className="px-4 py-2 text-sm text-[#ad92c9] hover:text-white border border-[#3b2a6e] rounded-lg transition-colors">
            Reset Default
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2 bg-primary-purple text-white text-sm font-bold rounded-lg hover:bg-[#56298b] transition-colors disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}
