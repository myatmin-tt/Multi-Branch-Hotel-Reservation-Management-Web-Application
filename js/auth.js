/**
 * auth.js — Login & Registration logic
 * Handles: form validation, demo credential autofill, login/register flows
 */

(function () {
    'use strict';

    const App = window.HotelApp;

    /* -----------------------------------------------------------------------
       DOM References
    ----------------------------------------------------------------------- */
    const loginForm        = document.getElementById('login-form');
    const registrationForm = document.getElementById('registration-form');
    const registerLink     = document.getElementById('register-link');
    const loginLink        = document.getElementById('login-link');

    // Login fields
    const emailInput    = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError    = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    // Demo buttons
    const demoFillAll   = document.getElementById('demo-autofill-btn');
    const demoCopyBtns  = document.querySelectorAll('.demo-copy-btn');

    /* -----------------------------------------------------------------------
       Validation helpers
    ----------------------------------------------------------------------- */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(el, message) {
        if (el) el.textContent = message;
    }
    function clearError(el) {
        if (el) el.textContent = '';
    }

    /* -----------------------------------------------------------------------
       Login flow
    ----------------------------------------------------------------------- */
    function handleLogin(e) {
        e.preventDefault();
        let valid = true;

        clearError(emailError);
        clearError(passwordError);

        const email    = emailInput?.value.trim() || '';
        const password = passwordInput?.value || '';

        if (!email) {
            showError(emailError, 'Email is required.');
            valid = false;
        } else if (!isValidEmail(email)) {
            showError(emailError, 'Please enter a valid email address.');
            valid = false;
        }

        if (!password) {
            showError(passwordError, 'Password is required.');
            valid = false;
        } else if (password.length < 6) {
            showError(passwordError, 'Password must be at least 6 characters.');
            valid = false;
        }

        if (!valid) return;

        // Simulate login (demo credentials or any valid format)
        const btn = loginForm.querySelector('button[type="submit"]');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `<svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg> Signing in…`;
        }

        setTimeout(() => {
            // Determine user name from email
            const demoUser = App.DEMO_USER;
            const firstName = (email === demoUser.email) ? demoUser.firstName : email.split('@')[0];
            const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

            App.setLoggedIn({ firstName: displayName });

            // Render reservations before showing dashboard
            if (typeof App.renderReservations === 'function') {
                App.renderReservations();
            }

            App.showSection('dashboard');
            App.showToast(`Welcome back, ${displayName}!`, 'success');

            // Re-enable button
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg> Sign In`;
            }

            // Reset form
            loginForm.reset();
            clearError(emailError);
            clearError(passwordError);
        }, 800);
    }

    /* -----------------------------------------------------------------------
       Registration flow
    ----------------------------------------------------------------------- */
    function handleRegistration(e) {
        e.preventDefault();

        const firstName = document.getElementById('first-name')?.value.trim();
        const lastName  = document.getElementById('last-name')?.value.trim();
        const email     = document.getElementById('reg-email')?.value.trim();
        const password  = document.getElementById('reg-password')?.value;
        const confirm   = document.getElementById('confirm-password')?.value;

        if (!firstName || !lastName || !email || !password || !confirm) {
            App.showToast('Please fill in all required fields.', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            App.showToast('Please enter a valid email address.', 'error');
            return;
        }
        if (password.length < 8) {
            App.showToast('Password must be at least 8 characters.', 'error');
            return;
        }
        if (password !== confirm) {
            App.showToast('Passwords do not match.', 'error');
            return;
        }

        // Simulate registration
        const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        App.setLoggedIn({ firstName: displayName });

        if (typeof App.renderReservations === 'function') {
            App.renderReservations();
        }

        App.showSection('dashboard');
        App.showToast(`Account created! Welcome, ${displayName}!`, 'success');
        registrationForm.reset();
    }

    /* -----------------------------------------------------------------------
       Demo credentials autofill
    ----------------------------------------------------------------------- */
    function setupDemoCredentials() {
        // "Use" buttons next to each field
        demoCopyBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const target = this.dataset.copy;
                if (target === 'email' && emailInput) {
                    emailInput.value = App.DEMO_USER.email;
                    emailInput.focus();
                    clearError(emailError);
                } else if (target === 'password' && passwordInput) {
                    passwordInput.value = App.DEMO_USER.password;
                    passwordInput.focus();
                    clearError(passwordError);
                }
                // Small visual feedback
                const orig = this.textContent;
                this.textContent = '✓';
                setTimeout(() => { this.textContent = orig; }, 1000);
            });
        });

        // "Fill all & sign in" button
        demoFillAll?.addEventListener('click', function () {
            if (emailInput)    emailInput.value    = App.DEMO_USER.email;
            if (passwordInput) passwordInput.value = App.DEMO_USER.password;
            clearError(emailError);
            clearError(passwordError);

            // Brief delay then submit
            setTimeout(() => loginForm.dispatchEvent(new Event('submit')), 300);
        });
    }

    /* -----------------------------------------------------------------------
       Spinner animation style
    ----------------------------------------------------------------------- */
    function injectSpinnerStyle() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .spin-icon { animation: spin 0.8s linear infinite; }
        `;
        document.head.appendChild(style);
    }

    /* -----------------------------------------------------------------------
       Init
    ----------------------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        injectSpinnerStyle();

        loginForm?.addEventListener('submit', handleLogin);
        registrationForm?.addEventListener('submit', handleRegistration);

        registerLink?.addEventListener('click', e => {
            e.preventDefault();
            App.showSection('registration');
        });

        loginLink?.addEventListener('click', e => {
            e.preventDefault();
            App.showSection('login');
        });

        // Clear field errors on input
        emailInput?.addEventListener('input', () => clearError(emailError));
        passwordInput?.addEventListener('input', () => clearError(passwordError));

        setupDemoCredentials();
    });

})();
