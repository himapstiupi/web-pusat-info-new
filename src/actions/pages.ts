"use server";

import { createClient } from '@/lib/supabase/server';
import { HomepageContent, DEFAULT_HOMEPAGE } from '@/lib/homepage';
import { TentangKamiContent, DEFAULT_TENTANG_KAMI } from '@/lib/tentang-kami';
import { StrukturOrganisasiContent, DEFAULT_STRUKTUR } from '@/lib/struktur-organisasi';


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
    .single();

  if (error) {
    console.error('Error fetching page:', error);
    return null;
  }

  return data as PageData;
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
