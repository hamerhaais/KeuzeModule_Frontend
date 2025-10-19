// Centralized API configuration and helpers
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const endpoints = {
  modules: `${API_BASE_URL}/keuzemodules`,
  moduleById: (id) => `${API_BASE_URL}/keuzemodules/${id}`,
  login: `${API_BASE_URL}/auth/login`,
  logout: `${API_BASE_URL}/auth/logout`,
  enrollments: `${API_BASE_URL}/enrollments`,
  myEnrollments: `${API_BASE_URL}/enrollments/me`,
  firstChoice: `${API_BASE_URL}/enrollments/first-choice`,
};

export async function apiGet(url, token) {
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json();
}

export async function apiPost(url, body, token) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${url} failed: ${res.status} ${text}`);
  }
  try { return await res.json(); } catch { return null; }
}

export async function apiPut(url, body, token) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PUT ${url} failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function apiDelete(url, token) {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DELETE ${url} failed: ${res.status} ${text}`);
  }
  try { return await res.json(); } catch { return null; }
}

// Convenience helpers for enrollments
export async function enroll(moduleId, token) {
  return apiPost(endpoints.enrollments, { moduleId }, token);
}

export async function getMyEnrollments(token) {
  return apiGet(endpoints.myEnrollments, token);
}

export async function setFirstChoice(moduleId, firstChoice, token) {
  return apiPut(endpoints.firstChoice, { moduleId, firstChoice }, token);
}
