# Inventory Management Web App

A web application that helps small businesses track their stock: products,
quantities, purchase prices, and low-stock alerts.

Built as a portfolio project to demonstrate full-stack web development skills.

## Tech Stack

| Layer    | Technology                     | What it does                        |
| -------- | ------------------------------ | ----------------------------------- |
| Frontend | React + Vite                   | The web pages the user sees and clicks |
| Backend  | Node.js + Express              | The server that handles requests    |
| Database | SQLite (via better-sqlite3)    | Stores products as a single file    |

## Project Structure

```
Inventory-Portfolio/
├── frontend/   ← React app (the "face" of the site)
├── backend/    ← Express server + SQLite database (the "engine")
└── README.md   ← This file
```

## How to Run (Development Mode)

You need Node.js (v20 or newer) installed first.

**1. Start the backend** (in a terminal):

```bash
cd backend
npm install      # first time only
npm start        # runs http://localhost:3001
```

**2. Start the frontend** (in a second terminal):

```bash
cd frontend
npm install      # first time only
npm run dev      # runs http://localhost:5173
```

## Roadmap

- [ ] Project setup (this part!)
- [ ] Products table + basic listing
- [ ] Add / edit / delete products
- [ ] Search and filtering
- [ ] Low-stock alerts
- [ ] Simple dashboard
- [ ] Deploy live (so the link can go on a résumé)

## Author

Built by [Your Name] — [ GitHub profile link here ]
