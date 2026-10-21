# Inventory Management App

A full-stack inventory management app for tracking products, stock quantities, and low-stock items. This project demonstrates a React frontend, an Express API, input validation, and persistent SQLite storage.

## Features

- View, add, edit, and delete products
- Search products by name or SKU
- Filter by category and stock status
- See a restock alert for products with a quantity of 1–5
- Keep product data in a local SQLite database

## Technology

| Area | Tools |
| --- | --- |
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Database | SQLite with better-sqlite3 |

## Run locally on Windows

Install Node.js 20 or newer. Open two PowerShell windows in the project folder.

In the first window, start the backend:

```powershell
cd backend
npm install
npm start
```

In the second window, start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the local address printed by Vite (normally `http://localhost:5173`). The backend listens on `http://localhost:3001`; the frontend forwards API requests to it during development.

The SQLite database is created as `backend/inventory.db` when the backend starts. Database files are intentionally excluded from Git so local inventory data is not published with the source code.

## Project status

The core portfolio scope is complete: product management, search and filters, stock alerts, and persistent local storage. The next milestone is to publish the source on GitHub and provide a live demo. No additional app features are planned for this version.

## Author

Built by [Ahmed Samy](https://github.com/AhmeddSamii21)

