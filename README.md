# HotelCheck — Multi-Branch Hotel Reservation Management Web Application

A modern, responsive self check-in portal for multi-branch hotel chains. Guests can log in, view their upcoming reservations, complete the self check-in process (identity verification, payment, rooming list), and manage their profile — all from a single web interface.

---

##  Features

- **Guest Authentication** — Login and registration with form validation
- **Dashboard** — Overview of upcoming reservations for the logged-in guest
- **Self Check-In Flow** — Multi-step guided process:
  1. Identity Verification (passport & selfie photo upload)
  2. Payment Information (credit card with auto-formatting)
  3. Rooming List (manage additional guests)
  4. Confirmation & Summary
- **My Reservations** — View upcoming and past reservations with details
- **Profile Management** — Update personal information and notification preferences
- **Responsive Design** — Works on desktop, tablet, and mobile

---

##  Getting Started

This is a pure HTML/CSS/JavaScript application — no build tools or dependencies required.

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/multi-branch-hotel-reservation.git
   cd multi-branch-hotel-reservation
   ```

2. **Open in browser**
   - Simply open `index.html` in any modern web browser
   - Or use a local dev server (e.g., VS Code Live Server extension)

---

##  Demo Login Credentials

Use the following credentials to explore the application:

| Field    | Value                   |
|----------|-------------------------|
| Email    | `johndoe97@gmail.com`   |
| Password | `JohnDoe123`            |

> These credentials are pre-loaded with sample reservation data.

---

## Project Structure

```
├── index.html              # Main entry point (single-page app shell)
├── css/
│   └── style.css           # Application stylesheet
├── js/
│   ├── app.js              # Core navigation & section management
│   ├── auth.js             # Login / registration logic
│   ├── data.js             # Sample reservation data
│   ├── reservations.js     # Reservation rendering & interactions
│   ├── checkin.js          # Self check-in multi-step flow
│   └── profile.js          # Profile form logic
├── README.md
├── .gitignore
└── LICENSE
```

---

##  Tech Stack

| Technology | Purpose                     |
|------------|-----------------------------|
| HTML5      | Page structure & semantics  |
| CSS3       | Styling, layout, animations |
| JavaScript (ES6+) | Application logic   |
| Google Fonts (Inter) | Typography        |

---

##  Responsive Breakpoints

| Breakpoint | Target Device |
|------------|---------------|
| ≥ 1024px   | Desktop       |
| ≥ 768px    | Tablet        |
| < 768px    | Mobile        |

---

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

##  License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

##  Academic Project

> This project was developed as part of an academic course on Multi-Branch Hotel Reservation Management Systems.
