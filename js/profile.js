/**
 * profile.js — Profile form logic
 * Handles: save profile, photo change placeholder
 */

(function () {
    'use strict';

    const App = window.HotelApp;

    /* -----------------------------------------------------------------------
       Profile form submission
    ----------------------------------------------------------------------- */
    function initProfileForm() {
        const profileForm = document.getElementById('profile-form');
        if (!profileForm) return;

        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name  = document.getElementById('profile-name')?.value.trim();
            const email = document.getElementById('profile-email')?.value.trim();
            const phone = document.getElementById('profile-phone')?.value.trim();

            if (!name || !email) {
                App.showToast('Name and email are required.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                App.showToast('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate save
            const btn = profileForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                btn.textContent = 'Saving…';
            }

            setTimeout(() => {
                App.showToast('Profile updated successfully!', 'success');
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = 'Save Changes';
                }
            }, 600);
        });
    }

    /* -----------------------------------------------------------------------
       Change photo button
    ----------------------------------------------------------------------- */
    function initPhotoChange() {
        const changePhotoBtn = document.querySelector('.profile-image .btn-secondary');
        if (!changePhotoBtn) return;

        changePhotoBtn.addEventListener('click', function () {
            App.showToast('Photo upload is available in the full version.', 'info');
        });
    }

    /* -----------------------------------------------------------------------
       Init
    ----------------------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        initProfileForm();
        initPhotoChange();
    });

})();
