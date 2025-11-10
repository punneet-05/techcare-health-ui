# techcare-health-ui Patient Dashboard

A modern, responsive dashboard for viewing patient health data, built as part of a frontend assignment.

## Features
- Fetches real-time patient vitals (BP, heart rate, etc.) via API.
- Displays diagnosis history, lab results, and diagnostics.
- Interactive chart for blood pressure trends using Chart.js.
- Sidebar navigation and patient selector.

## Tech Stack
- HTML5 & CSS3 (with custom variables for theming).
- Vanilla JavaScript for API calls and DOM manipulation.
- Chart.js for visualizations.
- Responsive design (mobile-friendly).

## Setup
1. Clone the repo: `git clone https://github.com/yourusername/patient-dashboard.git`
2. Open `index.html` in a browser.
3. Data auto-loads from the test API (no setup needed).

## API Integration
Uses Basic Auth to fetch JSON data from `https://fedskillstest.coalitiontechnologies.workers.dev`.
Hardcoded for demo; in production, use environment variables.
