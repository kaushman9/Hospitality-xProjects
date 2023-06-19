document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  // Retrieve user input
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  // Perform user login
  login(email, password);
});

function login(email, password) {
  // Perform user login using AJAX or fetch API
  // Make a POST request to your server-side endpoint for login authentication
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
        // Save user ID in localStorage
        localStorage.setItem('userId', data.userId);
        // Redirect to the desired page after successful login
        window.location.href = '../web-apps/webapp_index.html'; 
      } else {
        // Show error message on login failure
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
