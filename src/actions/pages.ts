"use server";

import { createClient } from '@/lib/supabase/server';
import { HomepageContent, DEFAULT_HOMEPAGE } from '@/lib/homepage';
import { TentangKamiContent, DEFAULT_TENTANG_KAMI } from '@/lib/tentang-kami';
import { StrukturOrganisasiContent, DEFAULT_STRUKTUR } from '@/lib/struktur-organisasi';
import { MahasiswaBaruContent, DEFAULT_MARU } from '@/lib/mahasiswa-baru';


export interface PageData {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export async function getPageBySlug(slug: string): Promise<PageData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching page:', error);
    return null;
  }

  return data as PageData | null;
}

export async function getAllPages(): Promise<PageData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all pages:', error);
    return [];
  }

  return data as PageData[];
}

export async function updatePage(id: number, content: string, title?: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  
  const updateData: any = {
      content,
      updated_at: new Date().toISOString(),
  };
  if(title) {
      updateData.title = title;
  }

  const { error } = await supabase
    .from('pages')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating page:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ─── Homepage CMS ─────────────────────────────────────────────────────────────


export async function getHomepageContent(): Promise<HomepageContent> {
  const page = await getPageBySlug('home');
  if (!page || !page.content) return DEFAULT_HOMEPAGE;
  try {
    return JSON.parse(page.content) as HomepageContent;
  } catch {
    return DEFAULT_HOMEPAGE;
  }
}

export async function upsertHomepageContent(content: HomepageContent): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const contentStr = JSON.stringify(content);

  // Check if 'home' slug exists
  const { data: existing } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', 'home')
    .single();

  if (existing) {
    return updatePage(existing.id, contentStr, 'Beranda');
  }

  // Insert new
  const { error } = await supabase.from('pages').insert({
    slug: 'home',
    title: 'Beranda',
    content: contentStr,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}


// --- Tentang Kami CMS ---

export async function getTentangKamiContent(): Promise<TentangKamiContent> {
  const page = await getPageBySlug('tentang-kami');
  if (!page || !page.content) return DEFAULT_TENTANG_KAMI;
  try { return JSON.parse(page.content) as TentangKamiContent; } catch { return DEFAULT_TENTANG_KAMI; }
}

export async function upsertTentangKamiContent(content: TentangKamiContent): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const contentStr = JSON.stringify(content);
  const { data: existing } = await supabase.from('pages').select('id').eq('slug', 'tentang-kami').single();
  if (existing) return updatePage(existing.id, contentStr, 'Tentang Kami');
  const { error } = await supabase.from('pages').insert({ slug: 'tentang-kami', title: 'Tentang Kami', content: contentStr, updated_at: new Date().toISOString() });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// --- Struktur Organisasi CMS ---

export async function getStrukturOrganisasiContent(): Promise<StrukturOrganisasiContent> {
  const page = await getPageBySlug('struktur-organisasi');
  if (!page || !page.content) return DEFAULT_STRUKTUR;
  try { return JSON.parse(page.content) as StrukturOrganisasiContent; } catch { return DEFAULT_STRUKTUR; }
}

export async function upsertStrukturOrganisasiContent(content: StrukturOrganisasiContent): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const contentStr = JSON.stringify(content);
  const { data: existing } = await supabase.from('pages').select('id').eq('slug', 'struktur-organisasi').single();
  if (existing) return updatePage(existing.id, contentStr, 'Struktur Organisasi');
  const { error } = await supabase.from('pages').insert({ slug: 'struktur-organisasi', title: 'Struktur Organisasi', content: contentStr, updated_at: new Date().toISOString() });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// --- Mahasiswa Baru CMS ---

export async function getMahasiswaBaruContent(): Promise<MahasiswaBaruContent> {
  const page = await getPageBySlug('mahasiswa-baru');
  if (!page || !page.content) return DEFAULT_MARU;
  try {
    const parsed = JSON.parse(page.content);
    // Deep-merge with DEFAULT_MARU so renamed/new fields always have a safe default
    const merged: MahasiswaBaruContent = {
      ...DEFAULT_MARU,
      ...parsed,
      recommended_category_ids: parsed.recommended_category_ids ?? [],
      contact_section: {
        ...DEFAULT_MARU.contact_section,
        ...parsed.contact_section,
      },
      countdowns: {
        snbp:     { ...DEFAULT_MARU.countdowns.snbp,     ...parsed.countdowns?.snbp,     active: parsed.countdowns?.snbp?.active     ?? true },
        snbt:     { ...DEFAULT_MARU.countdowns.snbt,     ...parsed.countdowns?.snbt,     active: parsed.countdowns?.snbt?.active     ?? true },
        mandiri:  { ...DEFAULT_MARU.countdowns.mandiri,  ...parsed.countdowns?.mandiri,  active: parsed.countdowns?.mandiri?.active  ?? true },
      },
    };
    return merged;
  } catch { return DEFAULT_MARU; }
}

export async function upsertMahasiswaBaruContent(content: MahasiswaBaruContent): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const contentStr = JSON.stringify(content);
  const { data: existing } = await supabase.from('pages').select('id').eq('slug', 'mahasiswa-baru').single();
  if (existing) return updatePage(existing.id, contentStr, 'Mahasiswa Baru');
  const { error } = await supabase.from('pages').insert({ slug: 'mahasiswa-baru', title: 'Mahasiswa Baru', content: contentStr, updated_at: new Date().toISOString() });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// --- Helper: fetch articles from selected categories ---

export async function getArticlesByCategories(
  categoryIds: number[]
): Promise<{ id: string; title: string; category_slug: string; image_url?: string }[]> {
  if (!categoryIds || categoryIds.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, image_url, categories(slug)')
    .in('category_id', categoryIds)
    .eq('is_published', true)
    .order('created_at', { ascending: false });
  if (error || !data) {
    console.error('Error fetching articles by categories:', error);
    return [];
  }
  return data.map((a: any) => ({
    id: a.id,
    title: a.title,
    image_url: a.image_url ?? undefined,
    category_slug: a.categories?.slug ?? 'public',
  }));
}

