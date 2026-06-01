const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireLogin } = require('../middleware/auth');

// POST /api/registrations - student registers for an event
router.post('/', requireLogin, (req, res) => {
  const { event_id } = req.body;
  const student_id = req.session.user.id;
  const parsedEventId = Number(event_id);

  if (req.session.user.role === 'admin') {
    return res.status(403).json({ message: 'Admins cannot register for events.' });
  }

  if (!Number.isInteger(parsedEventId) || parsedEventId <= 0) {
    return res.status(400).json({ message: 'Event ID is required.' });
  }

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

  db.query(eventQuery, [parsedEventId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const event = results[0];

    // Check if full
    if (event.registered >= event.capacity) {
      return res.status(400).json({ message: 'Event is full.' });
    }

    // Check duplicate registration
    const dupQuery = 'SELECT * FROM registrations WHERE student_id = ? AND event_id = ?';
    db.query(dupQuery, [student_id, parsedEventId], (err, dupResults) => {
      if (err) {
        return res.status(500).json({ message: 'Database error.' });
      }
      if (dupResults.length > 0) {
        return res.status(400).json({ message: 'You have already registered for this event.' });
      }

      // All good — register
      const insertQuery = 'INSERT INTO registrations (student_id, event_id) VALUES (?, ?)';
      db.query(insertQuery, [student_id, parsedEventId], (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'You have already registered for this event.' });
          }
          return res.status(500).json({ message: 'Database error.' });
        }
        return res.status(201).json({ message: 'Registered successfully.' });
      });
    });
  });
});

// GET /api/registrations/mine - student views their own registrations
router.get('/mine', requireLogin, (req, res) => {
  const student_id = req.session.user.id;

  if (req.session.user.role === 'admin') {
    return res.status(403).json({ message: 'Admins do not have registrations.' });
  }

  const query = `
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
  `;

  db.query(query, [student_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }
    return res.status(200).json({ registrations: results });
  });
});

module.exports = router;
