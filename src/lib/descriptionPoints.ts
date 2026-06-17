function stripListPrefix(text: string): string {
  return text.replace(/^and\s+/i, '').replace(/\.\s*$/, '').trim();
}

/** Split stored description text into display bullet points (one line = one point). */
export function parseDescriptionPoints(description: string): string[] {
  const raw = description.trim();
  if (!raw) {
    return [];
  }

  const fromLines = raw
    .split('\n')
    .map((line) => line.trim().replace(/^[-•*]\s*/, ''))
    .filter(Boolean);

  if (fromLines.length > 1) {
    return fromLines;
  }

  const singleLine = fromLines[0] ?? raw;

  const fromDash = singleLine
    .split(/\s+[—–]\s+/)
    .map((part) => stripListPrefix(part))
    .filter(Boolean);

  if (fromDash.length > 1) {
    return fromDash;
  }

  const commaCount = (singleLine.match(/,/g) ?? []).length;
  if (commaCount >= 2) {
    return singleLine
      .split(/,\s+/)
      .map(stripListPrefix)
      .filter(Boolean);
  }

  return [singleLine];
}

export function formatDescriptionPoints(points: string[]): string {
  return points.join('\n');
}
