var stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx'); // Use your test API key here
var elements = stripe.elements();

// Create an instance of the card Element
var card = elements.create('card');

// Add an instance of the card Element into the `card-element` <div>
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission
var form = document.getElementById('payment-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Add additional card details to token
      result.token.name = document.getElementById('name').value;
      result.token.email = document.getElementById('email').value;
      result.token.address_line1 = document.getElementById('address').value;
      result.token.address_city = document.getElementById('city').value;
      result.token.address_state = document.getElementById('state').value;
      result.token.billing_address = document.getElementById('billing-address').value;
      result.token.billing_city = document.getElementById('billing-city').value;
      result.token.billing_state = document.getElementById('billing-state').value;

      // Send the token to your server
      stripeTokenHandler(result.token);
    }
  });
});

// Submit the form with the token ID
function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  // Submit the form
  form.submit();
}
