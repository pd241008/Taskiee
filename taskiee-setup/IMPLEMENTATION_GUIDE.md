# Taskiee Implementation Guide & Technical Overview

This document summarizes the core features and architectural changes implemented in the **Taskiee** Kanban board application.

---

## 1. User Story: Generate Reports & Analytics
**Overview**: A comprehensive reporting system that allows workspace admins to analyze productivity metrics and export them as professional documents.

### Key Components:
- **Reports Dashboard (`/reports`)**: A high-performance page featuring dynamic filters (Date, Project, Status).
- **MongoDB Aggregation Pipeline**: Uses the `$facet` operator to return summary counts (by Status and Priority) and a full task list in a single database round-trip.
- **PDF Export**: Integrated `html2pdf.js` for high-quality, client-side PDF generation that preserves the Neobrutalist styling.

---

## 2. Multi-Project Infrastructure (Phase 1)
**Overview**: The foundation for supporting separate project boards instead of a single global list.

### Key Changes:
- **Project Model**: Added a new schema for `Project` including `title`, `description`, `ownerId`, and `members`.
- **Task Schema Refactor**: Updated the `Task` model to include `priority` (Low, Medium, High) and a `projectId` reference.
- **Project API**: Implemented endpoints to list and create projects, ensuring tasks can be categorized correctly.

---

## 3. Mock User Registration & Authentication
**Overview**: A temporary, standalone authentication system to serve as a bridge before Auth0 integration.

### Implementation Details:
- **JSON Data Store**: For quick testing without complex DB migrations, user data is stored in `backend/data/users.json`.
- **Hybrid Auth Middleware**: An enhanced `requireAuth` middleware that checks both the legacy MongoDB `User` model AND the new `users.json` mock store. This ensures backward compatibility while allowing new mock users to access the system.
- **Auth Service**: Custom logic for registering new users and verifying credentials.
- **Frontend Flow**:
    - **Register (`/register`)**: Curated job titles dropdown and Neobrutalist input fields.
    - **Login (`/login`)**: Authorizes sessions and stores user data locally.
- **Smart SideBar**: Dynamically displays the logged-in user's name and job title with a logout option.

---

## 4. Design System: Neobrutalism
**Overview**: A strict adherence to the "Taskiee" aesthetic.

### Rules Applied:
- **High Contrast**: White/Neon borders on deep black backgrounds.
- **Hard Shadows**: Solid 6px offsets (no blur) using custom Tailwind utilities (e.g., `shadow-neo-purple`).
- **Typography**: Heavy usage of "Outfit" for displays and "JetBrains Mono" for technical details.
- **Vibrant Palette**: Utilization of `neo-purple`, `neo-cyan`, `neo-green`, and `neo-pink`.

---

## Technical Dependencies Added:
- **Backend**: `uuid`, `@types/uuid` (for ID generation in JSON store).
- **Frontend**: `html2pdf.js` (for PDF exports).
