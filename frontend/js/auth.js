import { apiRequest } from './events.js';

export function login(username, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

export function logout() {
  return apiRequest('/auth/logout', { method: 'POST' });
}

export function getCurrentUser() {
  return apiRequest('/auth/me');
}
