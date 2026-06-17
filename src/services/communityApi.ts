import type { CommunityPost, CommunityPostKind } from '../data';
import { globalCommunityPosts } from '../data';
import { formatPostedAgo } from '../lib/format';
import { isSupabaseConfigured } from '../lib/config';
import { getSupabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { readLocalCommunityPosts, writeLocalCommunityPosts } from '../lib/communityStorage';

type CommunityPostRow = Database['public']['Tables']['community_posts']['Row'];

function initialsFromName(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function mapCommunityPost(row: CommunityPostRow): CommunityPost {
  return {
    id: row.id,
    author: row.author_name,
    avatar: initialsFromName(row.author_name),
    message: row.message,
    kind: row.kind,
    destinationSlug: row.destination_slug ?? undefined,
    itineraryId: row.itinerary_id ?? undefined,
    postedAgo: row.is_pinned ? 'Pinned' : formatPostedAgo(row.created_at),
    isPinned: row.is_pinned,
  };
}

function sortPosts(posts: CommunityPost[]): CommunityPost[] {
  return [...posts].sort((left, right) => {
    if (Boolean(left.isPinned) !== Boolean(right.isPinned)) {
      return left.isPinned ? -1 : 1;
    }
    return 0;
  });
}

function mergeSeedPosts(posts: CommunityPost[]): CommunityPost[] {
  const pinnedSeed = globalCommunityPosts.filter((post) => post.isPinned);
  const existingIds = new Set(posts.map((post) => post.id));
  const missingPinned = pinnedSeed.filter((post) => !existingIds.has(post.id));
  return sortPosts([...missingPinned, ...posts]);
}

export async function fetchGlobalCommunityPosts(limit?: number): Promise<CommunityPost[]> {
  const supabase = getSupabase();
  if (!supabase) {
    const local = mergeSeedPosts(readLocalCommunityPosts<CommunityPost>());
    const fallback = local.length ? local : globalCommunityPosts;
    return typeof limit === 'number' ? fallback.slice(0, limit) : fallback;
  }

  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .eq('status', 'published')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  const rows = data as CommunityPostRow[] | null;

  if (error || !rows) {
    console.warn('Supabase community posts fallback:', error?.message);
    const local = mergeSeedPosts(readLocalCommunityPosts<CommunityPost>());
    const fallback = local.length ? local : globalCommunityPosts;
    return typeof limit === 'number' ? fallback.slice(0, limit) : fallback;
  }

  const mapped = sortPosts(rows.map(mapCommunityPost));
  const withPinned = mergeSeedPosts(mapped);
  return typeof limit === 'number' ? withPinned.slice(0, limit) : withPinned;
}

export async function postGlobalCommunityPost(input: {
  userId?: string;
  authorName: string;
  message: string;
  kind: CommunityPostKind;
  destinationSlug?: string;
  itineraryId?: string;
}): Promise<CommunityPost | null> {
  const supabase = getSupabase();
  if (!supabase) {
    const post: CommunityPost = {
      id: `local-cp-${Date.now()}`,
      author: input.authorName,
      avatar: initialsFromName(input.authorName),
      message: input.message.trim(),
      kind: input.kind,
      destinationSlug: input.destinationSlug,
      itineraryId: input.itineraryId,
      postedAgo: 'Just now',
    };
    const next = [post, ...readLocalCommunityPosts<CommunityPost>()];
    const writeResult = writeLocalCommunityPosts(next);
    if (!writeResult.ok) {
      console.error(writeResult.error);
      return null;
    }
    return post;
  }

  const payload = {
    user_id: input.userId ?? null,
    author_name: input.authorName,
    message: input.message.trim(),
    kind: input.kind,
    destination_slug: input.destinationSlug ?? null,
    itinerary_id: input.itineraryId ?? null,
    status: 'published' as const,
  };

  const { data, error } = await supabase.from('community_posts').insert(payload as never).select('*').single();
  const row = data as CommunityPostRow | null;

  if (error || !row) {
    console.error('Failed to post community message:', error?.message);
    return null;
  }

  return mapCommunityPost(row);
}

export function getCommunitySourceLabel(): 'supabase' | 'local' {
  return isSupabaseConfigured() ? 'supabase' : 'local';
}
