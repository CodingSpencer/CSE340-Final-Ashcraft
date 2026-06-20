# 🚗 Used Car Dealership Final Project Plan
**CSE 340 Final Project**

## Project Overview

Create a **server-side rendered Used Car Dealership website** that allows customers to browse vehicles, submit service requests, leave reviews, and contact the dealership while providing employees and owners with management dashboards.

The project will be built using:

- Node.js
- Express.js
- PostgreSQL
- EJS
- Express Sessions
- bcrypt
- ESM Modules
- Render Deployment

---

# Project Structure

```
/public
    /css
        /base
        /components
        /layout
        /tokens
        /utilities
        main.css
/src
    /controllers
    /database
    /middleware
    /models
    /routes
    /utilities
    /views
        /partials
        /layouts
        /account
        /vehicles
        /dashboard
server.js
package.json
```

---

# User Roles

## Guest

Can:

- View homepage
- Browse inventory
- View vehicle details
- Submit contact form
- Register
- Login

Cannot:

- Leave reviews
- Submit service requests
- Access dashboards

---

## Customer

Can:

- Everything guests can
- Leave reviews
- Edit own reviews
- Delete own reviews
- Submit service requests
- View service request history
- View account dashboard

---

## Employee

Can:

- Manage vehicle details
- Change availability
- Update pricing
- Moderate reviews
- Manage service requests
- Add technician notes
- View contact messages

Cannot:

- Delete categories
- Add categories
- Manage owner accounts

---

## Owner (Admin)

Can:

- Everything employees can
- Add/Edit/Delete vehicles
- Add/Edit/Delete categories
- Manage employees
- View all users
- View dealership statistics

---

# Database Design

## users

| Field | Type |
|------------|------------|
| user_id | SERIAL PK |
| firstname | VARCHAR |
| lastname | VARCHAR |
| email | VARCHAR UNIQUE |
| password | TEXT |
| role | VARCHAR |
| created_at | TIMESTAMP |

---

## categories

| Field | Type |
|------------|------------|
| category_id | SERIAL PK |
| category_name | VARCHAR |

Examples:

- Cars
- Trucks
- SUVs
- Vans

---

## vehicles

| Field | Type |
|------------|------------|
| vehicle_id | SERIAL PK |
| category_id | FK |
| make | VARCHAR |
| model | VARCHAR |
| year | INT |
| mileage | INT |
| price | NUMERIC |
| description | TEXT |
| availability | BOOLEAN |

---

## vehicle_images

| Field | Type |
|------------|------------|
| image_id | SERIAL PK |
| vehicle_id | FK |
| image_path | TEXT |

One vehicle can have many images.

---

## reviews

| Field | Type |
|------------|------------|
| review_id | SERIAL PK |
| user_id | FK |
| vehicle_id | FK |
| rating | INT |
| review_text | TEXT |
| created_at | TIMESTAMP |

---

## service_requests

| Field | Type |
|------------|------------|
| request_id | SERIAL PK |
| user_id | FK |
| vehicle_id | FK |
| service_type | VARCHAR |
| notes | TEXT |
| status | VARCHAR |
| employee_notes | TEXT |
| created_at | TIMESTAMP |

Status values:

- Submitted
- In Progress
- Completed

---

## contact_messages

| Field | Type |
|------------|------------|
| message_id | SERIAL PK |
| firstname | VARCHAR |
| lastname | VARCHAR |
| email | VARCHAR |
| message | TEXT |
| created_at | TIMESTAMP |

---

# ER Diagram

```
Users
  │
  ├──────────────┐
  │              │
Reviews      Service Requests
  │              │
  │              │
Vehicles─────────┘
  │
  │
Vehicle Images
  │
Categories
```

---

# MVC Organization

## Models

- accountModel.js
- vehicleModel.js
- categoryModel.js
- reviewModel.js
- serviceModel.js
- contactModel.js

Responsible for database queries.

---

## Controllers

- accountController.js
- inventoryController.js
- reviewController.js
- serviceController.js
- contactController.js
- dashboardController.js

Responsible for application logic.

---

## Routes

```
/

/inventory

/inventory/:vehicleId

/account/login

/account/register

/account/dashboard

/review/add

/review/edit/:id

/service/new

/service/history

/dashboard

/dashboard/inventory

/dashboard/reviews

/dashboard/services

/dashboard/messages

/admin/categories

/admin/users
```

---

# Public Pages

- Home
- Browse Inventory
- Vehicle Details
- Contact Us
- Login
- Register

---

# Customer Dashboard

Shows:

- Welcome message
- My Reviews
- My Service Requests
- Request New Service
- Edit Profile
- Logout

---

# Employee Dashboard

Shows:

- Vehicle Inventory
- Edit Vehicle
- Manage Reviews
- Manage Service Requests
- Contact Messages

---

# Owner Dashboard

Shows:

- Everything Employee sees
- Categories
- Add Vehicle
- Delete Vehicle
- User Management
- Employee Management
- System Statistics

---

# Authentication

Use:

- express-session
- bcrypt

Protected middleware:

```
checkLogin
checkEmployee
checkAdmin
```

Session stores:

- user_id
- firstname
- role

---

# Validation

Validate:

- Registration
- Login
- Vehicle Forms
- Reviews
- Service Requests
- Contact Form

Prevent:

- Empty fields
- Invalid email
- SQL Injection
- XSS
- Bad ratings

---

# Security

- Parameterized PostgreSQL queries
- bcrypt password hashing
- express-session
- Protected routes
- Sanitized inputs
- Friendly error pages
- Global error handler

---

# Multi-Stage Workflow

Customer:

```
Submit Service Request
        ↓
Submitted
        ↓
Employee Opens
        ↓
In Progress
        ↓
Employee Completes
        ↓
Completed
```

Customer can always see status history.

---

# Review Workflow

Customer:

```
Vehicle
    ↓
Leave Review
    ↓
Stored in Database
    ↓
Displayed on Vehicle Page
```

Employee:

```
Review
    ↓
Delete if inappropriate
```

---

# Contact Workflow

Guest:

```
Submit Contact Form
        ↓
Saved to Database
        ↓
Employee Dashboard
        ↓
Viewed by Staff
```

---

# Deployment Checklist

- PostgreSQL running
- Environment variables configured
- Sessions working
- Password hashing working
- Render deployment working
- Database connected
- Production environment variables set
- No localhost URLs

---

# README Checklist

Include:

- Project description
- ER Diagram image
- User roles explanation
- Test account emails
- Password: `P@$$w0rd!`
- Known limitations
- Render URL
- GitHub URL

---

# Git Commit Plan

1. Initial project setup
2. PostgreSQL connection
3. Create database tables
4. Authentication
5. Registration/Login
6. Sessions
7. Inventory pages
8. Vehicle details
9. Reviews
10. Service requests
11. Contact form
12. Employee dashboard
13. Owner dashboard
14. Validation and security
15. Deployment fixes
16. README and cleanup

---

# Stretch Goals

- Vehicle search
- Sorting by price
- Filter by category
- Favorite vehicles
- Pagination
- Multiple vehicle images carousel
- Upload images instead of URLs
- Dashboard charts
- Recently viewed vehicles
- Dark mode

---

# Success Criteria

- ✅ Three user roles
- ✅ Session authentication
- ✅ PostgreSQL relational database
- ✅ MVC architecture
- ✅ Server-side rendering with EJS
- ✅ Dynamic inventory
- ✅ User reviews
- ✅ Service request workflow
- ✅ Admin dashboard
- ✅ Validation and security
- ✅ Render deployment
- ✅ Complete README
- ✅ At least 15 meaningful commits
