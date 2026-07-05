# AGENTS.md

## System Overview

**Project:** CSE340 Final – Used Car Dealership

**System Purpose:** Coordinate AI-assisted development of a server-side rendered Used Car Dealership web application that allows customers to browse inventory, create accounts, leave reviews, submit service requests, and provides employees and owners with management dashboards.

**Architecture Type:** Supervisor-worker structure with shared repository context.

**Communication Protocol:** Agents should work from the repository files, project documentation, and clear task handoff notes. All work should preserve the MVC architecture and follow existing coding patterns.

---

# 1. Global Constraints and Rules

Every agent working in this repository should follow these rules:

1. **Preserve the MVC architecture.**
   - Keep Express + EJS + PostgreSQL + MVC organization intact.
   - Avoid unnecessary restructuring.

2. **Use the existing technology stack.**
   - Node.js
   - Express.js
   - PostgreSQL
   - EJS
   - Express Sessions
   - bcrypt
   - ESM Modules

3. **Maintain separation of concerns.**
   - Routes define endpoints.
   - Controllers contain business logic.
   - Models perform database operations.
   - Views only render presentation.

4. **Protect database integrity.**
   - Use parameterized PostgreSQL queries.
   - Document any schema modifications.
   - Avoid unnecessary migrations.

5. **Preserve authentication flow.**
   - Continue using express-session.
   - Never bypass middleware.
   - Passwords must always be hashed with bcrypt.

6. **Maintain responsive UI consistency.**
   - Continue using shared layouts and partials.
   - Reuse existing CSS architecture.
   - Avoid duplicate styling.

7. **Respect role permissions.**
   - Guest
   - Customer
   - Employee
   - Owner (Admin)

---

# 2. Agent Registry

- **Project Architect Agent**
- **Backend Engineer Agent**
- **Frontend/UI Agent**
- **Database Agent**
- **Authentication & Security Agent**
- **Dashboard Agent**
- **Quality Review Agent**

---

# 3. Detailed Agent Profiles

---

## Project Architect Agent

### Role

Maintains the overall project architecture and implementation roadmap.

### Responsibilities

- Review repository organization
- Plan new features
- Coordinate work between agents
- Maintain project documentation
- Ensure consistency across MVC layers

### Expected Input

```json
{
  "task": "Feature or planning request",
  "context": "Relevant files and requirements"
}
```

### Expected Output

```json
{
  "plan": "Implementation summary",
  "files": ["Relevant files"],
  "notes": "Architecture considerations"
}
```

### Trigger

Use whenever a new feature, large refactor, or architectural decision is introduced.

---

## Backend Engineer Agent

### Role

Implements all server-side application behavior.

### Responsibilities

- Build routes
- Implement controllers
- Connect models
- Handle validation
- Manage business logic
- Process service requests
- Manage reviews
- Handle contact forms

### Expected Input

```json
{
  "feature": "Backend feature",
  "requirements": [
    "Desired behaviors"
  ]
}
```

### Expected Output

```json
{
  "implemented": true,
  "filesChanged": [
    "src/routes",
    "src/controllers",
    "src/models"
  ],
  "summary": "Implementation overview"
}
```

### Trigger

Whenever server-side functionality must be implemented.

---

## Frontend/UI Agent

### Role

Maintains all customer-facing pages.

### Responsibilities

- EJS templates
- Layouts
- Partials
- Forms
- CSS updates
- Responsive design
- Dashboard views

### Expected Input

```json
{
  "page": "Target page",
  "requirements": [
    "UI updates"
  ]
}
```

### Expected Output

```json
{
  "updatedView": "Modified template",
  "summary": "Visual changes"
}
```

### Trigger

Use whenever pages or layouts require modification.

---

## Database Agent

### Role

Maintains PostgreSQL schema and data access.

### Responsibilities

- Database schema
- Queries
- Relationships
- Model functions
- Performance improvements

### Primary Tables

- users
- categories
- vehicles
- vehicle_images
- reviews
- service_requests
- contact_messages

### Expected Input

```json
{
  "entity": "Database table",
  "operations": [
    "CRUD operations"
  ]
}
```

### Expected Output

```json
{
  "queryPlan": "Implementation details",
  "filesUpdated": [
    "src/models"
  ],
  "notes": "Database considerations"
}
```

### Trigger

Use whenever data storage or retrieval changes.

---

