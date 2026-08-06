const TOKEN_KEY = 'jazz_admin_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(path, { ...init, headers, credentials: 'include' });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getCatalog: () => request<import('../types').Catalog>('/api/catalog'),
  login: (password: string) =>
    request<{ token: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
  logout: () => request<{ ok: boolean }>('/api/admin/logout', { method: 'POST' }),
  session: () => request<{ authenticated: boolean }>('/api/admin/session'),
  parseEmail: (text: string, defaultYear?: number) =>
    request<{ editionLabel?: string; drafts: import('../types').ParsedEventDraft[] }>(
      '/api/admin/parse-email',
      {
        method: 'POST',
        body: JSON.stringify({ text, defaultYear }),
      },
    ),
  importEvents: (body: {
    drafts: import('../types').ParsedEventDraft[];
    replaceDates?: string[];
    editionLabel?: string;
  }) =>
    request<{ imported: number; catalog: import('../types').Catalog }>(
      '/api/admin/import-events',
      { method: 'POST', body: JSON.stringify(body) },
    ),
  saveEvent: (event: import('../types').JazzEvent) =>
    request<import('../types').Catalog>(`/api/admin/events/${event.id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    }),
  createEvent: (event: import('../types').JazzEvent) =>
    request<import('../types').Catalog>('/api/admin/events', {
      method: 'POST',
      body: JSON.stringify(event),
    }),
  archiveEvent: (id: string) =>
    request<import('../types').Catalog>(`/api/admin/events/${id}/archive`, {
      method: 'POST',
    }),
  restoreEvent: (id: string) =>
    request<import('../types').Catalog>(`/api/admin/events/${id}/restore`, {
      method: 'POST',
    }),
  purgeEvent: (id: string) =>
    request<import('../types').Catalog>(`/api/admin/events/${id}`, {
      method: 'DELETE',
    }),
  getAdminCatalog: () =>
    request<import('../types').Catalog>('/api/admin/catalog'),
  saveVenue: (venue: import('../types').Venue) =>
    request<import('../types').Catalog>(`/api/admin/venues/${venue.id}`, {
      method: 'PUT',
      body: JSON.stringify(venue),
    }),
  createVenue: (venue: import('../types').Venue) =>
    request<import('../types').Catalog>('/api/admin/venues', {
      method: 'POST',
      body: JSON.stringify(venue),
    }),
  saveSeries: (series: import('../types').OngoingSeries) =>
    request<import('../types').Catalog>(`/api/admin/series/${series.id}`, {
      method: 'PUT',
      body: JSON.stringify(series),
    }),
  createSeries: (series: import('../types').OngoingSeries) =>
    request<import('../types').Catalog>('/api/admin/series', {
      method: 'POST',
      body: JSON.stringify(series),
    }),
  deleteSeries: (id: string) =>
    request<import('../types').Catalog>(`/api/admin/series/${id}`, {
      method: 'DELETE',
    }),
  setEdition: (editionLabel: string) =>
    request<import('../types').Catalog>('/api/admin/edition', {
      method: 'PUT',
      body: JSON.stringify({ editionLabel }),
    }),
  resetSeed: () =>
    request<import('../types').Catalog>('/api/admin/reset-seed', {
      method: 'POST',
    }),
};
