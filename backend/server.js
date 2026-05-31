const express = require('express');
const session = require('express-session');
const cors = require('cors');
const db = require('./db');        
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));