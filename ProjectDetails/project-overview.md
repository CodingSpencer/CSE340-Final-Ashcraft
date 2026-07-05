# Project Overview

**Project:** CSE340 Final Ashcraft

**Last Updated:** 2026-07-05

**Current Status:** Development / Initial scaffold

**Primary Goal:** Build a web application for a vehicle service business that lets customers interact with the company, view services, submit contact requests, and gives staff or owners a dashboard to manage activity.

---

## 1. Project Summary

This project is a Node.js web application built with Express and EJS. The application is organized around a service-business workflow and includes areas for:

- customer-facing pages and content
- account-related routes
- service and inventory management concepts
- reviews and contact forms
- admin, employee, and owner dashboard views

The project is intended for coursework and for demonstrating a full-stack web app structure in a modular MVC-style layout.

---

## 2. Tech Stack

- **Frontend:** HTML, CSS, EJS templates, partials, and static assets in the public folder
- **Backend:** Node.js with Express
- **Database:** PostgreSQL via the pg package
- **Session Handling:** express-session
- **Security:** bcrypt for password hashing
- **Developer Tools:** Nodemon for live development reloads

---

## 3. Project Structure

- **src/** — Application source code
  - **controllers/** — Request handlers for each feature area
  - **models/** — Data access and model definitions
  - **routes/** — Route declarations for pages and API-style endpoints
  - **views/** — EJS templates, layouts, and partials
  - **config/** — Database and session configuration
- **public/** — Static CSS, images, and other client assets
- **ProjectDetails/** — Project documentation and agent guidance
- **server.js** — Application entry point

---

## 4. Important Files

| File | Purpose |
|------|---------|
| README.md | Repository overview and startup information |
| server.js | Main server entry point |
| package.json | Scripts, dependencies, and project metadata |
| src/routes/ | Route organization for major features |
| src/controllers/ | Feature-specific request handling |
| src/models/ | Data-layer logic for the app |
| src/views/ | User-facing templates and shared page layout |
| public/css/ | Styling and theme assets |

---

## 5. Current Progress

### Completed

- Repository structure has been created with the expected folders for routes, controllers, models, views, and public assets.
- Basic Express app entry point and project dependencies are present.
- Documentation files for project guidance have been scaffolded.

### In Progress

- Route/controller/model wiring for several feature areas.
- View templates and shared layout integration.
- Database connection and persistence logic.

### Planned

- Full account and authentication flow.
- Dashboard pages for employee, owner, and customer roles.
- Inventory and service management functionality.
- Review and contact form submissions.

---

## 6. Known Issues

### High Priority

- Several route, controller, and model files are still empty placeholders.
- The main server file is currently a minimal scaffold and does not yet wire the full application together.
- The home page template appears to contain a malformed stylesheet tag and needs cleanup.

### Medium Priority

- Database configuration and schema integration are not yet fully implemented.
- Many views and partials are still in the early stages of development.

### Low Priority

- Documentation could be expanded as features are completed.
- Some project metadata, such as descriptions and authorship, remain generic.

---

## 7. Next Steps

1. Connect the Express app to the route modules and set up the main view rendering flow.
2. Implement the core account and dashboard features.
3. Build out the service, inventory, review, and contact modules.
4. Add database connectivity and persistence for the main entities.
5. Refine templates and styling so the app is usable and consistent.

---

## 8. Development Guidelines

- Keep the project organized by feature and follow the existing MVC-style separation.
- Prefer clear route-to-controller-to-model flow for new functionality.
- Reuse shared EJS partials instead of duplicating layout code.
- Keep styling updates consistent with the established CSS structure in the public folder.
- Document meaningful implementation decisions when adding new features.

---

## 9. Additional Notes

This repository is a strong starting point for a full-featured service-business application. As development continues, the project should evolve from its current scaffold into a complete experience with working routes, real data handling, and polished user interfaces.