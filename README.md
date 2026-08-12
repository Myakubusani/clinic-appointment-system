# 🏥 ClinicCare – Clinic Appointment System

ClinicCare is a full-stack clinic appointment management system designed to reduce long waiting times and make it easier for patients to book and manage medical appointments.

The system provides separate experiences for patients, doctors, and administrators, allowing appointments to be booked, managed, approved, rejected, and monitored through a centralized platform.

---

## 📌 Project Overview

Traditional clinic appointment processes can require patients to wait in long queues before seeing a doctor.

ClinicCare provides a digital appointment-booking solution where patients can:

- Create an account
- Log in securely
- View their profile
- Book appointments with doctors
- Select an appointment date and time
- Provide a reason for their visit
- View their appointments
- Track appointment status

Administrators can:

- Log in securely
- Manage patients
- Manage doctors
- Manage appointments
- Approve or reject appointments
- Manage medical records
- Monitor the clinic system through an admin dashboard

The application also includes an in-app notification system for appointment-related updates.

---

## 🎯 Problem Statement

Patients in busy clinics often experience long queues and uncertainty about appointment availability.

ClinicCare addresses this problem by providing an online appointment system that allows patients to schedule appointments before visiting the clinic.

This helps:

- Reduce physical queues
- Improve appointment organization
- Improve communication between patients and clinic staff
- Make appointment management easier
- Provide patients with visibility into their appointment status

---

## ✨ Features

### 👤 Patient Features

- Patient registration
- Secure patient login
- Patient dashboard
- Patient profile information
- Book appointments
- Select doctor
- Select appointment date
- Select appointment time
- Add reason for appointment
- View upcoming appointments
- View previous appointments
- View appointment status
- Appointment approval/rejection notifications
- Medical records section
- Logout functionality

### 🛡️ Admin Features

- Secure admin login
- Admin dashboard
- Manage patients
- Manage doctors
- Manage appointments
- View appointment details
- Approve appointments
- Reject appointments
- Update appointment status
- Manage medical records
- Appointment notifications
- Responsive sidebar navigation

### 👨‍⚕️ Doctor Features

- Doctor authentication
- Doctor dashboard
- View assigned appointments
- Receive appointment notifications
- Manage appointment-related information

### 🔔 Notification System

ClinicCare includes an internal notification system that allows users to receive appointment-related updates.

Examples include:

- Appointment booked
- Appointment approved
- Appointment rejected
- New appointment notification for doctors

> Email notifications are currently an optional feature. The application uses Resend for email integration, but production email delivery to arbitrary recipient addresses requires a verified sending domain.

---

## 🛠️ Technologies Used

### Frontend

- React
- Vite
- JavaScript
- Bootstrap 5
- React Router
- Axios
- React Toastify
- Recharts
- Chart.js
- FullCalendar
- jsPDF
- jsPDF AutoTable

### Backend

- Node.js
- Express.js
- SQLite
- REST API
- JWT Authentication
- bcrypt
- CORS

### Email

- Resend API

### Deployment

- Vercel – Frontend
- Render – Backend/API
- GitHub – Source Code & Version Control

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Patient        │
                    │      Browser        │
                    └──────────┬──────────┘
                               │
                               │
                    ┌──────────▼──────────┐
                    │   React Frontend    │
                    │      (Vite)         │
                    └──────────┬──────────┘
                               │
                         Axios / REST API
                               │
                    ┌──────────▼──────────┐
                    │   Express Backend   │
                    │      (Node.js)      │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │      SQLite DB      │
                    └─────────────────────┘