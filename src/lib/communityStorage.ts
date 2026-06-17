import { readJson, writeJson } from './storage';

export const COMMUNITY_POSTS_KEY = 'safiri-community-posts';

export function readLocalCommunityPosts<T>(): T[] {
  return readJson<T[]>(COMMUNITY_POSTS_KEY, []);
}

export function writeLocalCommunityPosts<T>(posts: T[]): { ok: true } | { ok: false; error: string } {
  return writeJson(COMMUNITY_POSTS_KEY, posts);
}
