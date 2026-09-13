# Transaction Tracking System

College project built with:

- Vite + React
- Tailwind CSS
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication

## 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```

Set `MONGO_URI` and `JWT_SECRET` inside `server/.env`.

## 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Admin user

Register a normal account first, then update the user's `role` in MongoDB:

```json
{
  "role": "admin"
}
```

Then log out and log in again.

## Main features

- Register/Login
- JWT-protected routes
- Transaction CRUD
- Search/filter
- Dashboard summary
- 6-month chart
- Categories
- Monthly budget
- Reports
- Admin dashboard
- User block/unblock
- Activity logs
