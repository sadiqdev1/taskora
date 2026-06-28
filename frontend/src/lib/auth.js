/**
 * Auth helpers — thin wrappers around apiFetch.
 * Token is stored in localStorage under 'taskora_token'.
 */

import { apiFetch } from './api';

const TOKEN_KEY = 'taskora_token';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register({ name, email, password, password_confirmation }) {
  const data = await apiFetch('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });
  setToken(data.token);
  return data.user;
}

export async function login({ email, password }) {
  const data = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.user;
}

export async function logout() {
  try {
    await apiFetch('/logout', {
      method: 'POST',
      headers: authHeaders(),
    });
  } finally {
    clearToken();
  }
}

export async function getUser() {
  const token = getToken();
  if (!token) return null;
  try {
    return await apiFetch('/me', { headers: authHeaders() });
  } catch {
    clearToken();
    return null;
  }
}
