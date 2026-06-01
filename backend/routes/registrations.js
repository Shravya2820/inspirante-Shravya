const express = require('express');
const router = express.Router();
const db = require('../db');
const { promisify } = require('util');
const { requireLogin } = require('../middleware/auth');

const query = promisify(db.query).bind(db);

// POST /api/registrations - student registers for an event
router.post('/', requireLogin, async (req, res) => {
  const { event_id } = req.body;
  const student_id = req.session.user.id;
  const parsedEventId = Number(event_id);

  if (req.session.user.role === 'admin') {
    return res.status(403).json({ message: 'Admins cannot register for events.' });
  }

  if (!Number.isInteger(parsedEventId) || parsedEventId <= 0) {
    return res.status(400).json({ message: 'Event ID is required.' });
  }

  try {
    // Check event exists and get capacity
    const eventQuery = `
      SELECT 
        e.capacity,
        COUNT(r.id) AS registered
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.id = ?
      GROUP BY e.id
    `;
    const events = await query(eventQuery, [parsedEventId]);

    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const event = events[0];

    // Check if full
    if (event.registered >= event.capacity) {
      return res.status(400).json({ message: 'Event is full.' });
    }

    // Check duplicate registration
    const dupResults = await query(
      'SELECT id FROM registrations WHERE student_id = ? AND event_id = ?',
      [student_id, parsedEventId]
    );

    if (dupResults.length > 0) {
      return res.status(400).json({ message: 'You have already registered for this event.' });
    }

    // All good — register
    await query(
      'INSERT INTO registrations (student_id, event_id) VALUES (?, ?)',
      [student_id, parsedEventId]
    );

    return res.status(201).json({ message: 'Registered successfully.' });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'You have already registered for this event.' });
    }
    return res.status(500).json({ message: 'Database error.' });
  }
});

// GET /api/registrations/mine - student views their own registrations
router.get('/mine', requireLogin, async (req, res) => {
  const student_id = req.session.user.id;

  if (req.session.user.role === 'admin') {
    return res.status(403).json({ message: 'Admins do not have registrations.' });
  }

  try {
    const results = await query(`
      SELECT 
        e.id,
        e.name,
        e.date,
        e.venue,
        r.registered_at
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      WHERE r.student_id = ?
      ORDER BY e.date ASC
    `, [student_id]);

    return res.status(200).json({ registrations: results });

  } catch (err) {
    return res.status(500).json({ message: 'Database error.' });
  }
});

module.exports = router;