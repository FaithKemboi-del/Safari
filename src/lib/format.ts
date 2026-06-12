export function formatPostedAgo(isoDate: string): string {
  const created = new Date(isoDate).getTime();
  const diffMs = Date.now() - created;
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);
  if (days === 1) {
    return 'Yesterday';
  }

  return `${days} days ago`;
}

export function isLiveUpdate(isOnGround: boolean, createdAt: string): boolean {
  if (!isOnGround) {
    return false;
  }

  const ageMs = Date.now() - new Date(createdAt).getTime();
  return ageMs <= 24 * 60 * 60 * 1000;
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return 'SL';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
