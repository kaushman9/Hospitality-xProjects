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
  var cell4 = newRow.insertCell();
  var cell5 = newRow.insertCell();

  // Generate a unique ID for the authorization
  var id = generateID();
  
  // Get the current date and time
  var date = new Date();
  var dateString = formatDate(date);

  // Add input values to cells
  cell1.innerHTML = id;
  cell2.innerHTML = fname;
  cell3.innerHTML = lname;
  cell4.innerHTML = 'Waiting to open'; // initial status
  cell5.innerHTML = dateString;

  // Add hover and click functionality to the row
  newRow.classList.add('table-row-hover');
  newRow.addEventListener('click', function () {
    openUserForm(fname, lname);
  });

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
        id: id,
        firstName: fname,
        lastName: lname,
        address: '', // Add address field value if needed
        confirmationNumber: '', // Add confirmation number field value if needed
        billingInfo: '', // Add billing info field value if needed
        status: 'Waiting to open', // initial status
        dateCreated: date.toISOString(), // date created
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

// Function to generate a unique ID for the authorization
function generateID() {
  // Generate a random 8-digit ID
  var id = Math.floor(100000 + Math.random() * 900000);

  // Check if the ID is unique
  // TODO: Implement your logic to ensure ID uniqueness

  return id;
}

// Function to format the date in the desired format
function formatDate(date) {
  var options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // Use 12-hour format
    timeZone: 'UTC'
  };

  // Format the date with date and time
  var formattedDate = date.toLocaleString('en-US', options);

  return formattedDate;
}
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
                const cell4 = newRow.insertCell();
                const cell5 = newRow.insertCell();

                cell1.innerHTML = form.id;
                cell2.innerHTML = form.first_name;
                cell3.innerHTML = form.last_name;
                cell4.innerHTML = form.status;
                cell5.innerHTML = form.date_created;

                // Add hover and click functionality to the row
                newRow.classList.add('table-row-hover');
                newRow.addEventListener('click', function () {
                  openUserForm(form.first_name, form.last_name);
                });
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

// Filter buttons
const filterButtons = document.querySelectorAll('.filter-button');

filterButtons.forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    // Remove active class from all buttons
    filterButtons.forEach((button) => {
      button.classList.remove('active');
    });

    // Add active class to the clicked button
    filterButton.classList.add('active');

    // Get the filter value
    const filterValue = filterButton.dataset.filter;

    // Filter the table rows based on the selected filter
    filterTableRows(filterValue);
  });
});

// Function to filter the table rows based on the selected filter
function filterTableRows(filterValue) {
  const rows = document.querySelectorAll('#formTable tbody tr');

  rows.forEach((row) => {
    const statusCell = row.querySelector('td:nth-child(4)');
    const status = statusCell.innerText.toLowerCase();

    if (filterValue === 'all' || status === filterValue) {
      row.style.display = 'table-row';
    } else {
      row.style.display = 'none';
    }
  });
}

// Function to open the user form modal and display the user info
function openUserForm(firstName, lastName) {
  const userFormModal = document.getElementById('userFormModal');
  const userFormInfo = document.getElementById('userFormInfo');
  const creditCardInfo = document.getElementById('creditCardInfo');

  // Clear previous content
  userFormInfo.innerHTML = '';
  creditCardInfo.innerHTML = '';

  // Show the user form modal
  userFormModal.style.display = 'block';

  // Create and display the user info
  const userInfoHeading = document.createElement('h2');
  userInfoHeading.textContent = 'User Information';

  const firstNamePara = document.createElement('p');
  firstNamePara.innerHTML = `<strong>First Name:</strong> ${firstName}`;

  const lastNamePara = document.createElement('p');
  lastNamePara.innerHTML = `<strong>Last Name:</strong> ${lastName}`;

  userFormInfo.appendChild(userInfoHeading);
  userFormInfo.appendChild(firstNamePara);
  userFormInfo.appendChild(lastNamePara);

  // Create and display the credit card info
  const creditCardHeading = document.createElement('h2');
  creditCardHeading.textContent = 'Credit Card Information';

  const cardNumberPara = document.createElement('p');
  cardNumberPara.innerHTML = '<strong>Card Number:</strong> ************1234';

  const expiryDatePara = document.createElement('p');
  expiryDatePara.innerHTML = '<strong>Expiry Date:</strong> 12/25';

  creditCardInfo.appendChild(creditCardHeading);
  creditCardInfo.appendChild(cardNumberPara);
  creditCardInfo.appendChild(expiryDatePara);
}

// Close the user form modal when the user clicks on <span> (x)
document.querySelector('#userFormModal .close').onclick = function () {
  document.getElementById('userFormModal').style.display = 'none';
}

// Call the fetchForms function when the page loads
window.addEventListener('load', fetchForms);
