document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Navigation
    const homeLink = document.getElementById('home-link');
    const reservationsLink = document.getElementById('reservations-link');
    const profileLink = document.getElementById('profile-link');
    const logoutLink = document.getElementById('logout-link');
    
    // DOM Elements - Sections
    const loginSection = document.getElementById('login-section');
    const registrationSection = document.getElementById('registration-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const checkInCard = document.getElementById('check-in-card');
    const profileSection = document.getElementById('profile-section');
    const myReservationsSection = document.getElementById('my-reservations-section');
    
    // DOM Elements - Forms
    const loginForm = document.getElementById('login-form');
    const registrationForm = document.getElementById('registration-form');
    const profileForm = document.getElementById('profile-form');
    
    // DOM Elements - Links
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');
    
    // DOM Elements - Check-in Tabs and Buttons
    const tabItems = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const verificationNextBtn = document.getElementById('verification-next');
    const paymentBackBtn = document.getElementById('payment-back');
    const paymentNextBtn = document.getElementById('payment-next');
    const roomingBackBtn = document.getElementById('rooming-back');
    const roomingNextBtn = document.getElementById('rooming-next');
    const confirmBackBtn = document.getElementById('confirm-back');
    const completeCheckinBtn = document.getElementById('complete-checkin');
    
    // DOM Elements - File Upload
    const passportUpload = document.getElementById('passport-upload');
    const selfieUpload = document.getElementById('selfie-upload');
    const passportPreview = document.getElementById('passport-preview');
    const selfiePreview = document.getElementById('selfie-preview');
    
    // DOM Elements - Add Guest Button
    const addGuestBtn = document.getElementById('add-guest');
    const roomList = document.getElementById('room-list');
    
    // Sample Reservation Data
    const reservationData = [
        {
            id: 'RES123456',
            hotel: 'HotelCheck Grand Resort',
            roomType: 'Deluxe King',
            checkIn: '2025-02-28',
            checkOut: '2025-03-03',
            guests: 2,
            status: 'upcoming',
            price: '$450'
        },
        {
            id: 'RES789012',
            hotel: 'HotelCheck Downtown',
            roomType: 'Executive Suite',
            checkIn: '2025-03-15',
            checkOut: '2025-03-20',
            guests: 3,
            status: 'upcoming',
            price: '$780'
        }
    ];
    
    // Functions to control section visibility
    function showSection(section) {
        // Hide all sections
        loginSection.style.display = 'none';
        registrationSection.style.display = 'none';
        dashboardSection.style.display = 'none';
        profileSection.style.display = 'none';
        myReservationsSection.style.display = 'none';
        
        // Show selected section
        if (section === 'login') {
            loginSection.style.display = 'block';
        } else if (section === 'registration') {
            registrationSection.style.display = 'block';
        } else if (section === 'dashboard') {
            dashboardSection.style.display = 'block';
        } else if (section === 'profile') {
            profileSection.style.display = 'block';
        } else if (section === 'reservations') {
            myReservationsSection.style.display = 'block';
        }
        
        // Update active nav link
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        if (section === 'dashboard') {
            homeLink.classList.add('active');
        } else if (section === 'profile') {
            profileLink.classList.add('active');
        } else if (section === 'reservations') {
            reservationsLink.classList.add('active');
        }
    }
    
    // Function to handle tab switching
    function switchTab(tabId) {
        // Remove active class from all tabs and contents
        tabItems.forEach(item => item.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        document.querySelector(`.tab-item[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }
    
    // Function to format dates nicely
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Function to calculate nights
    function calculateNights(checkIn, checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    // Function to populate reservations
    function populateReservations() {
        const reservationList = document.querySelector('.reservation-list');
        const detailedContainer = document.getElementById('detailed-reservations-container');
        
        // Clear existing reservations
        reservationList.innerHTML = '';
        if (detailedContainer) {
            detailedContainer.innerHTML = '';
        }
        
        // Add check-in card if there's an active reservation for today
        const today = new Date().toISOString().split('T')[0];
        const activeReservation = reservationData.find(res => res.checkIn === today);
        if (activeReservation) {
            checkInCard.style.display = 'block';
            
            // Update reservation summary
            document.getElementById('summary-reservation-id').textContent = activeReservation.id;
            document.getElementById('summary-checkin').textContent = formatDate(activeReservation.checkIn);
            document.getElementById('summary-checkout').textContent = formatDate(activeReservation.checkOut);
            document.getElementById('summary-room-type').textContent = activeReservation.roomType;
            document.getElementById('summary-guests').textContent = `${activeReservation.guests} Adults`;
        } else {
            checkInCard.style.display = 'none';
        }
        
        // Add reservation items to dashboard
        reservationData.forEach(reservation => {
            const li = document.createElement('li');
            li.className = 'reservation-item';
            
            const nights = calculateNights(reservation.checkIn, reservation.checkOut);
            
            li.innerHTML = `
                <div class="reservation-header">
                    <h3>${reservation.hotel}</h3>
                    <div class="reservation-status status-${reservation.status}">${reservation.status}</div>
                </div>
                <div class="reservation-dates">
                    ${formatDate(reservation.checkIn)} - ${formatDate(reservation.checkOut)} (${nights} nights)
                </div>
                <p><strong>Room:</strong> ${reservation.roomType}</p>
                <p><strong>Guests:</strong> ${reservation.guests} Adults</p>
                <p><strong>Reservation ID:</strong> ${reservation.id}</p>
                <div class="reservation-actions">
                    <button data-id="${reservation.id}" class="view-details-btn">View Details</button>
                    ${reservation.checkIn === today ? 
                     '<button class="check-in-btn">Check In Now</button>' : ''}
                </div>
            `;
            
            reservationList.appendChild(li);
            
            // Add to detailed view
            if (detailedContainer) {
                const detailedItem = document.createElement('div');
                detailedItem.className = 'reservation-item';
                detailedItem.innerHTML = `
                    <div class="reservation-header">
                        <h3>${reservation.hotel}</h3>
                        <div class="reservation-status status-${reservation.status}">${reservation.status}</div>
                    </div>
                    <div class="reservation-dates">
                        ${formatDate(reservation.checkIn)} - ${formatDate(reservation.checkOut)} (${nights} nights)
                    </div>
                    <p><strong>Room:</strong> ${reservation.roomType}</p>
                    <p><strong>Guests:</strong> ${reservation.guests} Adults</p>
                    <p><strong>Price:</strong> ${reservation.price} per night</p>
                    <p><strong>Reservation ID:</strong> ${reservation.id}</p>
                    <div class="reservation-actions">
                        ${reservation.checkIn === today ? 
                         '<button class="check-in-btn">Check In Now</button>' : ''}
                        <button class="secondary modify-btn">Modify Reservation</button>
                        <button class="secondary cancel-btn">Cancel Reservation</button>
                    </div>
                `;
                detailedContainer.appendChild(detailedItem);
            }
        });
        
        // Add event listeners to the newly created buttons
        document.querySelectorAll('.check-in-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                showSection('dashboard');
                setTimeout(() => {
                    checkInCard.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            });
        });
    }
    
    // Initialize the application
    function init() {
        // Show login section by default
        showSection('login');
        
        // Populate reservations list
        populateReservations();
        
        // Add event listeners
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('registration');
        });
        
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('login');
        });
        
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('dashboard');
        });
        
        reservationsLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('reservations');
        });
        
        profileLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('profile');
        });
        
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('login');
        });
        
        // Tab handling
        tabItems.forEach(item => {
            item.addEventListener('click', function() {
                switchTab(this.dataset.tab);
            });
        });
        
        // Form submissions
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simulate login
            showSection('dashboard');
        });
        
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simulate registration
            showSection('dashboard');
        });
        
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Show success message
            alert('Profile updated successfully!');
        });
        
        // Check-in flow navigation
        verificationNextBtn.addEventListener('click', function() {
            switchTab('tab-payment');
        });
        
        paymentBackBtn.addEventListener('click', function() {
            switchTab('tab-verification');
        });
        
        paymentNextBtn.addEventListener('click', function() {
            switchTab('tab-rooming');
        });
        
        roomingBackBtn.addEventListener('click', function() {
            switchTab('tab-payment');
        });
        
        roomingNextBtn.addEventListener('click', function() {
            switchTab('tab-confirm');
        });
        
        confirmBackBtn.addEventListener('click', function() {
            switchTab('tab-rooming');
        });
        
        completeCheckinBtn.addEventListener('click', function() {
            // Validate terms checkbox
            if (!document.getElementById('terms-check').checked) {
                alert('Please agree to the terms and conditions to complete check-in.');
                return;
            }
            
            // Show success message and update reservation status
            alert('Check-in completed successfully! Your room is ready.');
            
            // Hide check-in card and update reservation status
            checkInCard.style.display = 'none';
            
            // Update the first reservation to active
            reservationData[0].status = 'active';
            populateReservations();
        });
        
        // File upload previews
        passportUpload.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    passportPreview.innerHTML = `<img src="${e.target.result}" alt="Passport Preview">`;
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        selfieUpload.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    selfiePreview.innerHTML = `<img src="${e.target.result}" alt="Selfie Preview">`;
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        // Add guest button
        addGuestBtn.addEventListener('click', function() {
            const guestDiv = document.createElement('div');
            guestDiv.className = 'room-item';
            guestDiv.innerHTML = `
                <div>
                    <input type="text" placeholder="Guest Name">
                </div>
                <button type="button" class="remove-guest secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
            
            roomList.appendChild(guestDiv);
            
            // Add remove event listener
            guestDiv.querySelector('.remove-guest').addEventListener('click', function() {
                roomList.removeChild(guestDiv);
            });
        });
        
        // Add event listeners for reservation tabs
        document.querySelectorAll('.tabs .tab-item').forEach(tab => {
            tab.addEventListener('click', function() {
                // For reservation tabs specifically
                if (this.dataset.tab === 'upcoming-reservations' || this.dataset.tab === 'past-reservations') {
                    document.querySelectorAll('.tabs .tab-item').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    document.querySelectorAll('#my-reservations-section .tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    document.getElementById(this.dataset.tab).classList.add('active');
                }
            });
        });
        
        // Add event listeners for the "Book Again" buttons
        document.querySelectorAll('.book-again-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                alert('This feature will take you to the booking page with pre-filled information.');
            });
        });
    }
    
    // Make input fields like credit card number, expiry, and CVV behave properly
    function setupInputFormatting() {
        // Credit card formatting
        const cardNumberInput = document.getElementById('card-number');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 16) value = value.slice(0, 16);
                
                // Add spaces every 4 digits
                const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                e.target.value = formattedValue;
            });
        }
        
        // Expiry date formatting (MM/YY)
        const cardExpiryInput = document.getElementById('card-expiry');
        if (cardExpiryInput) {
            cardExpiryInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 4) value = value.slice(0, 4);
                
                if (value.length > 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2);
                }
                
                e.target.value = value;
            });
        }
        
        // CVV formatting (3-4 digits)
        const cardCvvInput = document.getElementById('card-cvv');
        if (cardCvvInput) {
            cardCvvInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 4) value = value.slice(0, 4);
                e.target.value = value;
            });
        }
    }
    
    // Add animations for better user experience
    function addAnimations() {
        // Add fade in animation to sections when they appear
        const allSections = [loginSection, registrationSection, dashboardSection, profileSection, myReservationsSection];
        
        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .fade-in {
                animation: fadeIn 0.3s ease-out forwards;
            }
            
            .reservation-item, .room-item, .btn-actions button {
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            .reservation-item:hover, .room-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
            }
            
            .btn-actions button:active {
                transform: scale(0.98);
            }
            
            .tab-content {
                transition: opacity 0.3s ease;
                opacity: 0;
            }
            
            .tab-content.active {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
        
        // Observer for section changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const target = mutation.target;
                    if (target.style.display === 'block') {
                        target.classList.add('fade-in');
                        setTimeout(() => target.classList.remove('fade-in'), 300);
                    }
                }
            });
        });
        
        // Observe all sections
        allSections.forEach(section => {
            observer.observe(section, { attributes: true });
        });
    }
    
    // Call initialization functions
    init();
    setupInputFormatting();
    addAnimations();
});