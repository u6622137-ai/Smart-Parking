# SmartPark — University Parking Reservation & Analytics

## Team Members
- Zaw Lin Aung 
- Nyi Min Htet 

## Project Description
SmartPark is a university parking reservation system built with Next.js and MongoDB. Users can browse parking areas and reserve a parking area for a time period. Admins can manage parking areas and view reservations. The system also provides analytics such as the most reserved parking area and peak reservation hour.

## Tech Stack
- Frontend: Next.js (App Router)
- Backend: Next.js REST API routes
- Database: MongoDB
- Deployment: Azure VM (Ubuntu) + Nginx + PM2

## Production URL
- http://20.195.26.45

## Screenshots

### Azure VM (Running)
![Azure VM](public/screenshots/azure-vm.png)

### Student Dashboard
![Student Dashboard](public/screenshots/student-dashboard.png)

### Parking Availability
![Availability](public/screenshots/availability.png)

### Admin Dashboard
![Admin Dashboard](public/screenshots/admin-dashboard.png)

### Admin - Users
![Users](public/screenshots/users.png)

### Admin - Parking Zones
![Zones](public/screenshots/zones.png)

### Admin - Parking Slots
![Slots](public/screenshots/slots.png)

### Admin - Reservations
![Reservations](public/screenshots/reservations.png)

## Video Demo
https://youtu.be/rSyGB-BREpM

## Features
### Authentication & Authorization
- User registration
- Secure login with JWT
- Role-based access control (User / Admin)
- Protected API routes

### 👤 User Features
- Browse parking zones
- View available parking slots
- Create reservation (time-based booking)
- Prevent over-booking with capacity validation
- View own reservations

---

### 👑 Admin Features
- Full CRUD for Parking Zones
- Full CRUD for Parking Slots
- View all reservations
- Manage users
- Analytics dashboard with:
  - Most reserved parking zone
  - Peak reservation hour
  - Total reservations
  - Slot utilization overview

---

### 📊 Analytics
- Aggregation-based statistics from MongoDB
- Dashboard visualization
- Real-time reservation insights

---

### ☁️ Cloud & DevOps
- Deployed on Azure Virtual Machine
- Reverse proxy with Nginx
- Process management with PM2
- Production-ready configuration

### User
- View parking areas
- Create reservation (time-based)
- Capacity validation (prevents over-booking)

### Admin
- CRUD Parking Areas
- View reservations (API)
- Analytics dashboard:
  - Most reserved parking area
  - Peak reservation hour
  - Total reservations

## Data Models (3 CRUD Entities)
1. User
2. ParkingArea (Zone/Slot)
3. Reservation

## REST API Endpoints

### Areas
- GET `/api/areas` (Mapped to `/api/zones`)
- POST `/api/areas`
- GET `/api/areas/:id`
- PUT `/api/areas/:id`
- DELETE `/api/areas/:id`

### Reservations
- GET `/api/reservations`
- POST `/api/reservations`
- DELETE `/api/reservations/:id` (cancel)

### Users + Login
- POST `/api/users` (register)
- GET `/api/users` (list)
- POST `/api/login` (login -> JWT)

### Analytics
- GET `/api/analytics` (Mapped to `/api/admin/dashboard`)

## UI Pages
- `/` (home)
- `/areas` (user)
- `/admin/areas` (admin CRUD)
- `/admin/dashboard` (analytics)

## How to Run Locally
1) Install Node.js 20+
2) Start MongoDB locally (or via Docker)
3) Create `.env.local`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/smartpark
JWT_SECRET=smartpark_secret_change_me
```

4) Install dependencies:
```bash
npm install
```

5) Run the development server:
```bash
npm run dev
```
