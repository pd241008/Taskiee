# Taskiee: Architecture & RBAC Protocol

Welcome to the **Taskiee** technical breakdown. This document serves as a premium reference for understanding the project's architecture, data models, and the "User" entity's role within the system.

---

## 🏗️ System Architecture

Taskiee is built using a modern **Fullstack TypeScript** stack, prioritizing type safety and a robust Role-Based Access Control (RBAC) system.

- **Frontend**: Next.js 15 (App Router) + TailwindCSS (Neobrutalist Design).
- **Backend**: Node.js + Express + MongoDB (Mongoose).
- **Communication**: RESTful API with simulated header-based authentication.

---

## 👤 The "User" Concept

### What is a User?
In Taskiee, a **User** is the primary agent of action. Every activity—creating tasks, assigning members, or reviewing work—is anchored to a User identity.

### Where is it used?
Users are referenced throughout the lifecycle of a task and dictate the UI/UX based on their **Access Level**.

### 🛠️ Code Snippet: User Model (Backend)
Located in `./backend/src/models/users.ts`, the User model defines the identity and permissions:

```typescript
export interface IUser extends Document {
  name: string;
  email: string;
  jobTitle: string; // e.g., 'President', 'Tech Lead'
  accessLevel: "PRESIDENT" | "ADMIN" | "USER"; 
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accessLevel: { 
    type: String, 
    enum: ["PRESIDENT", "ADMIN", "USER"], 
    default: "USER" 
  },
});
```

---

## 🔐 Role-Based Access Control (RBAC)

Taskiee implements a strict hierarchy to ensure data integrity and security.

| Role | Description | Permissions |
| :--- | :--- | :--- |
| **PRESIDENT** | The Superuser | Full system control, including managing ADMINS. |
| **ADMIN** | The Manager | Can create tasks, view all tasks, and manage USERS. |
| **USER** | The Executor | Can view assigned tasks and update their own task status. |

### 🛠️ Code Snippet: Auth Middleware
Located in `./backend/src/middleware/auth_middleware.ts`, this logic enforces permissions during API calls:

```typescript
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && (req.user.accessLevel === "ADMIN" || req.user.accessLevel === "PRESIDENT")) {
    next();
  } else {
    res.status(403).json({ error: "Forbidden: Admin access required" });
  }
};
```

---

## 📋 Task Management

### The Task Lifecycle
Tasks are the "work units" of the system. They move through a predefined state machine:
`Pending` ➔ `Backlog` ➔ `Todo` ➔ `In Progress` ➔ `In Review` ➔ `Done` or `Blocked`.

### 🛠️ Code Snippet: Task Model
Located in `./backend/src/models/tasks.ts`, tasks link tightly to Users:

```typescript
export interface ITask extends Document {
  title: string;
  assignedTo: mongoose.Types.ObjectId; // Reference to User
  createdBy: mongoose.Types.ObjectId;  // Reference to Admin/President
  status: "Pending" | "In Progress" | "Done" | ...;
  reviewNotes?: string;
}
```

---

## 💻 Frontend Integration

The frontend maintains a "Current User" state, retrieved from environment variables for development and passed via the `x-user-id` header to all API requests.

### 🛠️ Code Snippet: API Header Integration
Example from `./frontend/app/dashboard/page.tsx`:

```typescript
const CURRENT_USER_ID = process.env.NEXT_PUBLIC_CURRENT_USER_ID;

const response = await fetch(`${API_URL}/api/tasks`, {
  headers: { "x-user-id": CURRENT_USER_ID },
});
```

---

## 🎨 Design Philosophy: Neobrutalism
Taskiee uses a **Premium Neobrutalist** aesthetic:
- **High Contrast**: Sharp borders (4px - 8px) and bold shadows.
- **Vibrant Palettes**: Functional use of colors (Purple for primary, Cyan for info, Green for success).
- **Typography**: Heavy, uppercase headers for a "strong" engineering feel.

---

> [!WARNING]
> **Local Development Note**: Avoid using the project through **SRM WIFI** as it may cause issues where the local MongoDB does not load correctly. For stable performance, ensure your MongoDB instance is running independently and accessible via the standard connection string.

> [!TIP]
> This documentation is located in your project root and can be shared to demonstrate the architectural integrity of Taskiee.
