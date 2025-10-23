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
  console.log(`[API GET] ${url}`);
  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
      console.error(`[API GET] Failed: ${url} - Status ${res.status}`);
      const text = await res.text();
      console.error(`[API GET] Response: ${text}`);
      throw new Error(`GET ${url} failed: ${res.status}`);
    }
    const data = await res.json();
    console.log(`[API GET] Success: ${url}`);
    return data;
  } catch (error: any) {
    console.error(`[API GET] Error: ${url}`, error);
    throw error;
  }
}

export async function apiPost<T = any>(url: string, body: unknown, token?: string | null): Promise<T | null> {
  console.log(`[API POST] ${url}`, body);
  try {
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
      console.error(`[API POST] Failed: ${url} - Status ${res.status}`);
      console.error(`[API POST] Response: ${text}`);
      throw new Error(`POST ${url} failed: ${res.status} ${text}`);
    }
    try {
      const data = await res.json();
      console.log(`[API POST] Success: ${url}`);
      return data;
    } catch {
      console.log(`[API POST] Success (no JSON): ${url}`);
      return null;
    }
  } catch (error: any) {
    console.error(`[API POST] Error: ${url}`, error);
    throw error;
  }
}

export async function apiPut<T = any>(url: string, body: unknown, token?: string | null): Promise<T> {
  console.log(`[API PUT] ${url}`, body);
  try {
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
      console.error(`[API PUT] Failed: ${url} - Status ${res.status}`);
      console.error(`[API PUT] Response: ${text}`);
      throw new Error(`PUT ${url} failed: ${res.status} ${text}`);
    }
    const data = await res.json();
    console.log(`[API PUT] Success: ${url}`);
    return data;
  } catch (error: any) {
    console.error(`[API PUT] Error: ${url}`, error);
    throw error;
  }
}

export async function apiDelete<T = any>(url: string, token?: string | null): Promise<T | null> {
  console.log(`[API DELETE] ${url}`);
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`[API DELETE] Failed: ${url} - Status ${res.status}`);
      console.error(`[API DELETE] Response: ${text}`);
      throw new Error(`DELETE ${url} failed: ${res.status} ${text}`);
    }
    try {
      const data = await res.json();
      console.log(`[API DELETE] Success: ${url}`);
      return data;
    } catch {
      console.log(`[API DELETE] Success (no JSON): ${url}`);
      return null;
    }
  } catch (error: any) {
    console.error(`[API DELETE] Error: ${url}`, error);
    throw error;
  }
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
