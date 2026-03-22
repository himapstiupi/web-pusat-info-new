"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type AnnouncementType = 'running_text' | 'popup';

export interface Announcement {
  id?: string;
  title: string;
  type: AnnouncementType;
  content: string;
  button_label?: string | null;
  button_link?: string | null;
  show_on_pages: string[];
  exclude_pages: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Retrieves ONLY active announcements for the public frontend.
 */
export async function getPublicAnnouncements(): Promise<Announcement[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public announcements:', error);
    return [];
  }

  return data as Announcement[];
}

/**
 * Retrieves ALL announcements (active & inactive) for the admin dashboard.
 */
export async function getAdminAnnouncements(): Promise<Announcement[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin announcements:', error);
    return [];
  }

  return data as Announcement[];
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching announcement:', error);
    return null;
  }

  return data as Announcement;
}

export async function upsertAnnouncement(announcement: Announcement): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Validate session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  if (announcement.id) {
    // Update existing
    const { error } = await supabase
      .from('announcements')
      .update({
        ...announcement,
        id: undefined, // Don't try to update the ID
      })
      .eq('id', announcement.id);
      
    if (error) return { success: false, error: error.message };
  } else {
    // Insert new
    const { error } = await supabase
      .from('announcements')
      .insert({
        title: announcement.title,
        type: announcement.type,
        content: announcement.content,
        button_label: announcement.button_label,
        button_link: announcement.button_link,
        show_on_pages: announcement.show_on_pages,
        exclude_pages: announcement.exclude_pages,
        is_active: announcement.is_active,
      });

    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function deleteAnnouncement(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Validate session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function toggleAnnouncementStatus(id: string, currentStatus: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Validate session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('announcements')
    .update({ is_active: !currentStatus })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}
