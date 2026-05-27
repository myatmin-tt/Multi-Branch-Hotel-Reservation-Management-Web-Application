/**
 * app.js — Core navigation & section management
 * Handles: section switching, nav state, toast notifications, date display
 */

(function () {
    'use strict';

    const App = window.HotelApp = window.HotelApp || {};

    /* -----------------------------------------------------------------------
       State
    ----------------------------------------------------------------------- */
    let isLoggedIn = false;

    /* -----------------------------------------------------------------------
       DOM References
    ----------------------------------------------------------------------- */
    const mainNav       = document.getElementById('main-nav');
    const homeLink      = document.getElementById('home-link');
    const reservLink    = document.getElementById('reservations-link');
    const profileLink   = document.getElementById('profile-link');
    const logoutLink    = document.getElementById('logout-link');
    const logoLink      = document.getElementById('logo-link');

    const sections = {
        login:        document.getElementById('login-section'),
        registration: document.getElementById('registration-section'),
        dashboard:    document.getElementById('dashboard-section'),
        profile:      document.getElementById('profile-section'),
        reservations: document.getElementById('my-reservations-section'),
        modify:       document.getElementById('modify-reservation-section'),
        booking:      document.getElementById('booking-section')
    };

    /* -----------------------------------------------------------------------
       Section visibility
    ----------------------------------------------------------------------- */
    function showSection(name) {
        // Hide all
        Object.values(sections).forEach(el => {
            if (el) el.style.display = 'none';
        });

        // Show requested
        const target = sections[name];
        if (target) {
            target.style.display = (name === 'dashboard') ? 'block' : '';
            // Trigger fade-in animation
            target.classList.remove('section-visible');
            void target.offsetWidth; // reflow
            target.classList.add('section-visible');
        }

        // Update nav link active state
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        if (name === 'dashboard')    homeLink?.classList.add('active');
        if (name === 'reservations') reservLink?.classList.add('active');
        if (name === 'profile')      profileLink?.classList.add('active');

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* -----------------------------------------------------------------------
       Login state management
    ----------------------------------------------------------------------- */
    function setLoggedIn(user) {
        isLoggedIn = true;
        mainNav.classList.remove('nav-hidden');

        // Personalise welcome message
        const heading = document.getElementById('welcome-heading');
        if (heading && user) {
            const hour = new Date().getHours();
            const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
            heading.textContent = `${greeting}, ${user.firstName}!`;
        }
    }

    function setLoggedOut() {
        isLoggedIn = false;
        mainNav.classList.add('nav-hidden');
    }

    /* -----------------------------------------------------------------------
       Current date display
    ----------------------------------------------------------------------- */
    function updateDateDisplay() {
        const el = document.getElementById('current-date-display');
        if (!el) return;
        const now = new Date();
        el.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    /* -----------------------------------------------------------------------
       Toast notification system
    ----------------------------------------------------------------------- */
    function createToastContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    function showToast(message, type = 'info', duration = 3500) {
        const container = createToastContainer();

        const icons = {
            success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
            error:   `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
            info:    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('leaving');
            toast.addEventListener('animationend', () => toast.remove());
        }, duration);
    }

    /* -----------------------------------------------------------------------
       Navigation event listeners
    ----------------------------------------------------------------------- */
    function initNav() {
        logoLink?.addEventListener('click', e => {
            e.preventDefault();
            if (isLoggedIn) showSection('dashboard');
        });

        homeLink?.addEventListener('click', e => {
            e.preventDefault();
            showSection('dashboard');
        });

        reservLink?.addEventListener('click', e => {
            e.preventDefault();
            showSection('reservations');
            // Re-render detailed reservations
            if (typeof App.renderDetailedReservations === 'function') {
                App.renderDetailedReservations();
            }
        });

        profileLink?.addEventListener('click', e => {
            e.preventDefault();
            showSection('profile');
        });

        logoutLink?.addEventListener('click', e => {
            e.preventDefault();
            setLoggedOut();
            showSection('login');
            showToast('You have been signed out.', 'info');
        });

        // "View All" link on dashboard
        document.getElementById('view-all-reservations')?.addEventListener('click', e => {
            e.preventDefault();
            showSection('reservations');
            if (typeof App.renderDetailedReservations === 'function') {
                App.renderDetailedReservations();
            }
        });
    }

    /* -----------------------------------------------------------------------
       Fade-in style injection
    ----------------------------------------------------------------------- */
    function injectAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #login-section, #registration-section,
            #dashboard-section, #profile-section,
            #my-reservations-section {
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
            .section-visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    /* -----------------------------------------------------------------------
       Init
    ----------------------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        injectAnimationStyles();
        initNav();
        updateDateDisplay();

        // Start on login
        showSection('login');

        // Expose public API
        App.showSection   = showSection;
        App.setLoggedIn   = setLoggedIn;
        App.setLoggedOut  = setLoggedOut;
        App.showToast     = showToast;
        App.isLoggedIn    = () => isLoggedIn;
    });

})();
