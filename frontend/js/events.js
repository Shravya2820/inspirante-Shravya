const API_BASE_URL = `http://${window.location.hostname}:3000/api`;

export async function apiRequest(path, options = {}) {
  try {
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
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Unable to reach the server. Please check that the backend is running.');
    }
    throw error;
  }
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
