# Lost and Found — Local development

This repository contains a Vite + React frontend and a Node + Express backend (server) using SQLite.

Quick start (PowerShell)

1. Install dependencies

```powershell
cd project
npm install
cd server
npm install
```
If any issues found check the working directory by using pwd(command) and then chage it to project directory
2. Start both frontend and backend in one command

```powershell
# from project/
npm run dev:all
```

This runs the backend (`npm run dev` in `server/`) and the Vite dev server together. Frontend will be at `http://localhost:5173` and backend at `http://localhost:5000`.

3. Database

The server uses SQLite at `server/dev.sqlite3` and migrations are available in `server/src/data/migrations`.

To run migrations:

```powershell
cd project/server
npx knex migrate:latest --knexfile ./knexfile.js
```

Notes

- The frontend uses a small fetch-based client in `src/apiClient.ts` pointing to `http://localhost:5000/api`.
- Supabase references have been removed; the app is self-contained locally.


