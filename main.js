document.addEventListener('DOMContentLoaded', () => {
    // Selects the main container once.
    const mainContainer = document.querySelector('.container');

    // Function to get the animation duration from CSS.
    const getAnimationDuration = (element) => {
        const style = window.getComputedStyle(element);
        const duration = style.getPropertyValue('transition-duration') || '0s';
        // Converts to milliseconds.
        return parseFloat(duration) * 1000;
    };

    // Applies the initial fade-in animation.
    if (mainContainer) {
        mainContainer.classList.add('page-fade-in');
    }

    // Adds animation to links.
    const links = document.querySelectorAll('.animated-link');
    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetUrl = this.getAttribute('href');

            // Applies the fade-out animation.
            mainContainer.classList.add('page-fade-out');

            // Waits for the animation to complete before navigating.
            const animationDuration = getAnimationDuration(mainContainer);
            setTimeout(() => {
                window.location.href = targetUrl;
            }, animationDuration);
        });
    });

    // Form validation for login.
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = this.username.value;
            const password = this.password.value;

            // Check if username or password fields are empty.
            if (username.trim() === '' || password.trim() === '') {
                alert('Please fill in all fields.');
                return;
            }
            // Basic email validation.
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(username)) {
                alert('Please enter a valid email address.');
                return;
            }

            // TODO: Add more validation or submit the form.
            alert('Successful login! (Validation only, no actual login)');
            this.reset(); // Clears the form.
        });
    }

    // Form validation for registration.
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = this.name.value;
            const email = this.email.value;
            const username = this.username.value;
            const password = this.password.value;
            const confirmPassword = this['confirm-password'] ? this['confirm-password'].value : '';

            // Check if any of the fields are empty.
            if (name.trim() === '' || email.trim() === '' || username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
                alert('Please fill in all fields.');
                return;
            }
            // Basic email validation.
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            if (password.length < 8) {
                alert('Password must be at least 8 characters long.');
                return;
            }

            // Password strength (basic check for at least one number and one letter).
            if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
                alert('Password must contain at least one letter and one number.');
                return;
            }

            // TODO: Add more validation or submit the form.
            alert('Successful registration! (Validation only, no actual registration)');
            this.reset(); // Clears the form.
        });
    }
});