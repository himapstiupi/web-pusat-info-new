// Types dan konstanta untuk Struktur Organisasi (versi Badan)

export interface StaffMember {
  nama: string;
  jabatan?: string;
}

export interface OrganizationUnit {
  nama: string;        // nama badan/departemen
  image_url: string;   // 1 foto per unit
  staff: StaffMember[];
}

export interface StrukturOrganisasiContent {
  header: {
    title: string;
    description: string;
  };
  legislatif: OrganizationUnit[];
  eksekutif: OrganizationUnit[];
}

const PLACEHOLDER_IMG = "https://ui-avatars.com/api/?background=135bec&color=fff&size=200&name=";

const blankUnit = (nama: string): OrganizationUnit => ({
  nama,
  image_url: `${PLACEHOLDER_IMG}${encodeURIComponent(nama)}`,
  staff: [],
});

export const DEFAULT_STRUKTUR: StrukturOrganisasiContent = {
  header: {
    title: "Struktur Organisasi",
    description: "Susunan pengurus HIMA PSTI — Badan Legislatif dan Badan Eksekutif.",
  },
  legislatif: [
    { nama: "Ketua Badan Legislatif", image_url: `${PLACEHOLDER_IMG}Ketua%20Legislatif`, staff: [{ nama: "", jabatan: "Ketua" }] },
    { nama: "Wakil Ketua Badan Legislatif", image_url: `${PLACEHOLDER_IMG}Wakil%20Ketua%20Legislatif`, staff: [{ nama: "", jabatan: "Wakil Ketua" }] },
    blankUnit("Badan Administrasi"),
    blankUnit("Badan Keuangan"),
    blankUnit("Badan Urusan Rumah Tangga"),
    blankUnit("Badan Legislasi"),
    blankUnit("Badan Aspirasi"),
    blankUnit("Komisi 1"),
    blankUnit("Komisi 2"),
    blankUnit("Komisi 3"),
  ],
  eksekutif: [
    { nama: "Ketua Badan Eksekutif", image_url: `${PLACEHOLDER_IMG}Ketua%20Eksekutif`, staff: [{ nama: "", jabatan: "Ketua" }] },
    { nama: "Wakil Ketua Badan Eksekutif", image_url: `${PLACEHOLDER_IMG}Wakil%20Ketua%20Eksekutif`, staff: [{ nama: "", jabatan: "Wakil Ketua" }] },
    blankUnit("Departemen Sekretaris"),
    blankUnit("Departemen Bendahara"),
    blankUnit("Departemen Internal"),
    blankUnit("Departemen Eksternal"),
    blankUnit("Departemen PSDO"),
    blankUnit("Departemen MIKAT"),
    blankUnit("Departemen Pendidikan"),
    blankUnit("Departemen KOMINFO"),
    blankUnit("Departemen P2M"),
    blankUnit("Departemen KWU"),
  ],
};
