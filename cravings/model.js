export const STORAGE_KEY = 'cravings-lab-v1';
export function emptyState() { return { version: 1, entries: [], experiments: [], reviews: [] }; }
export function readState(storage) {
  try {
    const value = JSON.parse(storage.getItem(STORAGE_KEY));
    if (!value || value.version !== 1 || !['entries','experiments','reviews'].every(k => Array.isArray(value[k]))) return null;
    return value;
  } catch { return null; }
}
export function summarize(entries) {
  const contexts = new Map();
  const withContext = entries.filter(e => e.context && e.context !== 'Something else');
  withContext.forEach(e => contexts.set(e.context, (contexts.get(e.context) || 0) + 1));
  const top = [...contexts].sort((a,b) => b[1] - a[1])[0];
  return { count: entries.length, top: top ? { label: top[0], count: top[1] } : null,
    lossOfControl: entries.filter(e => e.control === 'Hard to stop').length };
}
export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
