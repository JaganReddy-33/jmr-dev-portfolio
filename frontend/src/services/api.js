import { API_URL } from '../config/site';

const KEY = 'ak';
export const adminKey = {
  get() { try { return sessionStorage.getItem(KEY) || ''; } catch { return ''; } },
  set(v) { try { v ? sessionStorage.setItem(KEY, v) : sessionStorage.removeItem(KEY); } catch { /* ignore */ } },
};

/** Returns parsed JSON / true on success, false on an HTTP error, null when the server is unreachable. */
async function request(path, { method = 'GET', body } = {}) {
  try {
    const res = await fetch(API_URL + path, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey.get() },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return false;
    const text = await res.text();
    return text ? JSON.parse(text) : true;
  } catch {
    return null;
  }
}

export const contentApi = {
  list: (c) => request(`/api/content/${c}`),
  put: (c, item) => request(`/api/content/${c}/${item.id}`, { method: 'PUT', body: item }),
  remove: (c, id) => request(`/api/content/${c}/${id}`, { method: 'DELETE' }),
};
export const authApi = { check: () => request('/api/auth') };
export const contactApi = { send: (data) => request('/api/contact', { method: 'POST', body: data }) };
