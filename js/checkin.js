/**
 * checkin.js — Self Check-In multi-step flow
 * Handles: tab navigation, file upload previews, guest list management, completion
 */

(function () {
    'use strict';

    const App = window.HotelApp;

    /* -----------------------------------------------------------------------
       Check-in tab switching (scoped to checkin group only)
    ----------------------------------------------------------------------- */
    function switchCheckinTab(tabId) {
        // Only touch check-in tabs and content
        document.querySelectorAll('[data-group="checkin"]').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.checkin-content').forEach(c => c.classList.remove('active'));

        const tab = document.querySelector(`[data-tab="${tabId}"][data-group="checkin"]`);
        const content = document.getElementById(tabId);

        if (tab) tab.classList.add('active');
        if (content) content.classList.add('active');
    }

    /* -----------------------------------------------------------------------
       Navigation buttons
    ----------------------------------------------------------------------- */
    function initCheckinNavigation() {
        document.getElementById('verification-next')?.addEventListener('click', () => {
            switchCheckinTab('tab-payment');
        });

        document.getElementById('payment-back')?.addEventListener('click', () => {
            switchCheckinTab('tab-verification');
        });

        document.getElementById('payment-next')?.addEventListener('click', () => {
            switchCheckinTab('tab-rooming');
        });

        document.getElementById('rooming-back')?.addEventListener('click', () => {
            switchCheckinTab('tab-payment');
        });

        document.getElementById('rooming-next')?.addEventListener('click', () => {
            switchCheckinTab('tab-confirm');
        });

        document.getElementById('confirm-back')?.addEventListener('click', () => {
            switchCheckinTab('tab-rooming');
        });

        document.getElementById('complete-checkin')?.addEventListener('click', handleCompleteCheckin);
    }

    /* -----------------------------------------------------------------------
       Complete check-in handler
    ----------------------------------------------------------------------- */
    function handleCompleteCheckin() {
        const termsCheck = document.getElementById('terms-check');
        if (!termsCheck?.checked) {
            App.showToast('Please agree to the hotel terms and conditions to proceed.', 'error');
            termsCheck?.focus();
            return;
        }

        const btn = document.getElementById('complete-checkin');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Processing…';
        }

        setTimeout(() => {
            // Hide the check-in card
            const checkInCard = document.getElementById('check-in-card');
            if (checkInCard) checkInCard.style.display = 'none';

            // Update first reservation to active
            if (App.reservationData && App.reservationData.length > 0) {
                App.reservationData[0].status = 'active';
            }

            // Re-render dashboard list
            if (typeof App.renderReservations === 'function') {
                App.renderReservations();
            }

            // Reset check-in form
            resetCheckinForm();

            App.showToast('Check-in complete! Your room is ready. Enjoy your stay!', 'success', 5000);

            if (btn) {
                btn.disabled = false;
                btn.innerHTML = `Complete Check-In <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            }
        }, 1200);
    }

    /* -----------------------------------------------------------------------
       Reset check-in form after completion
    ----------------------------------------------------------------------- */
    function resetCheckinForm() {
        // Reset tab to first step
        switchCheckinTab('tab-verification');

        // Reset file previews
        resetFilePreview('passport-preview', `
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            <span>Passport photo</span>
        `);
        resetFilePreview('selfie-preview', `
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Selfie photo</span>
        `);

        // Reset file inputs
        const passportInput = document.getElementById('passport-upload');
        const selfieInput   = document.getElementById('selfie-upload');
        if (passportInput) passportInput.value = '';
        if (selfieInput)   selfieInput.value   = '';

        // Clear card fields
        ['card-number', 'card-expiry', 'card-cvv', 'card-holder'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });

        // Reset guest list
        const roomList = document.getElementById('room-list');
        if (roomList) {
            roomList.innerHTML = `
                <div class="room-item">
                    <input type="text" placeholder="Guest Name" value="John Doe (Primary Guest)" readonly>
                </div>`;
        }

        // Uncheck terms
        const terms = document.getElementById('terms-check');
        if (terms) terms.checked = false;

        // Clear special requests
        const specialReqs = document.getElementById('special-requests');
        if (specialReqs) specialReqs.value = '';
    }

    function resetFilePreview(previewId, defaultHTML) {
        const el = document.getElementById(previewId);
        if (el) el.innerHTML = defaultHTML;
    }

    /* -----------------------------------------------------------------------
       File upload previews
    ----------------------------------------------------------------------- */
    function initFileUploads() {
        const passportUpload = document.getElementById('passport-upload');
        const selfieUpload   = document.getElementById('selfie-upload');
        const passportPreview = document.getElementById('passport-preview');
        const selfiePreview   = document.getElementById('selfie-preview');

        passportUpload?.addEventListener('change', function () {
            handleFilePreview(this, passportPreview);
        });

        selfieUpload?.addEventListener('change', function () {
            handleFilePreview(this, selfiePreview);
        });
    }

    function handleFilePreview(input, previewEl) {
        if (!input.files || !input.files[0] || !previewEl) return;

        const file = input.files[0];
        if (!file.type.startsWith('image/')) {
            App.showToast('Please upload an image file.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = e => {
            previewEl.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }

    /* -----------------------------------------------------------------------
       Guest list management
    ----------------------------------------------------------------------- */
    function initGuestList() {
        const addGuestBtn = document.getElementById('add-guest');
        const roomList    = document.getElementById('room-list');

        if (!addGuestBtn || !roomList) return;

        addGuestBtn.addEventListener('click', function () {
            const guestCount = roomList.querySelectorAll('.room-item').length + 1;
            const guestDiv = document.createElement('div');
            guestDiv.className = 'room-item';
            guestDiv.innerHTML = `
                <input type="text" placeholder="Guest ${guestCount} Name">
                <button type="button" class="btn-secondary remove-guest" title="Remove guest" style="padding:0.5rem 0.75rem; min-width:36px; flex-shrink:0;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            `;

            roomList.appendChild(guestDiv);

            guestDiv.querySelector('.remove-guest').addEventListener('click', function () {
                guestDiv.remove();
            });

            // Focus the new input
            guestDiv.querySelector('input')?.focus();
        });
    }

    /* -----------------------------------------------------------------------
       Payment input formatting
    ----------------------------------------------------------------------- */
    function initPaymentFormatting() {
        // Card number: groups of 4
        const cardNumber = document.getElementById('card-number');
        cardNumber?.addEventListener('input', function () {
            let value = this.value.replace(/\D/g, '').slice(0, 16);
            this.value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        });

        // Expiry MM/YY
        const cardExpiry = document.getElementById('card-expiry');
        cardExpiry?.addEventListener('input', function () {
            let value = this.value.replace(/\D/g, '').slice(0, 4);
            if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
            this.value = value;
        });

        // CVV: digits only
        const cardCvv = document.getElementById('card-cvv');
        cardCvv?.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '').slice(0, 4);
        });
    }

    /* -----------------------------------------------------------------------
       Check-in tab click (allow clicking tabs directly — read-only nav)
    ----------------------------------------------------------------------- */
    function initCheckinTabClicks() {
        document.querySelectorAll('[data-group="checkin"]').forEach(tab => {
            tab.addEventListener('click', function () {
                switchCheckinTab(this.dataset.tab);
            });
        });
    }

    /* -----------------------------------------------------------------------
       Init
    ----------------------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        initCheckinNavigation();
        initCheckinTabClicks();
        initFileUploads();
        initGuestList();
        initPaymentFormatting();

        // Expose reset for external use
        App.resetCheckinForm = resetCheckinForm;
        App.switchCheckinTab = switchCheckinTab;
    });

})();
