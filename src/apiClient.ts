// Lightweight fetch-based API client to avoid external axios dependency during fixes.
export const apiClient: any = {
  // During local development point directly to the backend server
  baseURL: 'http://localhost:5000/api',
  async get<T = any>(path: string) {
    const res = await fetch(this.baseURL + path);
    const data = await res.json().catch(() => null);
    return { data, status: res.status } as { data: T; status: number };
  },
  async post<T = any>(path: string, body?: any) {
    const res = await fetch(this.baseURL + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    });
    const data = await res.json().catch(() => null);
    return { data, status: res.status } as { data: T; status: number };
  },
};
