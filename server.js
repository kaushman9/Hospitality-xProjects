const express = require('express');
const app = express();
const path = require('path');

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '.')));

// Middleware to parse request body as JSON
app.use(express.json());

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'saas_db',
  user: 'postgres',
  password: 'Kaushal12530!'
};

// Initialize pg-promise
const pgp = require('pg-promise')();
const db = pgp(dbConfig);

// Endpoint for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Perform login authentication
  db.oneOrNone('SELECT * FROM users WHERE email = $1', [email])
    .then(user => {
      if (user && user.password === password) {
        // User authentication successful
        res.json({ success: true, message: 'Login successful', user: user, redirectUrl: '/web-apps/cc-authorization/index.html' });
      } else {
        // User authentication failed
        res.json({ success: false, message: 'Invalid email or password' });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    });
});

// Endpoint for user registration
app.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if user with the given email already exists
  db.oneOrNone('SELECT * FROM users WHERE email = $1', [email])
    .then(existingUser => {
      if (existingUser) {
        // User already exists
        res.json({ success: false, message: 'User with this email already exists' });
      } else {
        // Perform user registration
        db.one('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [firstName, lastName, email, password])
          .then(newUser => {
            // User registration successful
            res.json({ success: true, message: 'Registration successful', user: newUser });
          })
          .catch(error => {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'An error occurred' });
          });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'An error occurred' });
    });
});

// Serve the index.html file
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'Login Page', 'web-apps', 'cc-authorization', 'index.html'));
});

// Start the server
app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running on http://localhost:5000');
});
