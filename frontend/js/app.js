import { getCurrentUser, login, logout } from './auth.js';
import { createEvent, getEventRegistrations, getEvents } from './events.js';
import { getMyRegistrations, registerForEvent } from './registrations.js';

const app = document.querySelector('#app');

const state = {
  user: null,
  events: [],
  myRegistrations: [],
  selectedEvent: null,
  selectedRegistrations: [],
  message: '',
  error: ''
};

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
}

function fillPercent(event) {
  if (!event.capacity) {
    return 0;
  }
  return Math.round((Number(event.registered) / Number(event.capacity)) * 100);
}

function fillClass(percent) {
  if (percent >= 80) {
    return 'danger';
  }
  if (percent >= 50) {
    return 'warning';
  }
  return 'success';
}

function setMessage(message) {
  state.message = message;
  state.error = '';
}

function setError(error) {
  state.error = error;
  state.message = '';
}

async function loadEvents() {
  const data = await getEvents();
  state.events = data.events || [];
}

async function loadStudentData() {
  await loadEvents();
  const data = await getMyRegistrations();
  state.myRegistrations = data.registrations || [];
}

function registrationIds() {
  return new Set(state.myRegistrations.map((registration) => Number(registration.id)));
}

function renderShell(content) {
  const userPanel = state.user
    ? `
      <div class="user-panel">
        <div>
          <span class="eyebrow">${state.user.role}</span>
          <strong>${state.user.name}</strong>
        </div>
        <button id="logoutButton" class="secondary-button" type="button">Log out</button>
      </div>
    `
    : '';

  app.innerHTML = `
    <section class="topbar">
      <div>
        <span class="eyebrow">College Portal</span>
        <h1>Event Registration</h1>
      </div>
      ${userPanel}
    </section>
    ${state.error ? `<p class="alert error">${state.error}</p>` : ''}
    ${state.message ? `<p class="alert success">${state.message}</p>` : ''}
    ${content}
  `;

  const logoutButton = document.querySelector('#logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
}

function renderLogin() {
  renderShell(`
    <section class="login-panel">
      <form id="loginForm" class="form-card">
        <h2>Sign in</h2>
        <label>
          Username
          <input name="username" autocomplete="username" required>
        </label>
        <label>
          Password
          <input name="password" type="password" autocomplete="current-password" required>
        </label>
        <button type="submit">Log in</button>
      </form>
    </section>
  `);

  document.querySelector('#loginForm').addEventListener('submit', handleLogin);
}

function renderAdmin() {
  const rows = state.events.map((event) => {
    const percent = fillPercent(event);
    return `
      <tr>
        <td>
          <strong>${event.name}</strong>
          <span>${formatDate(event.date)} · ${event.venue}</span>
        </td>
        <td>${event.registered} / ${event.capacity}</td>
        <td>
          <div class="meter">
            <span class="${fillClass(percent)}" style="width: ${Math.min(percent, 100)}%"></span>
          </div>
          <small class="${fillClass(percent)}-text">${percent}% filled</small>
        </td>
        <td>
          <button class="secondary-button view-registrations" data-event-id="${event.id}" type="button">
            View
          </button>
        </td>
      </tr>
    `;
  }).join('');

  const selected = state.selectedEvent
    ? `
      <section class="content-section">
        <h2>Registrations for ${state.selectedEvent.name}</h2>
        ${state.selectedRegistrations.length
          ? `
            <div class="list">
              ${state.selectedRegistrations.map((registration) => `
                <article class="list-item">
                  <strong>${registration.name}</strong>
                  <span>${registration.username} · ${formatDate(registration.registered_at)}</span>
                </article>
              `).join('')}
            </div>
          `
          : '<p class="empty">No students have registered for this event yet.</p>'}
      </section>
    `
    : '';

  renderShell(`
    <section class="dashboard-grid">
      <form id="createEventForm" class="form-card">
        <h2>Create event</h2>
        <label>
          Event name
          <input name="name" required>
        </label>
        <label>
          Date
          <input name="date" type="date" required>
        </label>
        <label>
          Venue
          <input name="venue" required>
        </label>
        <label>
          Capacity
          <input name="capacity" type="number" min="1" required>
        </label>
        <button type="submit">Create event</button>
      </form>
      <section class="content-section">
        <h2>All events</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Registered</th>
                <th>Capacity</th>
                <th>Registrations</th>
              </tr>
            </thead>
            <tbody>${rows || '<tr><td colspan="4">No events yet.</td></tr>'}</tbody>
          </table>
        </div>
      </section>
    </section>
    ${selected}
  `);

  document.querySelector('#createEventForm').addEventListener('submit', handleCreateEvent);
  document.querySelectorAll('.view-registrations').forEach((button) => {
    button.addEventListener('click', () => handleViewRegistrations(button.dataset.eventId));
  });
}

function renderStudent() {
  const registeredIds = registrationIds();
  const eventCards = state.events.map((event) => {
    const isFull = Number(event.registered) >= Number(event.capacity);
    const isRegistered = registeredIds.has(Number(event.id));
    return `
      <article class="event-card">
        <div>
          <span class="eyebrow">${formatDate(event.date)}</span>
          <h2>${event.name}</h2>
          <p>${event.venue}</p>
          <p>${event.registered} of ${event.capacity} seats filled</p>
        </div>
        <div class="card-actions">
          ${isFull ? '<span class="status full">Full</span>' : ''}
          ${isRegistered ? '<span class="status registered">Registered</span>' : ''}
          <button class="register-button" data-event-id="${event.id}" type="button" ${isFull ? 'disabled' : ''}>
            ${isRegistered ? 'Register' : 'Register'}
          </button>
        </div>
      </article>
    `;
  }).join('');

  const myRows = state.myRegistrations.map((registration) => `
    <article class="list-item">
      <strong>${registration.name}</strong>
      <span>${formatDate(registration.date)} · ${registration.venue}</span>
    </article>
  `).join('');

  renderShell(`
    <section class="student-grid">
      <section class="content-section">
        <h2>Upcoming events</h2>
        <div class="cards">${eventCards || '<p class="empty">No upcoming events are available.</p>'}</div>
      </section>
      <section class="content-section">
        <h2>My registrations</h2>
        <div class="list">${myRows || '<p class="empty">You have not registered for any events yet.</p>'}</div>
      </section>
    </section>
  `);

  document.querySelectorAll('.register-button').forEach((button) => {
    button.addEventListener('click', () => handleRegister(button.dataset.eventId));
  });
}

function App() {
  if (!state.user) {
    renderLogin();
  } else if (state.user.role === 'admin') {
    renderAdmin();
  } else {
    renderStudent();
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const form = new FormData(event.target);

  try {
    const data = await login(form.get('username').trim(), form.get('password'));
    state.user = data.user;
    setMessage(`Welcome, ${state.user.name}.`);
    if (state.user.role === 'admin') {
      await loadEvents();
    } else {
      await loadStudentData();
    }
  } catch (error) {
    setError(error.message);
  }

  App();
}

async function handleLogout() {
  try {
    await logout();
  } catch (error) {
    setError(error.message);
  }

  state.user = null;
  state.events = [];
  state.myRegistrations = [];
  state.selectedEvent = null;
  state.selectedRegistrations = [];
  App();
}

async function handleCreateEvent(event) {
  event.preventDefault();
  const form = new FormData(event.target);

  try {
    await createEvent({
      name: form.get('name'),
      date: form.get('date'),
      venue: form.get('venue'),
      capacity: form.get('capacity')
    });
    setMessage('Event created successfully.');
    state.selectedEvent = null;
    state.selectedRegistrations = [];
    await loadEvents();
  } catch (error) {
    setError(error.message);
  }

  App();
}

async function handleViewRegistrations(eventId) {
  try {
    const event = state.events.find((item) => Number(item.id) === Number(eventId));
    const data = await getEventRegistrations(eventId);
    state.selectedEvent = event;
    state.selectedRegistrations = data.registrations || [];
    setMessage(`Loaded registrations for ${event.name}.`);
  } catch (error) {
    setError(error.message);
  }

  App();
}

async function handleRegister(eventId) {
  try {
    await registerForEvent(eventId);
    setMessage('Registration successful.');
    await loadStudentData();
  } catch (error) {
    setError(error.message);
  }

  App();
}

async function init() {
  try {
    const data = await getCurrentUser();
    state.user = data.user;
    if (state.user.role === 'admin') {
      await loadEvents();
    } else {
      await loadStudentData();
    }
  } catch (error) {
    state.user = null;
    if (error.message !== 'Not logged in.') {
      setError(error.message);
    }
  }

  App();
}

init();
