// Types dan konstanta untuk Homepage - bisa diimpor dari client maupun server

export interface HomepageContent {
  hero: {
    title: string;
    description: string;
    image_url: string;
  };
  mission_vision: {
    image_url: string;
    stats_number: string;
    stats_label: string;
    visi: string;
    misi: string[];
  };
  values: { icon: string; title: string; desc: string }[];
  cta: {
    title: string;
    description: string;
    primary_label: string;
    primary_href: string;
    secondary_label: string;
    secondary_href: string;
  };
}

export const DEFAULT_HOMEPAGE: HomepageContent = {
  hero: {
    title: "Membangun Jembatan Informasi untuk Masa Depan",
    description: "Kami berkomitmen untuk memberikan akses informasi yang transparan, akurat, dan memberdayakan seluruh lapisan masyarakat.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdqgARRIVNSQ_seBywIMG3VYPMZupG3TWKjdG6DIChhD3pQwpjh5DdSINBLFMixmIcWzNCj7NUnNhBBDjqiO78o6mVfrSXbNcmzpVq6f3OwaF6bxHg3ne4Ig_Zy7K4dZYSeWgQUFwihrxNXuSNye5OWZhY5EA6ku232Y0GiaFynxhAzTTjvrHYh4Fe1dphVEdKRA3DgEokyNiBlTzWVymiDhveqU322gJ97zMyT0XkNyuRyxRkdfMImqi8Zap3WiKW7RW7e0TQJg",
  },
  mission_vision: {
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrQoUoPB0iT6QfnxcH65d6A-z0V19rmCIXDumSPPIdL5qmy9FoUWQUOS10V6ig0LqWdCJEvtDOWIV9XiTq5h9Vfj_s-RLc8Pv63YodxK9grEWELkiEdpBubWOtr8f_Qy_pS-9OtjgN1RvhQNPoUGjzwyDDJ5n0MWaFzQBofiBqvJnaH5s5dggPF6rHPlfImZvpObHGxBXv3F4OPY7RX3ftZAoyjRCCZWbMvtrbL7WaCrB4irwxL9qchJkmlqEX0UP-gYLKrg_Tyg",
    stats_number: "10+",
    stats_label: "Tahun Pengalaman Melayani",
    visi: "Menjadi pusat layanan informasi terdepan dan terpercaya di Indonesia yang mampu menginspirasi perubahan positif melalui literasi data.",
    misi: [
      "Menyediakan data publik yang mudah diakses dan dipahami.",
      "Mengedukasi masyarakat tentang pentingnya validasi informasi.",
      "Membangun infrastruktur informasi digital yang aman dan inklusif.",
    ],
  },
  values: [
    { icon: "verified_user", title: "Integritas", desc: "Kejujuran dan transparansi adalah prioritas utama dalam setiap data yang kami kelola." },
    { icon: "groups", title: "Inklusivitas", desc: "Informasi harus bisa diakses oleh siapa saja, di mana saja, tanpa memandang latar belakang." },
    { icon: "psychology", title: "Inovasi", desc: "Terus mengembangkan teknologi terkini untuk mempermudah penyebaran informasi." },
  ],
  cta: {
    title: "Siap Membantu Anda",
    description: "Tim kami berdedikasi penuh untuk memastikan Anda mendapatkan informasi yang Anda butuhkan dengan cepat dan akurat.",
    primary_label: "Hubungi Kami",
    primary_href: "https://tr.ee/himapstiupi",
    secondary_label: "Pelajari Informasi",
    secondary_href: "/informasi",
  },
};
