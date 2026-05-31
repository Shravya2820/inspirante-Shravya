const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireLogin, requireAdmin } = require('../middleware/auth');

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

  if (!name || !date || !venue || !capacity) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = 'INSERT INTO events (name, date, venue, capacity) VALUES (?, ?, ?, ?)';
  db.query(query, [name, date, venue, capacity], (err, result) => {
    if (err) {
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