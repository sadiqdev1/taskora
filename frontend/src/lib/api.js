/**
 * Base API utility — communicates with the Laravel Sanctum backend.
 * Token is stored in localStorage as 'taskora_token' and sent as Bearer.
 */

import { getToken } from './auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Core fetch wrapper — handles JSON, auth headers, and errors.
 */
export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      // Don't set Content-Type for FormData — browser sets it with boundary automatically
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    // Laravel validation errors come back as { errors: { field: [msg] } }
    if (err.errors) {
      const first = Object.values(err.errors)[0];
      throw new Error(Array.isArray(first) ? first[0] : String(first));
    }
    throw new Error(err.message || 'Request failed');
  }

  if (res.status === 204) return null;
  return res.json();
}

export const apiGet  = (ep, opts = {})       => apiFetch(ep, { method: 'GET', ...opts });
export const apiPost = (ep, body, opts = {}) => apiFetch(ep, { method: 'POST',   body: JSON.stringify(body), ...opts });
export const apiPut  = (ep, body, opts = {}) => apiFetch(ep, { method: 'PUT',    body: JSON.stringify(body), ...opts });
export const apiPatch= (ep, body, opts = {}) => apiFetch(ep, { method: 'PATCH',  body: JSON.stringify(body), ...opts });
export const apiDel  = (ep, opts = {})       => apiFetch(ep, { method: 'DELETE', ...opts });
