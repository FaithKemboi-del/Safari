export function splitPricing(pricing?: string): { badge?: string; detail?: string } {
  if (!pricing?.trim()) {
    return {};
  }

  const trimmed = pricing.trim();
  const lines = trimmed
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    return {
      badge: lines[0],
      detail: lines.slice(1).join('\n\n'),
    };
  }

  const sentenceBreak = trimmed.search(/[.!?]\s+/);
  if (sentenceBreak !== -1 && sentenceBreak < trimmed.length - 2) {
    const badge = trimmed.slice(0, sentenceBreak + 1).trim();
    const detail = trimmed.slice(sentenceBreak + 1).trim();
    if (detail.length > 20) {
      return { badge, detail };
    }
  }

  return { badge: trimmed };
}

export function splitHikeDifficulty(hikeDifficulty?: string): { badge?: string; detail?: string } {
  if (!hikeDifficulty?.trim()) {
    return {};
  }

  const trimmed = hikeDifficulty.trim();
  const parts = trimmed.split('—').map((part) => part.trim());

  if (parts.length > 1 && parts[1]) {
    return {
      badge: parts[0],
      detail: trimmed,
    };
  }

  return { badge: trimmed };
}
