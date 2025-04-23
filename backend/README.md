# Query Management System

## Overview
A MERN stack app with Ant Design UI for managing customer queries. It supports CRUD operations, note management, invoice line item notes, and Gemini AI-powered summaries.

## Features
- Create, view, update, and delete queries
- Attach and manage notes per query
- Add notes to invoice line items
- AI-generated summaries using Gemini
- Filtering and sorting queries
- Built with React, Node.js, Express, MongoDB, Ant Design

## API Endpoints

### Query
- **POST /api/queries** – Create a query  
  Body: `{ customerName, description, status }`
- **GET /api/queries** – Get all queries
- **GET /api/queries/:id** – Get query by ID
- **PUT /api/queries/:id** – Update query  
  Body: `{ customerName, description, status }`
- **DELETE /api/queries/:id** – Delete query

### Notes
- **GET /api/queries/:id/notes** – Get notes for a query

### Invoice Notes
- **POST /api/invoices/:invoiceId/line-items/:itemId/note** – Add note to invoice item  
  Body: `{ note }`
- **GET /api/invoices/:invoiceId/line-items/:itemId/note** – Get note for invoice item

### Gemini AI
- **GET /api/queries/:id/summary** – AI summary of a query

## Tech Stack
- Frontend: React.js, Ant Design
- Backend: Node.js, Express.js
- DB: MongoDB
- AI: Gemini API

## Getting Started
```bash
git clone https://github.com/your-username/idurar-erp-crm.git
cd idurar-erp-crm
npm install
npm start

# Query Management System – Frontend

## Overview
This is the React.js frontend for the Query Management System. It provides an intuitive UI for managing customer queries, notes, invoice line item notes, and viewing Gemini AI-powered summaries.

## Features
- Responsive UI with **Ant Design**
- Query CRUD operations (Create, Read, Update, Delete)
- View and manage query notes in a Drawer/Modal
- Add and view invoice line item notes
- Generate AI summaries using Gemini
- Integrated loading skeletons and UI animations
- State management with React Query or Zustand

## Tech Stack
- React.js (v18+)
- Ant Design (UI components)
- Axios (API calls)
- React Router (Navigation)
- Zustand / React Query (State & caching)
- Framer Motion (Animations)

## Available Scripts
In the project directory, you can run:
### `npm install`

Installs dependencies.
### `npm run dev`
Runs the app in development mode at `http://localhost:3000`.