/** Split stored description text into display bullet points (one line = one point). */
export function parseDescriptionPoints(description: string): string[] {
  return description
    .split('\n')
    .map((line) => line.trim().replace(/^[-•*]\s*/, ''))
    .filter(Boolean);
}

export function formatDescriptionPoints(points: string[]): string {
  return points.join('\n');
}
