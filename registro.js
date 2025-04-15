// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', () => {
  // Get the registration form element
  const registrationForm = document.getElementById('registration-form');

  // Check if the registration form exists on the page
  if (registrationForm) {
    // Add an event listener for the form submission
    registrationForm.addEventListener('submit', function (event) {
      // Prevent the default form submission behavior
      event.preventDefault();

      // Get the values from the form inputs
      const name = this.name.value.trim();
      const email = this.email.value.trim();
      const username = this.username.value.trim();
      const password = this.password.value.trim();
      const confirmPassword = this['confirm-password'].value.trim();

      // Check if any of the required fields are empty
      if (name === '' || email === '' || username === '' || password === '' || confirmPassword === '') {
        alert('Please fill in all fields.');
        return;
      }

      // Validate the email format using a regular expression
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Check if the password and confirm password fields match
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      // Check if the password length is less than 8 characters
      if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
      }

      // Check if the password contains at least one letter and one number
      if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
        alert('Password must contain at least one letter and one number.');
        return;
      }

      // Prepare the data to be sent to the server
      const userData = {
        name: name,
        email: email,
        username: username,
        password: password
      };

      // Send a POST request to the server to register the user
      fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then(response => {
          // Check if the response from the server is successful
          if (!response.ok) {
            // If not successful, throw an error with a custom message
            throw new Error('Error registering user');
          }
          // Parse the JSON response from the server
          return response.json();
        })
        .then(data => {
          // If registration is successful, display a success message
          alert('Successful registration. Welcome!');
          // Reset the form to clear the input fields
          registrationForm.reset();
          // You might want to redirect the user to another page here
          // window.location.href = '/some-other-page.html';
        })
        .catch(error => {
          // If an error occurs during the registration process, display an error message
          alert('Error: ' + error.message);
        });
    });
  }
});