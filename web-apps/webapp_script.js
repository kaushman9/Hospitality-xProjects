// Get the tab elements
const tabs = document.querySelectorAll('.tab');

// Get the navigation buttons
const buttons = document.querySelectorAll('.ribbon a');

// Show the default tab (Dashboard)
tabs[0].style.display = 'block';

// Add event listeners to the buttons
buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    // Hide all tabs
    tabs.forEach(tab => {
      tab.style.display = 'none';
    });

    // Show the selected tab
    tabs[index].style.display = 'block';

    // Set the active class to the selected button
    buttons.forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
  });
});

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("createBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// Get the form
var form = document.getElementById('customerForm');

// Listen for form submit event
form.addEventListener('submit', async function (event) {
  // Prevent form from submitting and causing page refresh
  event.preventDefault();

  // Get input values
  var fname = document.getElementById('fname').value;
  var lname = document.getElementById('lname').value;

  // Get the form status table
  var formTable = document.getElementById('formTable');

  // Create a new row
  var newRow = formTable.insertRow();

  // Insert new cells
  var cell1 = newRow.insertCell();
  var cell2 = newRow.insertCell();
  var cell3 = newRow.insertCell();

  // Add input values to cells
  cell1.innerHTML = fname;
  cell2.innerHTML = lname;
  cell3.innerHTML = 'Waiting to open'; // initial status

  // Clear the form inputs
  form.reset();

  // Close the modal
  modal.style.display = 'none';

  try {
    // Get the current user ID
    const userId = await getCurrentUserId();

    // Send form data to the server
    const response = await fetch('/createForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: fname,
        lastName: lname,
        address: '', // Add address field value if needed
        confirmationNumber: '', // Add confirmation number field value if needed
        billingInfo: '', // Add billing info field value if needed
        status: 'Waiting to open', // initial status
        userId: userId, // Pass the user ID to the server
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Form creation successful
      console.log('Form created:', data.form);
    } else {
      // Form creation failed
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// Function to get the current user ID from the session
function getCurrentUserId() {
  return fetch('/currentUserId')
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        return data.userId;
      } else {
        console.error('Error:', data.message);
        return null;
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      return null;
    });
}

// Fetch forms for the logged-in user and populate the table
function fetchForms() {
    getCurrentUserId()
      .then((userId) => {
        if (userId) {
          return fetch('/forms')
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                const forms = data.forms;
  
                // Get the form status table
                const formTable = document.getElementById('formTable');
  
                // Clear existing table rows
                formTable.innerHTML = '';
  
                // Loop through forms and populate the table rows
                forms.forEach((form) => {
                  const newRow = formTable.insertRow();
                  const cell1 = newRow.insertCell();
                  const cell2 = newRow.insertCell();
                  const cell3 = newRow.insertCell();
  
                  cell1.innerHTML = form.first_name;
                  cell2.innerHTML = form.last_name;
                  cell3.innerHTML = form.status;
                });
              } else {
                console.error('Error:', data.message);
              }
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  

// Sign out button
document.getElementById('signOutButton').addEventListener('click', function () {
  window.location.href = "../index.html";
});


// Call the fetchForms function when the page loads
window.addEventListener('load', fetchForms);