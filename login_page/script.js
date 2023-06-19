// JavaScript code for user authentication
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  // Retrieve user input
  var email = document.getElementById('login-email').value;
  var password = document.getElementById('login-password').value;
  // Perform login authentication
  login(email, password);
});

document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault();
  // Retrieve user input
  var firstName = document.getElementById('signup-firstname').value;
  var lastName = document.getElementById('signup-lastname').value;
  var email = document.getElementById('signup-email').value;
  var password = document.getElementById('signup-password').value;
  // Perform user registration
  register(firstName, lastName, email, password);
});

document.getElementById('forgot-password-form').addEventListener('submit', function(event) {
  event.preventDefault();
  // Retrieve user input
  var email = document.getElementById('forgot-password-email').value;
  // Perform forgot password operation
  forgotPassword(email);
});

function login(email, password) {
  // Perform login authentication using AJAX or fetch API
  // Make a POST request to your server-side endpoint to validate the credentials
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, password: password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Redirect to the authenticated user dashboard
        window.location.href = data.redirectUrl;
      } else {
        // Show error message on login failure
        alert('Invalid email or password');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function register(firstName, lastName, email, password) {
  // Perform user registration using AJAX or fetch API
  // Make a POST request to your server-side endpoint to store the user data in the database
  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ firstName: firstName, lastName: lastName, email: email, password: password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Redirect to the login page after successful registration
        window.location.href = data.redirectUrl;
      } else {
        // Show error message on registration failure
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function forgotPassword(email) {
  // Perform forgot password operation using AJAX or fetch API
  // Make a POST request to your server-side endpoint to initiate the password reset process
  fetch('/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Show success message for password reset request
        alert(data.message);
      } else {
        // Show error message on password reset request failure
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
