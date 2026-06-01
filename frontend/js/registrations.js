import { apiRequest } from './events.js';

export function registerForEvent(eventId) {
  return apiRequest('/registrations', {
    method: 'POST',
    body: JSON.stringify({ event_id: eventId })
  });
}

export function getMyRegistrations() {
  return apiRequest('/registrations/mine');
}
