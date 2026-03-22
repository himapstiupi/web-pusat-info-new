// Types dan konstanta untuk Tentang Kami - bisa diimpor dari client maupun server

export interface ProgramKerjaItem {
  icon: string;       // Material Symbol name (dipakai jika image_url kosong)
  image_url?: string; // URL gambar kustom (prioritas utama jika diisi)
  title: string;
  desc: string;
}

export interface TentangKamiContent {
  hero: {
    badge: string;
    title: string;
    description: string;
  };
  sejarah: {
    paragraf1: string;
    paragraf2: string;
    image_url: string;
  };
  kabinet: {
    nama: string;
    deskripsi: string;
    image_url: string;
  };
  visi_misi: {
    visi: string;
    misi: string[];
  };
  program_kerja: ProgramKerjaItem[];
  cta: {
    title: string;
    description: string;
    primary_label: string;
    primary_href: string;
    secondary_label: string;
    secondary_href: string;
  };
}

export const DEFAULT_TENTANG_KAMI: TentangKamiContent = {
  hero: {
    badge: "Siapa Kami",
    title: "Tentang Kami",
    description: "Berkomitmen untuk memberikan solusi terbaik dan dukungan tanpa henti bagi setiap pengguna di seluruh dunia.",
  },
  sejarah: {
    paragraf1: "Pusat Bantuan ini didirikan pada tahun 2010 dengan misi sederhana: mempermudah akses informasi bagi semua orang. Berawal dari sebuah garasi kecil dengan tim yang terdiri dari tiga orang teknisi yang berdedikasi.",
    paragraf2: "Kini, kami telah berkembang menjadi platform global yang melayani jutaan pengguna setiap bulannya. Perjalanan kami penuh dengan inovasi berkelanjutan untuk memastikan Anda mendapatkan jawaban yang Anda butuhkan dengan cara yang paling efisien dan ramah.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcufc6r4pOodkDEHTRZH9R7XzG93y-P0uRfDwOTMV4RIkJ8nPD5sxsquJVNanUpVaz6k1ZBtTBq3TXcXldAN82JXy812h65BLzqxMZmbdoj1aJfT_bnwHh7bPh78dGwxrwnHiIHaWr_kzqAIyCvPDUK0Xn6hPZ3nhDiC4EUdseq1ZHV3YsELY0wQ2UgN7y7zvjOUblmNvFmeBESeACdueUwZH6Ea3oTgYU0j-sPWXeWZP4x1QbOs_BXhMaxG_MwrNXPb0q5_-xqA",
  },
  kabinet: {
    nama: "Kabinet Resolusi",
    deskripsi: "Kabinet Resolusi adalah nama kabinet HIMA PSTI periode ini yang membawa semangat perubahan dan resolusi terbaik bagi seluruh mahasiswa PSTI.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcufc6r4pOodkDEHTRZH9R7XzG93y-P0uRfDwOTMV4RIkJ8nPD5sxsquJVNanUpVaz6k1ZBtTBq3TXcXldAN82JXy812h65BLzqxMZmbdoj1aJfT_bnwHh7bPh78dGwxrwnHiIHaWr_kzqAIyCvPDUK0Xn6hPZ3nhDiC4EUdseq1ZHV3YsELY0wQ2UgN7y7zvjOUblmNvFmeBESeACdueUwZH6Ea3oTgYU0j-sPWXeWZP4x1QbOs_BXhMaxG_MwrNXPb0q5_-xqA",
  },
  visi_misi: {
    visi: "Menjadi standar global dalam layanan dukungan pelanggan yang berbasis teknologi manusiawi, di mana setiap masalah menemukan solusi dalam hitungan detik.",
    misi: [
      "Menyediakan basis pengetahuan yang akurat dan mudah diakses.",
      "Mengembangkan teknologi AI pendukung yang responsif.",
      "Membangun komunitas pengguna yang saling membantu.",
    ],
  },
  program_kerja: [
    { icon: "campaign", image_url: "", title: "Program Kerja 1", desc: "Deskripsi program kerja pertama." },
    { icon: "groups", image_url: "", title: "Program Kerja 2", desc: "Deskripsi program kerja kedua." },
    { icon: "school", image_url: "", title: "Program Kerja 3", desc: "Deskripsi program kerja ketiga." },
    { icon: "emoji_events", image_url: "", title: "Program Kerja 4", desc: "Deskripsi program kerja keempat." },
  ],
  cta: {
    title: "Butuh bantuan lebih lanjut?",
    description: "Tim dukungan kami siap membantu Anda 24/7. Jangan ragu untuk menghubungi kami kapan saja.",
    primary_label: "Hubungi Kami",
    primary_href: "https://tr.ee/himapstiupi",
    secondary_label: "Lihat Informasi",
    secondary_href: "/informasi",
  },
};

