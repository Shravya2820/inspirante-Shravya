const API_BASE_URL = 'http://localhost:3000/api';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = { message: 'The server returned an unreadable response.' };
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }

  return data;
}

export function getEvents() {
  return apiRequest('/events');
}

export function createEvent(event) {
  return apiRequest('/events', {
    method: 'POST',
    body: JSON.stringify(event)
  });
}

export function getEventRegistrations(eventId) {
  return apiRequest(`/events/${eventId}/registrations`);
}