## Authentication & Security Agent

### Role

Maintains authentication and application security.

### Responsibilities

- Login
- Registration
- Sessions
- Password hashing
- Authorization middleware
- Validation
- Route protection

### Protected Middleware

- checkLogin
- checkEmployee
- checkAdmin

### Security Requirements

- bcrypt hashing
- Parameterized SQL
- Input validation
- Sanitized inputs
- Session protection
- Friendly error handling

### Expected Input

```json
{
  "feature": "Authentication feature",
  "requirements": [
    "Security requirements"
  ]
}
```

### Expected Output

```json
{
  "status": "completed",
  "filesChanged": [
    "middleware",
    "controllers",
    "utilities"
  ]
}
```

### Trigger

Use whenever authentication or authorization changes.

---

## Dashboard Agent

### Role

Maintains employee and owner dashboards.

### Responsibilities

Customer Dashboard

- View reviews
- View service requests
- Edit profile

Employee Dashboard

- Manage inventory
- Moderate reviews
- Service requests
- Contact messages

Owner Dashboard

- User management
- Employee management
- Category management
- Vehicle management
- Statistics

### Expected Input

```json
{
  "dashboard": "Customer, Employee, or Owner",
  "feature": "Requested functionality"
}
```

### Expected Output

```json
{
  "implemented": true,
  "views": [
    "Updated dashboard pages"
  ]
}
```

### Trigger

Whenever dashboard functionality changes.

---

## Quality Review Agent

### Role

Verifies completed work.

### Responsibilities

- Check MVC consistency
- Verify routes
- Test dashboards
- Validate forms
- Confirm role permissions
- Review UI consistency
- Check database interactions

### Expected Input

```json
{
  "changes": [
    "Modified files"
  ],
  "goal": "Verification objective"
}
```

### Expected Output

```json
{
  "status": "pass",
  "findings": [
    "Issues or confirmations"
  ],
  "nextSteps": [
    "Recommended follow-up"
  ]
}
```

### Trigger

Run after every completed feature.

---

# 4. Repository Structure

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

# 5. Primary Domain Objects

## Users

Roles:

- Guest
- Customer
- Employee
- Owner

---

## Vehicles

Each vehicle includes:

- Make
- Model
- Year
- Mileage
- Price
- Description
- Availability
- Images
- Category

---

## Reviews

Customers can:

- Create
- Edit
- Delete their own reviews

Employees can:

- Moderate reviews

---

## Service Requests

Workflow:

```
Submitted
      ↓
In Progress
      ↓
Completed
```

Customers may view request history.

Employees manage status updates.

---

## Contact Messages

Guests submit messages.

Employees view them through the dashboard.

---

# 6. Standard Workflows

## New Feature Workflow

1. Project Architect defines scope.
2. Backend Engineer implements logic.
3. Database Agent updates models if needed.
4. Frontend/UI Agent builds interface.
5. Authentication Agent secures access.
6. Dashboard Agent updates dashboards if applicable.
7. Quality Review Agent validates implementation.

---

## Bug Fix Workflow

1. Architect identifies affected components.
2. Responsible implementation agent applies the smallest safe fix.
3. Quality Review verifies no regressions.

---

## Database Change Workflow

1. Database Agent proposes schema updates.
2. Backend Agent updates model logic.
3. Frontend Agent adjusts affected forms/views.
4. Quality Review validates data integrity.

---

# 7. Error Handling

Agents should:

- Request clarification when requirements are ambiguous.
- Avoid assumptions.
- Document blockers clearly.
- Leave descriptive handoff notes if work cannot be completed.
- Minimize disruption to existing functionality.

---

# 8. Coding Standards

- Prefer reusable components.
- Keep controllers concise.
- Avoid duplicated SQL.
- Keep business logic out of views.
- Follow existing naming conventions.
- Use async/await consistently.
- Validate all user input.
- Return friendly error messages.
- Maintain readable, well-documented code.

---

# 9. Success Criteria

The completed application should include:

- MVC architecture
- PostgreSQL relational database
- Server-side rendering with EJS
- Session authentication
- Role-based authorization
- Dynamic vehicle inventory
- Vehicle detail pages
- Customer reviews
- Service request workflow
- Employee dashboard
- Owner dashboard
- Contact form
- Input validation
- Security best practices
- Responsive UI
- Successful Render deployment
- Comprehensive project documentation