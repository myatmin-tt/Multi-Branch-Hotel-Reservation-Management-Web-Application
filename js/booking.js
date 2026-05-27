/**
 * booking.js — Modify Reservation & Book Again / New Reservation
 * Handles: pre-filling forms, price calculation, form submission for both flows
 */

(function () {
    'use strict';

    const App = window.HotelApp;

    /* -----------------------------------------------------------------------
       Room pricing table (per night, USD)
    ----------------------------------------------------------------------- */
    const ROOM_RATES = {
        'Standard Twin':     120,
        'Standard King':     150,
        'Deluxe King':       220,
        'Executive Suite':   350,
        'Premier Suite':     550,
        'Presidential Suite': 1200
    };

    /* -----------------------------------------------------------------------
       Helper: set a <select> value safely
    ----------------------------------------------------------------------- */
    function setSelectValue(id, value) {
        const el = document.getElementById(id);
        if (!el) return;
        const opt = Array.from(el.options).find(o => o.value === value);
        if (opt) el.value = value;
    }

    /* -----------------------------------------------------------------------
       Helper: tomorrow / next week date strings
    ----------------------------------------------------------------------- */
    function dateOffset(days) {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    }

    /* -----------------------------------------------------------------------
       MODIFY RESERVATION
    ----------------------------------------------------------------------- */
    function openModifyReservation(res) {
        // Update badge
        const badge = document.getElementById('modify-badge-id');
        if (badge) badge.textContent = res.id;

        const subtitle = document.getElementById('modify-res-subtitle');
        if (subtitle) subtitle.textContent = `Modifying stay at ${res.hotel}.`;

        // Pre-fill fields
        const checkin  = document.getElementById('modify-checkin');
        const checkout = document.getElementById('modify-checkout');
        if (checkin)  checkin.value  = res.checkIn  || '';
        if (checkout) checkout.value = res.checkOut || '';

        setSelectValue('modify-room-type', res.roomType);
        setSelectValue('modify-guests', String(res.guests));

        // Navigate to modify section
        App.showSection('modify');

        // Store currently edited reservation ID
        App._editingResId = res.id;
    }

    /* -----------------------------------------------------------------------
       Modify form submission
    ----------------------------------------------------------------------- */
    function initModifyForm() {
        const form = document.getElementById('modify-reservation-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const checkIn  = document.getElementById('modify-checkin')?.value;
            const checkOut = document.getElementById('modify-checkout')?.value;
            const roomType = document.getElementById('modify-room-type')?.value;
            const guests   = parseInt(document.getElementById('modify-guests')?.value || '1');

            if (!checkIn || !checkOut) {
                App.showToast('Please select both check-in and check-out dates.', 'error');
                return;
            }
            if (new Date(checkOut) <= new Date(checkIn)) {
                App.showToast('Check-out must be after check-in.', 'error');
                return;
            }

            // Apply changes to data
            const resId = App._editingResId;
            const idx = App.reservationData.findIndex(r => r.id === resId);
            if (idx !== -1) {
                App.reservationData[idx].checkIn   = checkIn;
                App.reservationData[idx].checkOut  = checkOut;
                App.reservationData[idx].roomType  = roomType;
                App.reservationData[idx].guests    = guests;

                // Recalculate nights and total
                const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
                const rate   = ROOM_RATES[roomType] || 200;
                App.reservationData[idx].nights     = nights;
                App.reservationData[idx].price      = `$${rate}`;
                App.reservationData[idx].totalPrice = `$${(rate * nights).toLocaleString()}`;
            }

            // Re-render and go back to reservations
            if (typeof App.renderReservations         === 'function') App.renderReservations();
            if (typeof App.renderDetailedReservations === 'function') App.renderDetailedReservations();

            App.showSection('reservations');
            App.showToast('Reservation updated successfully.', 'success');
            App._editingResId = null;
        });

        // Cancel / Back buttons
        document.getElementById('modify-cancel-btn')?.addEventListener('click', () => {
            App.showSection('reservations');
        });
        document.getElementById('modify-back-btn')?.addEventListener('click', () => {
            App.showSection('reservations');
        });
    }

    /* -----------------------------------------------------------------------
       BOOKING SECTION (new booking / book again)
    ----------------------------------------------------------------------- */
    function openBookingSection(opts) {
        opts = opts || {};

        // Update title & subtitle based on mode
        const title    = document.getElementById('booking-section-title');
        const subtitle = document.getElementById('booking-section-subtitle');

        if (opts.mode === 'again') {
            if (title)    title.textContent    = 'Book Again';
            if (subtitle) subtitle.textContent = 'Your previous preferences have been pre-filled. Adjust as needed.';
        } else {
            if (title)    title.textContent    = 'New Reservation';
            if (subtitle) subtitle.textContent = 'Fill in the details below to complete your booking.';
        }

        // Pre-fill hotel
        if (opts.hotel) setSelectValue('booking-hotel', opts.hotel);

        // Pre-fill room type
        if (opts.roomType) setSelectValue('booking-room-type', opts.roomType);

        // Pre-fill guests
        if (opts.guests) setSelectValue('booking-guests', String(opts.guests));

        // Default dates: tomorrow + 3 nights
        const checkinEl  = document.getElementById('booking-checkin');
        const checkoutEl = document.getElementById('booking-checkout');
        if (checkinEl  && !checkinEl.value)  checkinEl.value  = dateOffset(1);
        if (checkoutEl && !checkoutEl.value) checkoutEl.value = dateOffset(4);

        // Pre-fill guest name from profile field if available
        const nameEl = document.getElementById('booking-name');
        if (nameEl && !nameEl.value) {
            const profileName = document.getElementById('profile-name')?.value;
            if (profileName) nameEl.value = profileName;
        }

        // Pre-fill email from profile if available
        const emailEl = document.getElementById('booking-email');
        if (emailEl && !emailEl.value) {
            const profileEmail = document.getElementById('profile-email')?.value;
            if (profileEmail) emailEl.value = profileEmail;
        }

        // Reset terms checkbox
        const terms = document.getElementById('booking-terms');
        if (terms) terms.checked = false;

        // Update price summary
        updatePriceSummary();

        App.showSection('booking');
    }

    /* -----------------------------------------------------------------------
       Price summary calculation
    ----------------------------------------------------------------------- */
    function updatePriceSummary() {
        const roomType  = document.getElementById('booking-room-type')?.value || '';
        const checkIn   = document.getElementById('booking-checkin')?.value;
        const checkOut  = document.getElementById('booking-checkout')?.value;
        const rate      = ROOM_RATES[roomType] || 0;

        const rateEl   = document.getElementById('booking-rate-display');
        const nightsEl = document.getElementById('booking-nights-display');
        const totalEl  = document.getElementById('booking-total-display');

        if (rateEl) rateEl.textContent = rate ? `$${rate} / night` : '\u2014';

        if (checkIn && checkOut) {
            const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
            if (nights > 0) {
                if (nightsEl) nightsEl.textContent = `${nights} night${nights !== 1 ? 's' : ''}`;
                if (totalEl)  totalEl.textContent  = `$${(rate * nights).toLocaleString()}`;
            } else {
                if (nightsEl) nightsEl.textContent = '\u2014';
                if (totalEl)  totalEl.textContent  = '\u2014';
            }
        } else {
            if (nightsEl) nightsEl.textContent = '\u2014';
            if (totalEl)  totalEl.textContent  = '\u2014';
        }
    }

    /* -----------------------------------------------------------------------
       Booking form submission
    ----------------------------------------------------------------------- */
    function initBookingForm() {
        const form = document.getElementById('booking-form');
        if (!form) return;

        // Live price updates
        ['booking-room-type', 'booking-checkin', 'booking-checkout'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', updatePriceSummary);
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const hotel    = document.getElementById('booking-hotel')?.value;
            const checkIn  = document.getElementById('booking-checkin')?.value;
            const checkOut = document.getElementById('booking-checkout')?.value;
            const roomType = document.getElementById('booking-room-type')?.value;
            const guests   = parseInt(document.getElementById('booking-guests')?.value || '1');
            const name     = document.getElementById('booking-name')?.value.trim();
            const email    = document.getElementById('booking-email')?.value.trim();
            const terms    = document.getElementById('booking-terms')?.checked;

            // Validation
            if (!hotel || !checkIn || !checkOut || !roomType) {
                App.showToast('Please fill in hotel, room type, and dates.', 'error');
                return;
            }
            if (new Date(checkOut) <= new Date(checkIn)) {
                App.showToast('Check-out must be after check-in.', 'error');
                return;
            }
            if (!name) {
                App.showToast('Please enter the primary guest name.', 'error');
                return;
            }
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                App.showToast('Please enter a valid contact email.', 'error');
                return;
            }
            if (!terms) {
                App.showToast('Please agree to the terms and conditions.', 'error');
                return;
            }

            // Simulate booking
            const btn = document.getElementById('booking-submit-btn');
            if (btn) { btn.disabled = true; btn.textContent = 'Processing...'; }

            setTimeout(() => {
                // Generate reservation ID
                const newId = 'RES' + Math.random().toString(36).substr(2, 6).toUpperCase();
                const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
                const rate   = ROOM_RATES[roomType] || 200;

                // Add to reservation data
                App.reservationData.push({
                    id:         newId,
                    hotel:      hotel,
                    location:   '',
                    roomType:   roomType,
                    checkIn:    checkIn,
                    checkOut:   checkOut,
                    guests:     guests,
                    nights:     nights,
                    status:     'upcoming',
                    price:      `$${rate}`,
                    totalPrice: `$${(rate * nights).toLocaleString()}`
                });

                // Re-render reservation lists
                if (typeof App.renderReservations         === 'function') App.renderReservations();
                if (typeof App.renderDetailedReservations === 'function') App.renderDetailedReservations();

                // Reset form
                form.reset();
                document.getElementById('booking-checkin').value  = '';
                document.getElementById('booking-checkout').value = '';
                updatePriceSummary();

                if (btn) { btn.disabled = false; btn.textContent = 'Confirm Reservation'; }

                App.showSection('reservations');
                App.showToast(`Reservation ${newId} confirmed! Check your email for details.`, 'success', 5000);
            }, 900);
        });

        // Cancel / Back buttons
        document.getElementById('booking-cancel-btn')?.addEventListener('click', () => {
            App.showSection('reservations');
        });
        document.getElementById('booking-back-btn')?.addEventListener('click', () => {
            App.showSection('reservations');
        });
    }

    /* -----------------------------------------------------------------------
       Init
    ----------------------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        initModifyForm();
        initBookingForm();

        // Expose on App namespace for use by reservations.js
        App.openModifyReservation = openModifyReservation;
        App.openBookingSection    = openBookingSection;
    });

})();
