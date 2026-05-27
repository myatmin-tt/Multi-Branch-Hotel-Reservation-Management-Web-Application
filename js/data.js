/**
 * data.js — Sample data & constants
 * Shared across all feature modules via window.HotelApp namespace
 */

(function () {
    'use strict';

    // Demo user credentials
    const DEMO_USER = {
        email: 'johndoe97@gmail.com',
        password: 'JohnDoe123',
        name: 'John Doe',
        firstName: 'John'
    };

    // Sample reservation data
    const reservationData = [
        {
            id: 'RES123456',
            hotel: 'HotelCheck Grand Resort',
            location: 'Yangon, Myanmar',
            roomType: 'Deluxe King',
            checkIn: '2025-02-28',
            checkOut: '2025-03-03',
            guests: 2,
            nights: 3,
            status: 'upcoming',
            price: '$450',
            totalPrice: '$1,350'
        },
        {
            id: 'RES789012',
            hotel: 'HotelCheck Downtown',
            location: 'Mandalay, Myanmar',
            roomType: 'Executive Suite',
            checkIn: '2025-03-15',
            checkOut: '2025-03-20',
            guests: 3,
            nights: 5,
            status: 'upcoming',
            price: '$780',
            totalPrice: '$3,900'
        }
    ];

    // Expose on global namespace
    window.HotelApp = window.HotelApp || {};
    window.HotelApp.DEMO_USER = DEMO_USER;
    window.HotelApp.reservationData = reservationData;

})();
