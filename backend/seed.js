const db = require('./db');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

const users = [
  { name: 'Admin', username: 'admin', password: 'inspirante2026', role: 'admin' },
  { name: 'Asha Rao', username: 'asha.rao', password: 'student123', role: 'student' },
  { name: 'Ravi Shetty', username: 'ravi.shetty', password: 'student123', role: 'student' },
  { name: 'Meera Nair', username: 'meera.nair', password: 'student123', role: 'student' },
  { name: 'Kiran Bhat', username: 'kiran.bhat', password: 'student123', role: 'student' },
  { name: 'Divya Kamath', username: 'divya.kamath', password: 'student123', role: 'student' },
  { name: 'Suresh Pai', username: 'suresh.pai', password: 'student123', role: 'student' },
  { name: 'Ananya Hegde', username: 'ananya.hegde', password: 'student123', role: 'student' },
  { name: 'Rohan Shenoy', username: 'rohan.shenoy', password: 'student123', role: 'student' },
  { name: 'Nisha Prabhu', username: 'nisha.prabhu', password: 'student123', role: 'student' },
  { name: 'Tejas Mallya', username: 'tejas.mallya', password: 'student123', role: 'student' },
  { name: 'Priya Bangera', username: 'priya.bangera', password: 'student123', role: 'student' },
];

const events = [
  { name: 'Tech Symposium 2026', date: '2026-07-10', venue: 'Main Auditorium', capacity: 120 },
  { name: 'Hackathon', date: '2026-07-15', venue: 'Lab Block C', capacity: 40 },
  { name: 'Cultural Fest', date: '2026-07-20', venue: 'Open Amphitheatre', capacity: 300 },
  { name: 'Workshop: React Basics', date: '2026-07-22', venue: 'Seminar Hall 2', capacity: 30 },
  { name: 'Placement Prep Talk', date: '2026-07-25', venue: 'Main Auditorium', capacity: 200 },
];

async function seed() {
  try {
    await query('SET FOREIGN_KEY_CHECKS = 0');
    await query('TRUNCATE TABLE registrations');
    await query('TRUNCATE TABLE events');
    await query('TRUNCATE TABLE users');
    await query('SET FOREIGN_KEY_CHECKS = 1');

    for (const user of users) {
      await query(
        'INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)',
        [user.name, user.username, user.password, user.role]
      );
    }

    for (const event of events) {
      await query(
        'INSERT INTO events (name, date, venue, capacity) VALUES (?, ?, ?, ?)',
        [event.name, event.date, event.venue, event.capacity]
      );
    }

    console.log('Database reset and seeded');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    db.end();
  }
}

seed();
