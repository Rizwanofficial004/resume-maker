export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('resumemaster_token');
  }
  return null;
}

export function setToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('resumemaster_token', token);
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('resumemaster_token');
    localStorage.removeItem('resumemaster_user');
  }
}

export function getUser() {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('resumemaster_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function setUser(user) {
  if (typeof window !== 'undefined') {
    if (user == null) {
      localStorage.removeItem('resumemaster_user');
    } else {
      localStorage.setItem('resumemaster_user', JSON.stringify(user));
    }
  }
}

/** Paths where a 401 means the session is invalid and should be cleared. */
function isSessionAuthPath(path) {
  return path === '/api/auth/me' || path.startsWith('/api/auth/me?');
}

async function handleResponse(res, path = '') {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.code = data.code;
    // Only wipe the session on true auth-middleware failures, not wrong-password etc.
    if (res.status === 401 && (data.code === 'UNAUTHORIZED' || isSessionAuthPath(path))) {
      clearToken();
    }
    throw error;
  }
  return data;
}

export async function apiFetch(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse(res, path);
}

/** Multipart upload (do not set Content-Type — browser sets boundary). */
export async function apiUpload(path, formData, { method = 'POST', auth = true } = {}) {
  const headers = {};
  const token = getToken();
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: formData,
  });

  return handleResponse(res, path);
}
