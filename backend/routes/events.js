const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireLogin, requireAdmin } = require('../middleware/auth');

function isValidEventDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

// GET /api/events - get all events with registration count
router.get('/', requireLogin, (req, res) => {
  const query = `
    SELECT 
      e.id,
      e.name,
      e.date,
      e.venue,
      e.capacity,
      COUNT(r.id) AS registered
    FROM events e
    LEFT JOIN registrations r ON e.id = r.event_id
    GROUP BY e.id
    ORDER BY e.date ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }
    return res.status(200).json({ events: results });
  });
});

// POST /api/events - admin creates a new event
router.post('/', requireAdmin, (req, res) => {
  const { name, date, venue, capacity } = req.body;
  const parsedCapacity = Number(capacity);

  if (!name || !date || !venue || !capacity) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!isValidEventDate(date)) {
    return res.status(400).json({ message: 'Date must be in YYYY-MM-DD format.' });
  }

  if (!Number.isInteger(parsedCapacity) || parsedCapacity <= 0) {
    return res.status(400).json({ message: 'Capacity must be a positive whole number.' });
  }

  const query = 'INSERT INTO events (name, date, venue, capacity) VALUES (?, ?, ?, ?)';
  db.query(query, [name.trim(), date, venue.trim(), parsedCapacity], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'An event with this name and date already exists.' });
      }
      return res.status(500).json({ message: 'Database error.' });
    }
    return res.status(201).json({
      message: 'Event created successfully.',
      eventId: result.insertId
    });
  });
});

// GET /api/events/:id/registrations - admin views registrations for an event
router.get('/:id/registrations', requireAdmin, (req, res) => {
  const eventId = req.params.id;

  const query = `
    SELECT 
      u.name,
      u.username,
      r.registered_at
    FROM registrations r
    JOIN users u ON r.student_id = u.id
    WHERE r.event_id = ?
    ORDER BY r.registered_at ASC
  `;

  db.query(query, [eventId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }
    return res.status(200).json({ registrations: results });
  });
});

module.exports = router;
