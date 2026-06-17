import { formatPostedAgo } from '../lib/format';
import { isSupabaseConfigured } from '../lib/config';
import { getSupabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { readLocalSpotInquiries, writeLocalSpotInquiries } from '../lib/spotInquiryStorage';

export type SpotInquiryReply = {
  id: string;
  inquiryId: string;
  authorName: string;
  message: string;
  postedAgo: string;
};

export type SpotInquiry = {
  id: string;
  spotId: string;
  spotTitle: string;
  categoryId: string;
  authorName: string;
  message: string;
  postedAgo: string;
  adminSeen: boolean;
  replies: SpotInquiryReply[];
};

type SpotInquiryRow = Database['public']['Tables']['spot_inquiries']['Row'];
type SpotInquiryReplyRow = Database['public']['Tables']['spot_inquiry_replies']['Row'];

function mapReply(row: SpotInquiryReplyRow): SpotInquiryReply {
  return {
    id: row.id,
    inquiryId: row.inquiry_id,
    authorName: row.author_name,
    message: row.message,
    postedAgo: formatPostedAgo(row.created_at),
  };
}

function mapInquiry(row: SpotInquiryRow, replies: SpotInquiryReplyRow[]): SpotInquiry {
  return {
    id: row.id,
    spotId: row.spot_id,
    spotTitle: row.spot_title,
    categoryId: row.category_id,
    authorName: row.author_name,
    message: row.message,
    postedAgo: formatPostedAgo(row.created_at),
    adminSeen: row.admin_seen,
    replies: replies
      .filter((reply) => reply.inquiry_id === row.id)
      .sort((left, right) => left.created_at.localeCompare(right.created_at))
      .map(mapReply),
  };
}

function sortInquiries(inquiries: SpotInquiry[]): SpotInquiry[] {
  return [...inquiries].sort((left, right) => {
    if (left.postedAgo === 'Just now') {
      return -1;
    }
    if (right.postedAgo === 'Just now') {
      return 1;
    }
    return 0;
  });
}

export async function fetchSpotInquiries(spotId: string): Promise<SpotInquiry[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return sortInquiries(
      readLocalSpotInquiries<SpotInquiry>().filter((inquiry) => inquiry.spotId === spotId),
    );
  }

  const { data: inquiryRows, error: inquiryError } = await supabase
    .from('spot_inquiries')
    .select('*')
    .eq('spot_id', spotId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (inquiryError || !inquiryRows) {
    console.warn('Spot inquiries fallback:', inquiryError?.message);
    return sortInquiries(
      readLocalSpotInquiries<SpotInquiry>().filter((inquiry) => inquiry.spotId === spotId),
    );
  }

  const rows = inquiryRows as SpotInquiryRow[];
  if (rows.length === 0) {
    return [];
  }

  const inquiryIds = rows.map((row) => row.id);
  const { data: replyRows, error: replyError } = await supabase
    .from('spot_inquiry_replies')
    .select('*')
    .in('inquiry_id', inquiryIds)
    .order('created_at', { ascending: true });

  const replies = (replyRows as SpotInquiryReplyRow[] | null) ?? [];
  if (replyError) {
    console.warn('Spot inquiry replies fallback:', replyError.message);
  }

  return rows.map((row) => mapInquiry(row, replies));
}

export async function postSpotInquiry(input: {
  spotId: string;
  spotTitle: string;
  categoryId: string;
  userId?: string;
  authorName: string;
  message: string;
}): Promise<SpotInquiry | null> {
  const trimmed = input.message.trim();
  if (!trimmed) {
    return null;
  }

  const supabase = getSupabase();
  if (!supabase) {
    const inquiry: SpotInquiry = {
      id: `local-inquiry-${Date.now()}`,
      spotId: input.spotId,
      spotTitle: input.spotTitle,
      categoryId: input.categoryId,
      authorName: input.authorName,
      message: trimmed,
      postedAgo: 'Just now',
      adminSeen: false,
      replies: [],
    };
    const next = [inquiry, ...readLocalSpotInquiries<SpotInquiry>()];
    const writeResult = writeLocalSpotInquiries(next);
    if (!writeResult.ok) {
      console.error(writeResult.error);
      return null;
    }
    return inquiry;
  }

  const payload = {
    spot_id: input.spotId,
    spot_title: input.spotTitle,
    category_id: input.categoryId,
    user_id: input.userId ?? null,
    author_name: input.authorName,
    message: trimmed,
    status: 'published' as const,
    admin_seen: false,
  };

  const { data, error } = await supabase.from('spot_inquiries').insert(payload as never).select('*').single();
  const row = data as SpotInquiryRow | null;

  if (error || !row) {
    console.error('Failed to post spot inquiry:', error?.message);
    return null;
  }

  return mapInquiry(row, []);
}

export async function postSpotInquiryReply(input: {
  inquiryId: string;
  userId?: string;
  authorName: string;
  message: string;
}): Promise<SpotInquiryReply | null> {
  const trimmed = input.message.trim();
  if (!trimmed) {
    return null;
  }

  const supabase = getSupabase();
  if (!supabase) {
    const reply: SpotInquiryReply = {
      id: `local-reply-${Date.now()}`,
      inquiryId: input.inquiryId,
      authorName: input.authorName,
      message: trimmed,
      postedAgo: 'Just now',
    };
    const next = readLocalSpotInquiries<SpotInquiry>().map((inquiry) =>
      inquiry.id === input.inquiryId
        ? { ...inquiry, replies: [...inquiry.replies, reply] }
        : inquiry,
    );
    const writeResult = writeLocalSpotInquiries(next);
    if (!writeResult.ok) {
      console.error(writeResult.error);
      return null;
    }
    return reply;
  }

  const payload = {
    inquiry_id: input.inquiryId,
    user_id: input.userId ?? null,
    author_name: input.authorName,
    message: trimmed,
  };

  const { data, error } = await supabase
    .from('spot_inquiry_replies')
    .insert(payload as never)
    .select('*')
    .single();
  const row = data as SpotInquiryReplyRow | null;

  if (error || !row) {
    console.error('Failed to post spot inquiry reply:', error?.message);
    return null;
  }

  return mapReply(row);
}

export function getSpotInquirySourceLabel(): 'supabase' | 'local' {
  return isSupabaseConfigured() ? 'supabase' : 'local';
}
