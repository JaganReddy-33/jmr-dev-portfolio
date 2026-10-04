import { API_URL } from '../config/site';

const KEY = 'ak';
export const adminKey = {
  get() { try { return sessionStorage.getItem(KEY) || ''; } catch { return ''; } },
  set(v) { try { v ? sessionStorage.setItem(KEY, v) : sessionStorage.removeItem(KEY); } catch { /* ignore */ } },
};

/** Returns parsed JSON / true on success, false on an HTTP error, null when the server is unreachable. */
async function request(path, { method = 'GET', body, timeout = 3000 } = {}) {
  try {
    const res = await fetch(API_URL + path, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey.get() },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(timeout),
    });
    if (!res.ok) return false;
    const text = await res.text();
    return text ? JSON.parse(text) : true;
  } catch {
    return null;
  }
}

// Long timeouts: a sleeping free-tier server can take a while to wake up.
export const contentApi = {
  list: (c) => request(`/api/content/${c}`, { timeout: 20000 }),
  put: (c, item) => request(`/api/content/${c}/${item.id}`, { method: 'PUT', body: item, timeout: 20000 }),
  remove: (c, id) => request(`/api/content/${c}/${id}`, { method: 'DELETE', timeout: 20000 }),
};
export const authApi = { check: () => request('/api/auth', { timeout: 20000 }) };
export const contactApi = { send: (data) => request('/api/contact', { method: 'POST', body: data, timeout: 30000 }) };
export const messagesApi = {
  list: () => request('/api/messages', { timeout: 20000 }),
  setSeen: (id, seen) => request(`/api/messages/${id}/seen`, { method: 'PUT', body: { seen }, timeout: 20000 }),
  markAllSeen: () => request('/api/messages/seen-all', { method: 'POST', body: {}, timeout: 20000 }),
  remove: (id) => request(`/api/messages/${id}`, { method: 'DELETE', timeout: 20000 }),
};
export const getMessages = messagesApi.list; // backward compatibility