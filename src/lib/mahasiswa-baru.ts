// Types dan konstanta untuk Mahasiswa Baru - bisa diimpor dari client maupun server

export interface CountdownItem {
  label: string; // e.g. "SNBP 2025"
  date: string;  // ISO datetime string, e.g. "2025-03-31T23:59:00"
  active: boolean; // if false, show "Segera Hadir" instead of countdown
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ContactPerson {
  label: string;  // e.g. "Hubungi via WhatsApp"
  href: string;   // URL or phone link
  icon: string;   // Material Symbol name
}

export interface MahasiswaBaruContent {
  hero: {
    title: string;
    subtitle: string;
  };
  countdowns: {
    snbp: CountdownItem;
    snbt: CountdownItem;
    mandiri: CountdownItem;
  };
  recommended_category_ids: number[]; // category IDs from the categories table
  faq: FaqItem[];
  contact_section: {
    title: string;
    description: string;
  };
  contact_persons: ContactPerson[];
}

export const DEFAULT_MARU: MahasiswaBaruContent = {
  hero: {
    title: "Selamat Datang Mahasiswa Baru Program Studi PSTI",
    subtitle: "Kami siap mendampingi perjalanan akademikmu. Temukan semua informasi yang kamu butuhkan di sini.",
  },
  countdowns: {
    snbp: {
      label: "SNBP",
      date: "2025-03-31T23:59:00",
      active: true,
    },
    snbt: {
      label: "SNBT",
      date: "2025-05-31T23:59:00",
      active: true,
    },
    mandiri: {
      label: "Seleksi Mandiri",
      date: "2025-07-31T23:59:00",
      active: true,
    },
  },
  recommended_category_ids: [],
  faq: [
    {
      question: "Kapan masa orientasi mahasiswa baru dimulai?",
      answer: "Masa orientasi mahasiswa baru akan diumumkan lebih lanjut melalui website dan media sosial resmi HIMA PSTI.",
    },
    {
      question: "Apa saja yang perlu dipersiapkan sebelum kuliah?",
      answer: "Persiapkan perlengkapan akademik seperti laptop, alat tulis, dan pastikan sudah melengkapi berkas administrasi yang diperlukan.",
    },
    {
      question: "Bagaimana cara bergabung dengan HIMA PSTI?",
      answer: "Kamu bisa bergabung dengan HIMA PSTI melalui open recruitment yang diadakan setiap awal semester. Pantau terus media sosial kami.",
    },
  ],
  contact_section: {
    title: "Butuh Bantuan?",
    description: "Tim kami siap membantu menjawab pertanyaanmu. Pilih salah satu cara di bawah untuk menghubungi kami.",
  },
  contact_persons: [

    {
      label: "Hubungi via WhatsApp",
      href: "https://wa.me/6281234567890",
      icon: "chat",
    },
    {
      label: "Ikuti Instagram Kami",
      href: "https://instagram.com/himapstiupi",
      icon: "link",
    },
  ],
};
