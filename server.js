const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const session = require('express-session');
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const crypto = require('crypto');


// Generate session secret
const generateSessionSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

const sessionSecret = generateSessionSecret();
// Log the session secret to the console
console.log('Session Secret:', sessionSecret);

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '.')));

// Middleware to parse request body as JSON
app.use(bodyParser.json());

// Middleware for session management
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

// Enable CORS for all routes
app.use(cors());

// Database configuration
const dbConfig = {
  user: 'saas1',
  host: 'cluster2.postgres.database.azure.com',
  database: 'postgres',
  password: 'Kaushal12530!',
  port: 5432,
  ssl: true,
};

// Initialize pg-promise
const db = pgp(dbConfig);

// Endpoint for user login
app.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  // Perform login authentication
  db.oneOrNone('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
    .then((user) => {
      if (user && user.password === password) {
        // Store user ID and email in session
        req.session.userId = user.user_id;
        req.session.userEmail = user.email;

        // User authentication successful
        res.json({
          success: true,
          message: 'Login successful',
          user: user,
          userId: user.user_id,
          redirectUrl: '/web-apps/cc-authorization/index.html',
        });
      } else {
        // User authentication failed
        res.json({ success: false, message: 'Invalid email or password' });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      next(error);
    });
});

// Endpoint for user registration
app.post('/register', (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if user with the given email already exists
  db.oneOrNone('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
    .then((existingUser) => {
      if (existingUser) {
        // User already exists
        res.json({ success: false, message: 'User with this email already exists' });
      } else {
        // Perform user registration
        db.one('INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *', [firstName, lastName, email.toLowerCase(), password])
          .then((newUser) => {
            // User registration successful
            res.json({ success: true, message: 'Registration successful', user: newUser });
          })
          .catch((error) => {
            console.error('Error:', error);
            next(error);
          });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      next(error);
    });
});

// Endpoint to get the current user ID
app.get('/currentUserId', (req, res) => {
  const userId = req.session.userId;
  res.json({ success: true, userId: userId });
});

// Endpoint to create a form
app.post('/createForm', async (req, res, next) => {
  const { firstName, lastName, address, confirmationNumber, billingInfo, status } = req.body;
  const userEmail = req.session.userEmail; // Retrieve the user email from the session

  try {
    // Retrieve the user ID based on the user's email
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [userEmail.toLowerCase()]);
    if (!user) {
      res.json({ success: false, message: 'User not found' });
      return;
    }

    const userId = user.user_id;

    // Insert the form into the forms table with the retrieved user ID
    const newForm = await db.one('INSERT INTO forms (user_id, first_name, last_name, address, confirmation_number, billing_information, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [userId, firstName, lastName, address, confirmationNumber, billingInfo, status]);

    res.json({ success: true, message: 'Form creation successful', form: newForm });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'An error occurred while creating the form', error: error.message });
  }
});

// Endpoint for getting forms
app.get('/forms', (req, res, next) => {
  const userId = req.session.userId;

  db.any('SELECT * FROM forms WHERE user_id = $1', [userId])
    .then((forms) => {
      res.json({ success: true, forms: forms });
    })
    .catch((error) => {
      console.error('Error:', error);
      next(error);
    });
});

// Serve the index.html file
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'Login Page', 'web-apps', 'cc-authorization', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'An error occurred on the server', error: err.message });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
