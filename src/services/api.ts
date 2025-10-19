export const API_BASE_URL: string = (import.meta as any).env.VITE_API_BASE_URL || 'https://keuzemodule-backend-1.onrender.com';

export const endpoints = {
  modules: `${API_BASE_URL}/keuzemodules`,
  moduleById: (id: string | number) => `${API_BASE_URL}/keuzemodules/${id}`,
  login: `${API_BASE_URL}/auth/login`,
  logout: `${API_BASE_URL}/auth/logout`,
  enrollments: `${API_BASE_URL}/enrollments`,
  myEnrollments: `${API_BASE_URL}/enrollments/me`,
  firstChoice: `${API_BASE_URL}/enrollments/first-choice`,
} as const;

export async function apiGet<T = any>(url: string, token?: string | null): Promise<T> {
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T = any>(url: string, body: unknown, token?: string | null): Promise<T | null> {
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

export async function apiPut<T = any>(url: string, body: unknown, token?: string | null): Promise<T> {
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

export async function apiDelete<T = any>(url: string, token?: string | null): Promise<T | null> {
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
export async function enroll(moduleId: number, token?: string | null) {
  return apiPost(endpoints.enrollments, { moduleId }, token);
}

export async function getMyEnrollments(token?: string | null) {
  return apiGet(endpoints.myEnrollments, token);
}

export async function setFirstChoice(moduleId: number, firstChoice: boolean, token?: string | null) {
  return apiPut(endpoints.firstChoice, { moduleId, firstChoice }, token);
}
