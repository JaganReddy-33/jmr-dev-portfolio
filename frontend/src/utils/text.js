/** "• a • b", new lines, or plain sentences become a list of bullet strings. */
export function toBullets(text) {
  const raw = String(text || '').trim();
  if (!raw) return [];
  const parts = /[•\n]/.test(raw) ? raw.split(/\s*[•\n]\s*/) : raw.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g) || [raw];
  return parts.map((s) => s.replace(/^[-–*•\s]+/, '').trim()).filter(Boolean);
}
export const techList = (t) => String(t || '').split(',').map((s) => s.trim()).filter(Boolean);
export const initialsOf = (s) => (s || '?').trim().slice(0, 2);