/**
 * reservations.js — Reservation rendering & interactions
 * Handles: dashboard list, detailed view, "View Details" and "Check In Now" buttons
 */

(function () {
    'use strict';

    const App = window.HotelApp;

    /* -----------------------------------------------------------------------
       Helpers
    ----------------------------------------------------------------------- */
    function formatDate(dateString) {
        if (!dateString) return '—';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
    }

    function formatShortDate(dateString) {
        if (!dateString) return '—';
        const options = { month: 'short', day: 'numeric' };
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
    }

    function calculateNights(checkIn, checkOut) {
        const start = new Date(checkIn + 'T00:00:00');
        const end   = new Date(checkOut + 'T00:00:00');
        return Math.round((end - start) / (1000 * 60 * 60 * 24));
    }

    function getTodayString() {
        return new Date().toISOString().split('T')[0];
    }

    function statusLabel(status) {
        const map = { upcoming: 'Upcoming', active: 'Active', cancelled: 'Cancelled' };
        return map[status] || status;
    }

    /* -----------------------------------------------------------------------
       Dashboard mini-list
    ----------------------------------------------------------------------- */
    function renderReservations() {
        const list = document.getElementById('reservation-list');
        const checkInCard = document.getElementById('check-in-card');
        if (!list) return;

        list.innerHTML = '';

        const today = getTodayString();
        const data = App.reservationData || [];

        if (data.length === 0) {
            list.innerHTML = `
                <li class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <p>No upcoming reservations found.</p>
                </li>`;
            if (checkInCard) checkInCard.style.display = 'none';
            return;
        }

        // Check for today's check-in
        const todayRes = data.find(r => r.checkIn === today);
        if (checkInCard) {
            if (todayRes) {
                checkInCard.style.display = 'block';
                populateCheckInSummary(todayRes);
            } else {
                checkInCard.style.display = 'none';
            }
        }

        // Render each reservation card
        data.forEach(res => {
            const nights = calculateNights(res.checkIn, res.checkOut);
            const isToday = res.checkIn === today;

            const li = document.createElement('li');
            li.className = 'reservation-item';
            li.innerHTML = `
                <div class="reservation-header">
                    <div>
                        <h3>${res.hotel}</h3>
                        <p class="reservation-location" style="font-size:0.82rem;color:var(--text-muted);margin:0.1rem 0 0;">${res.location || ''}</p>
                    </div>
                    <div class="reservation-status status-${res.status}">${statusLabel(res.status)}</div>
                </div>
                <div class="reservation-dates">
                    <span class="date-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></span>
                    ${formatShortDate(res.checkIn)} &rarr; ${formatShortDate(res.checkOut)} &nbsp;&middot;&nbsp; ${nights} night${nights !== 1 ? 's' : ''}
                </div>
                <div class="reservation-info">
                    <span><strong>Room:</strong> ${res.roomType}</span>
                    <span><strong>Guests:</strong> ${res.guests} adult${res.guests !== 1 ? 's' : ''}</span>
                    <span><strong>ID:</strong> ${res.id}</span>
                    <span><strong>Total:</strong> ${res.totalPrice}</span>
                </div>
                <div class="reservation-actions">
                    <button class="btn-primary view-details-btn" data-id="${res.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        View Details
                    </button>
                    ${isToday ? `
                    <button class="btn-success check-in-now-btn" data-id="${res.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                        Check In Now
                    </button>` : ''}
                </div>
            `;
            list.appendChild(li);
        });

        // Bind button events AFTER they're in the DOM
        bindDashboardButtons();
    }

    /* -----------------------------------------------------------------------
       Dashboard button event binding (called after render)
    ----------------------------------------------------------------------- */
    function bindDashboardButtons() {
        // View Details → go to My Reservations section
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const resId = this.dataset.id;
                App.showSection('reservations');
                renderDetailedReservations();

                // Highlight the specific reservation after short delay
                setTimeout(() => {
                    const target = document.querySelector(`[data-reservation-id="${resId}"]`);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        target.classList.add('highlighted');
                        setTimeout(() => target.classList.remove('highlighted'), 2000);
                    }
                }, 150);
            });
        });

        // Check In Now → scroll to check-in card
        document.querySelectorAll('.check-in-now-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const checkInCard = document.getElementById('check-in-card');
                if (checkInCard) {
                    checkInCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    checkInCard.classList.add('highlighted');
                    setTimeout(() => checkInCard.classList.remove('highlighted'), 1500);
                }
            });
        });
    }

    /* -----------------------------------------------------------------------
       Check-in summary population
    ----------------------------------------------------------------------- */
    function populateCheckInSummary(res) {
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        set('summary-reservation-id', res.id);
        set('summary-hotel', res.hotel);
        set('summary-checkin', formatDate(res.checkIn));
        set('summary-checkout', formatDate(res.checkOut));
        set('summary-room-type', res.roomType);
        set('summary-guests', `${res.guests} Adult${res.guests !== 1 ? 's' : ''}`);
    }

    /* -----------------------------------------------------------------------
       Detailed reservations view (My Reservations section)
    ----------------------------------------------------------------------- */
    function renderDetailedReservations() {
        const container = document.getElementById('detailed-reservations-container');
        if (!container) return;

        container.innerHTML = '';
        const today = getTodayString();
        const data = App.reservationData || [];

        if (data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <p>No upcoming reservations.</p>
                </div>`;
            return;
        }

        data.forEach(res => {
            const nights = calculateNights(res.checkIn, res.checkOut);
            const isToday = res.checkIn === today;

            const div = document.createElement('div');
            div.className = 'reservation-item';
            div.setAttribute('data-reservation-id', res.id);

            div.innerHTML = `
                <div class="reservation-header">
                    <div>
                        <h3>${res.hotel}</h3>
                        <p style="font-size:0.82rem;color:var(--text-muted);margin:0.1rem 0 0;">${res.location || ''}</p>
                    </div>
                    <div class="reservation-status status-${res.status}">${statusLabel(res.status)}</div>
                </div>
                <div class="reservation-dates">
                    <span class="date-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></span>
                    ${formatDate(res.checkIn)} &rarr; ${formatDate(res.checkOut)} &nbsp;&middot;&nbsp; ${nights} night${nights !== 1 ? 's' : ''}
                </div>
                <div class="reservation-info" style="margin-top:0.625rem;">
                    <span><strong>Room:</strong> ${res.roomType}</span>
                    <span><strong>Guests:</strong> ${res.guests} adult${res.guests !== 1 ? 's' : ''}</span>
                    <span><strong>Price:</strong> ${res.price}/night</span>
                    <span><strong>Total:</strong> ${res.totalPrice}</span>
                    <span><strong>Reservation ID:</strong> ${res.id}</span>
                </div>
                <div class="reservation-actions" style="margin-top:1.25rem;">
                    ${isToday ? `
                    <button class="btn-success detail-checkin-btn" data-id="${res.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                        Check In Now
                    </button>` : ''}
                    <button class="btn-secondary modify-btn" data-id="${res.id}">Modify Reservation</button>
                    <button class="btn-secondary cancel-btn" data-id="${res.id}" style="color:var(--error);">Cancel Reservation</button>
                </div>
            `;
            container.appendChild(div);
        });

        // Bind buttons in detailed view
        bindDetailedButtons();
    }

    /* -----------------------------------------------------------------------
       Detailed view button handlers
    ----------------------------------------------------------------------- */
    function bindDetailedButtons() {
        // Check In Now from detailed view
        document.querySelectorAll('.detail-checkin-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                App.showSection('dashboard');
                setTimeout(() => {
                    const checkInCard = document.getElementById('check-in-card');
                    if (checkInCard) {
                        checkInCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 200);
            });
        });

        // Modify
        document.querySelectorAll('.modify-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                App.showToast('Modification requests can be made via our front desk or customer support.', 'info', 4000);
            });
        });

        // Cancel
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const resId = this.dataset.id;
                if (confirm(`Are you sure you want to cancel reservation ${resId}? This cannot be undone.`)) {
                    const idx = App.reservationData.findIndex(r => r.id === resId);
                    if (idx !== -1) {
                        App.reservationData[idx].status = 'cancelled';
                        renderDetailedReservations();
                        renderReservations();
                        App.showToast(`Reservation ${resId} has been cancelled.`, 'error');
                    }
                }
            });
        });

        // Book Again
        document.querySelectorAll('.book-again-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                App.showToast('Redirecting to booking page with pre-filled details…', 'info');
            });
        });
    }

    /* -----------------------------------------------------------------------
       Reservation tab switching (Upcoming / Past)
    ----------------------------------------------------------------------- */
    function initReservationTabs() {
        const tabs = document.querySelectorAll('[data-group="reservations"]');
        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                // Deactivate all reservation tabs
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                // Hide all reservation tab content
                document.querySelectorAll('.reservations-content').forEach(c => c.classList.remove('active'));

                // Show target content
                const target = document.getElementById(this.dataset.tab);
                if (target) target.classList.add('active');
            });
        });
    }

    /* -----------------------------------------------------------------------
       Highlight animation style injection
    ----------------------------------------------------------------------- */
    function injectHighlightStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .reservation-item.highlighted,
            #check-in-card.highlighted {
                animation: highlightPulse 1.5s ease;
            }
            @keyframes highlightPulse {
                0%   { box-shadow: 0 0 0 0 rgba(67,97,238,0.5); }
                50%  { box-shadow: 0 0 0 8px rgba(67,97,238,0.15); }
                100% { box-shadow: 0 0 0 0 rgba(67,97,238,0); }
            }
            .empty-state {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                padding: 3rem 1rem;
                color: var(--text-light);
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }

    /* -----------------------------------------------------------------------
       Init
    ----------------------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        injectHighlightStyle();
        initReservationTabs();

        // Expose on App namespace
        App.renderReservations = renderReservations;
        App.renderDetailedReservations = renderDetailedReservations;
        App.populateCheckInSummary = populateCheckInSummary;
    });

})();
