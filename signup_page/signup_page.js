document.getElementById("google-signup-btn").addEventListener("click", function() {
  // Handle Google signup integration
  // Add the necessary code to initiate Google sign up process
});

document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault();
  // Retrieve user input
  var firstName = document.getElementById('first-name').value;
  var lastName = document.getElementById('last-name').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  // Perform user registration
  register(firstName, lastName, email, password);
});

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
        window.location.href = '../web-apps/webapp_index.html';
      } else {
        // Show error message on registration failure
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
