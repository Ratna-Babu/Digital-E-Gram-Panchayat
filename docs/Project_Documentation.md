# Digital E-Gram Panchayat — Project Documentation

Version: 1.0

Author: Project contributors (see repository `LICENSE` and `CONTRIBUTING.md`)

Date: 2025-10-26

## Table of Contents

This document is arranged as a single, comprehensive reference rather than a list of terse headings. It opens with an introduction that summarizes the purpose, scope and intended audience of the Digital E‑Gram Panchayat project. The analysis section presents the problem statement, target users and personas, and a set of use cases and functional and non‑functional requirements that guided the design. The design section explains the high‑level architecture, chosen technology stack, and the data model and component responsibilities, plus guidance on UI/UX and navigation.

Implementation details follow with a readable file‑by‑file overview, deeper code walkthroughs for core modules (authentication, protected routes, data access), and notes on styling and conventions (Tailwind). The installation and setup chapter provides system requirements, a step‑by‑step local setup and Firebase configuration for both client and admin contexts, and environment management suggestions for development and production.

3.  Backups and recovery

Testing and quality assurance guidance provides patterns for unit, integration and end‑to‑end testing, test case examples and a suggested matrix for acceptance criteria. Deployment and operations guidance outlines production hardening, hosting options, and a CI/CD example to automate builds, tests and deployments. The maintenance section discusses logging, monitoring, backups and recovery, retention and governance. The document closes with proposed future enhancements, contribution guidance, and multiple appendices with the database schema, example payloads, important code snippets and a changelog.

Throughout the document you will find prose explanations, example code snippets and step‑by‑step procedures designed to be pasted into Word or converted to a `.docx` for printing or distribution.

12. Future Enhancements

13. Contribution Guide

14. Appendices
15. Database schema (detailed)
16. Sample JSON payloads
17. Important files and snippets
18. Changelog

---

## 1. Introduction

### 1.1 Project overview

Digital E-Gram Panchayat is a React-based web application designed to provide an electronic municipal/gram panchayat service portal. It allows users (residents) to submit service applications (requests), check the status of applications, and interact with administrative staff. The repository contains a front-end React application that uses Firebase for authentication, data storage (Firestore), and server-side administration via firebase-admin.

The application follows role-based access: visitors, authenticated users, staff members, and administrators. Features include registration, login, service application submission, application status tracking, administrative review and acceptance, role management, and database setup utilities.

### 1.2 Purpose and audience

This document is written for multiple roles who will interact with the Digital E‑Gram Panchayat project. Developers should find architectural context, coding conventions and implementation details that make it straightforward to maintain and extend the application. Administrators will find deployment guidance, Firebase configuration steps and operational notes necessary to run the system in production. Testers are provided with suggested unit, integration and end‑to‑end test cases along with a test matrix and acceptance criteria. Contributors and reviewers will see the contribution guidance and changelog entries outlining how to propose and merge changes.

### 1.3 Goals and scope

The primary goals of this project are to deliver a clear and maintainable codebase that models municipal workflows, to implement secure authentication and role‑based access control, to expose straightforward administrative tools for defining and managing services, and to provide staff with efficient interfaces for reviewing and processing user applications. For the initial release the scope intentionally excludes extensive offline‑first capabilities, full multilingual user interfaces beyond basic readiness, and native mobile applications; these are flagged as future enhancements so the initial delivery can focus on a secure, functional web portal and solid operational practices.

### 1.4 Terminology

For clarity throughout this document: a "User" refers to a registered resident who uses the portal to submit requests; "Staff" are internal reviewers and processors who handle submitted applications; "Admin" denotes a privileged operator who defines services, configures roles and oversees the system; an "Application" is a user‑submitted request for a municipal service; and a "Service" denotes a definable application type such as a birth certificate, residence certificate, or other municipal offering.

## 2. Analysis

### 2.1 Problem statement

Local governments and panchayats often rely on manual paperwork for service requests. This project aims to digitize the process, reduce waiting time, provide clear application statuses, and centralize administrative workflows.

### 2.2 Target users and personas

The system is designed around three core personas. The resident (or rural user) is typically less technical and primarily needs an intuitive, low‑friction way to discover services, submit applications and check status updates. Staff members are operational users who review submissions, request clarifications, add internal comments and update application lifecycle states. Administrators are responsible for defining service types, configuring required fields and documents, managing user roles and overseeing system health and governance. Designing for these personas guided UX choices, access control, and the data model used by the application.

### 2.3 Use cases and user stories

Typical user stories encapsulate the main flows we expect to support: residents must be able to register and authenticate so they can submit requests and track their progress; residents must also be able to complete service‑specific forms and attach required documents as part of a submission. Staff members need filtered and searchable lists of applications, the ability to review attachments, add internal notes and update the application status. Administrators need to create, edit and retire service types and manage staff permissions so the operational policies of the panchayat can be enforced through the system.

### 2.4 Functional requirements

The application must support a set of core functional capabilities. Users need to be able to register and log in, and the system must implement role‑based access control so that different user types see only the features appropriate to them. Administrators must be able to create and manage service definitions, including the required fields and document checklists. Residents must be able to submit service applications with attachments and then track the status of those applications through a defined lifecycle. Finally, administrators and staff require dashboards that surface users, applications and operational metrics to manage daily work.

Non‑functional requirements focus on security, UX and maintainability. Authentication and data access must be enforced securely both on the client and in Firestore rules. The UI must be responsive and compatible with modern browsers to support a wide range of devices. Read and write patterns to Firestore should be designed with performance and scalability in mind, using proper indexing for common queries. The codebase should remain extensible with separated concerns so future features and refactors are low‑risk.

## 3. Design

### 3.1 High-level architecture

At a high level, the project is a single-page application (SPA) built with React. It uses Firebase services for authentication and Firestore as the primary database. An admin utility uses the firebase-admin SDK for privileged server-side tasks.

Component boundaries describe how responsibilities are separated across the app: the presentation layer is implemented with React components styled using Tailwind CSS, state and authentication context are managed centrally through an `AuthContext`, common data access responsibilities are delegated to a service layer implemented in `services/dataService.js`, and administrative tooling (scripts and privileged pages) are kept under `config/firebaseAdmin.js` and the `src/components/admin/` folder.

### 3.2 Technology stack

The project uses React for the frontend (Create React App or a similar tooling baseline), Firebase Authentication for user identity (email/password and potential OAuth providers), and Firestore as the primary document database. Administrative scripts and trusted operations use the `firebase-admin` SDK. Styling is implemented with Tailwind CSS and the codebase is written in modern JavaScript (ES6+) with JSX for components.

### 3.3 Data model and database structure

The data model centers on a few Firestore collections. Each user has a `users` document keyed by `uid` that stores personal details and a `roles` array. Service definitions live in a `services` collection and include metadata such as name, description, required documents, fee and an `active` flag. User submissions are stored in an `applications` collection containing the `userId`, `serviceId`, form `data`, `attachments`, `status`, timestamps and an `assignedTo` field. Roles can either be represented as a standalone collection or as a property on user documents depending on your governance preferences; Appendix A provides a detailed schema.

Detailed schema in Appendix A.

### 3.4 Component breakdown and responsibilities

The frontend lives under `src/components` and is organized by feature: authentication components such as `Login.js` and `Register.js` under `auth/`; the public landing content under `landing/` with `LandingPage.js`; user pages like `UserDashboard.js`, `ServiceApplication.js` and `ApplicationStatus.js` under `user/`; administrative pages under `admin/` containing dashboards, service and user management pages; staff workflows under `staff/` with `StaffDashboard.js` and `ReviewApplications.js`; shared utilities in `common/` like `ProtectedRoute.js` and `Unauthorized.js`; and layout primitives in `layout/` including `Layout.js` and `Navbar.js`. Each component focuses on presentation, invokes `dataService` for network interactions, and consumes authentication/state from `AuthContext`.

### 3.5 UI/UX and navigation

The navigation and UX follow role‑aware patterns: the Navbar adapts links based on the current user's roles; protected routes prevent unauthorized access to pages; dashboard pages present filtered and searchable lists of applications with sorting controls; and forms perform client‑side validation prior to submitting to Firestore to reduce round trips and improve responsiveness.

## 4. Implementation Details

### 4.1 Project structure (file-by-file overview)

Top-level `src/` files are organized around the app entry points, configuration and shared utilities. `App.js` serves as the application router and main entrypoint while `index.js` with `index.css` bootstraps the React app and global styles. The client Firebase configuration is contained in `config/firebase.js` and privileged server-side operations are prepared by `config/firebaseAdmin.js` for scripts that use the `firebase-admin` SDK. Authentication state is managed by a context provider found in `context/AuthContext.js` (note: duplicate copies also appear under `contexts/` and should be consolidated in a future refactor). Data access is centralized in `services/dataService.js`, and initial database seeding or setup scripts are kept under `utils/setupFirestore.js` and `utils/databaseSetup.js`.

A more detailed description of key components and pages follows. The authentication components under `src/components/auth` include `Login.js`, which handles sign-in flows and error reporting, and `Register.js`, which manages new user creation and initial role assignments. The user-facing flow for submitting services is implemented in `src/components/user/ServiceApplication.js`, where users select a service type, complete the form and upload attachments. Administrative functions live under `src/components/admin` and include `ServiceManagement.js` for creating and editing service types and `UserManagement.js` to inspect and change user roles. Staff workflows are implemented in `src/components/staff/ReviewApplications.js`, which provides lists of assigned or pending applications and facilities to update statuses and add comments.

Note: during maintenance remove the duplicate `AuthContext` file and consolidate the provider under a single `src/context/` path.

### 4.2 Key components and code walkthroughs

AuthContext is responsible for providing the current user object, their roles and helpful utilities such as `isAdmin`, `isStaff`, `signIn` and `signOut`. The context wraps the application root to provide global access to authentication state. The ProtectedRoute component is a React Router wrapper that queries `AuthContext` to enforce authorization: it redirects unauthenticated users to `/login` and users lacking required roles to an `/unauthorized` page. The `dataService` provides a centralized API for Firestore usage — exposing functions such as `getServices()`, `getApplicationsForUser(uid)`, `submitApplication(payload)`, `updateApplicationStatus(id, status)`, `getUsers()` and `setUserRole(uid, role)` — and it centralizes error handling and retry logic for network interactions.

Example pseudo-code for submitApplication:

```js
// services/dataService.js
export async function submitApplication(application) {
  const doc = await firestore.collection("applications").add({
    ...application,
    status: "submitted",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
  return doc.id;
}
```

### 4.3 Authentication and authorization

Authentication uses Firebase Authentication for user sign‑up and sign‑in. During registration the app stores an accompanying user profile document in the `users` collection with a `roles` array so authorization decisions can be based on explicit role assignments. The default roles are `user`, `staff` and `admin`, and you can introduce sub‑roles such as `finance` or `health` to scope permissions. Enforce all role checks both in the frontend for UX and in Firestore security rules to guarantee server‑side protection.

### 4.4 Services and data access

All Firestore interactions should flow through `dataService` so access patterns and error handling are consistent across the app. Design queries with appropriate composite indexes for common patterns (for example filtering by `status`, `serviceId` or `assignedTo`) and use batched writes when you need atomic updates across multiple documents.

### 4.5 Styling (Tailwind usage)

The project uses Tailwind CSS with `tailwind.config.js` at the project root to customize the design system. Components rely on utility classes for layout and spacing, and where class groups repeat consider extracting small presentational components (for example `Button` or `FormField`) to improve maintainability and consistency.

## 5. Installation & Setup

This section walks through setting up a local development environment.

### 5.1 Requirements

To develop and run the project locally you will need a recent LTS release of Node.js (for example 18.x), a package manager such as npm or yarn, and a Firebase project with Authentication and Firestore enabled. Optionally install the Firebase CLI if you plan to use the local emulator suite or perform deployments from the command line.

### 5.2 Local setup step-by-step

To set up the project locally, clone the repository and change into the project directory, then install the JavaScript dependencies and create the required environment variables. In practice this looks like cloning the repo and running `npm install`, adding a `.env` at the project root containing your Firebase client configuration values (for example `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`, `REACT_APP_FIREBASE_STORAGE_BUCKET`, `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`, and `REACT_APP_FIREBASE_APP_ID`), and finally starting the development server with `npm start`. After starting the server the app is typically available at http://localhost:3000.

### 5.3 Firebase setup (client and admin)

Client setup is straightforward: create a Firebase project in the Firebase Console, enable the Email/Password sign‑in provider under Authentication, create a Firestore database (you may start in test mode during local development and switch to locked rules in production), and add a web app to the Firebase project. Copy the client configuration provided by Firebase into your `.env` so the client SDK in `src/config/firebase.js` can initialize correctly.

Admin setup requires a service account for scripts that perform privileged operations such as batch user role updates or database seeding. Generate a service account key from the Firebase Console under Project settings -> Service accounts and download the JSON key, then keep that file secure and out of version control. For local usage set `GOOGLE_APPLICATION_CREDENTIALS` to point to the JSON key or load the credentials securely in your admin scripts; for CI/CD use environment‑driven secrets instead of a checked‑in file.

### 5.4 Environment configuration

Keep `.env` and any service account JSON files out of version control by adding them to `.gitignore`. For production deployments rely on your hosting provider's secure environment variable mechanism (for example Vercel, Netlify or Firebase Hosting secrets) rather than checked‑in files.

## 6. User Guides

### 6.1 Landing page and public workflows

The landing page introduces the available services and directs users to the login and registration flows; public pages present service descriptions and contact information so prospective applicants can decide which service to request.

### 6.2 Register & login flows

The registration flow collects the user's name, email and password and then prompts the new user to complete their profile and accept any terms required by the local panchayat. After successful registration or login, users are returned to their dashboard and the Firebase authentication state is maintained for subsequent requests.

### 6.3 User dashboard and applying for services

The user dashboard lists available services and provides an entry point to submit an application; selecting a service opens a form tailored to that service's required fields, and the form supports uploading documents which are stored in Firebase Storage (or embedded if small and appropriate). For a smoother experience users should use clear, legible file names for attachments and make sure all required fields are completed before submission.

### 6.4 Checking application status

Every application moves through a simple lifecycle — commonly `submitted`, `under_review`, `approved` or `rejected`, and finally `completed` — and users receive status updates inside the application; an email notification system can be enabled as an optional enhancement to notify users when key state changes occur.

## 7. Admin & Staff Guides

### 7.1 Admin dashboard and management features

Administrators can manage service types and user roles and access system analytics. The Admin Dashboard contains pages to create and edit service definitions, including required fields, fees and document checklists.

### 7.2 Role management

Administrators assign roles to users and the application enforces those assignments both on the frontend and within Firestore security rules. As a best practice maintain a minimal number of admin accounts and prefer scoped roles (for example `staff:finance`) to keep privileges narrowly tailored.

### 7.3 Service management

When creating a new service type provide a clear description and an explicit list of required documents; services can be toggled active or inactive to control visibility to applicants.

### 7.4 User and application management

Administrators and staff can search and filter users by email, roles and application history; applications can be assigned to staff, annotated with internal comments, and have their status updated as they progress through the review lifecycle.

### 7.5 Database setup and migrations

Use `utils/databaseSetup.js` to seed initial data such as default roles and common services. For schema changes prefer a migration script that reads existing documents and applies idempotent updates so migrations can be run multiple times without unintended side effects.

## 8. Security & Rules

### 8.1 Firebase security rules overview

Firestore security rules must enforce the trust boundaries described elsewhere in this document. Specifically, only authenticated users should be allowed to create applications and those creations must be tied to the creator's UID; users should only be able to read their own user document and their own applications unless elevated roles permit broader access; staff and admin roles must be able to read application lists as their job requires; and only administrators should be permitted to modify the `services` and `roles` collections. The following code block provides an example outline of rules implementing those constraints:

match /databases/{database}/documents {
match /users/{userId} {
allow read, update: if request.auth != null && request.auth.uid == userId;
allow create: if request.auth != null;
}
match /applications/{appId} {
allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
allow read: if request.auth != null && (resource.data.userId == request.auth.uid || hasRole(request.auth.uid, 'staff') || hasRole(request.auth.uid, 'admin'));
allow update: if ...; // Define granular checks based on roles
}
}

Note: implement a `hasRole` function using custom claims or a `users` doc lookup logic.

### 8.2 Best practices

When implementing authorization and security, prefer Firebase custom claims for server‑side role checks and keep Firestore rules as restrictive as practical. Always test security rules with the Firebase Emulator Suite before deploying to production. Additionally, validate input both on the client and via security rules to reduce the risk of malformed data or simple injection patterns reaching your database.

### 8.3 Role-based access control

Do not rely solely on client‑side checks to enforce trust — always express authorization constraints in Firestore security rules so the server enforces them regardless of client behavior. For elevated or sensitive actions prefer executing logic in trusted server contexts that use service account credentials rather than granting broad client privileges.

## 9. Testing

### 9.1 Unit tests and component tests

The recommended testing stack is Jest together with React Testing Library for component and unit tests. Core areas to test include the `AuthContext` behavior (ensuring correct signed in/out transitions and role checks) and `dataService` functions; the latter should be tested with mocks so Firestore interactions are verified without hitting production services. A pragmatic test matrix contains cases for the authentication context (successful sign‑in, sign‑in failure and sign‑out), for protected routes (redirect behavior for unauthenticated or unauthorized attempts), and for key forms such as `ServiceApplication` where validation scenarios should be asserted.

### 9.2 Integration testing guidance

For integration testing use the Firebase Emulator Suite so tests can run against a local Firestore instance and Auth emulator. Seed the emulator with representative test accounts and application data to simulate real workflows and verify security rules and processes without touching production resources.

### 9.3 Manual test cases and acceptance criteria

Document a set of manual acceptance tests with clear steps and expected results. For example, a registration test should exercise the Register flow by entering valid credentials, submitting the form and asserting that a `users` document exists and the user is redirected to their dashboard. An application submission test should exercise login, navigation to the service application form, entry of required fields and file attachments, submission, and verification that an `applications` document is created with `status: submitted` and the user receives confirmation.

## 10. Deployment

### 10.1 Production considerations

In production ensure Firestore security rules are locked down and thoroughly tested. Host the static frontend on a secure HTTPS provider (Firebase Hosting integrates seamlessly with Firestore and Cloud Functions, while platforms such as Netlify or Vercel are also viable options that work well with Firebase backends). For server‑side scheduled tasks and admin scripts prefer Cloud Functions or a small managed server.

### 10.3 CI/CD suggestions

Create a CI/CD pipeline that installs dependencies, runs linters and tests, builds the production bundle and deploys to your hosting target. Example CI providers include GitHub Actions, Azure Pipelines and GitLab CI; the GitHub Actions example in this document is a starting point for building a workflow that validates and deploys commits to the `main` branch.

## 11. Maintenance and Troubleshooting

### 11.1 Logging and monitoring

Integrate centralized error reporting, for example Sentry or Firebase Crashlytics, to capture runtime exceptions and user impacts. Use the Firebase Console to monitor read/write usage, performance metrics and security rule violations so that operational trends and anomalies can be investigated promptly.

### 11.2 Common issues and fixes

Common problems have standard mitigations: authentication errors typically stem from incorrect Firebase configuration or disabled sign‑in providers, so verify the client config and enabled authentication methods. Permission denied errors are often caused by overly restrictive or incorrect security rules and missing user claims; re‑test rules with the emulator and confirm the presence and correctness of user role documents. File upload failures usually relate to Storage rules, CORS settings or incorrect bucket configuration — verify the storage bucket name and CORS policy applied to the bucket.

### 11.3 Backups and recovery

Perform regular Firestore exports to Cloud Storage on a schedule appropriate for your retention needs and keep service account keys inside a secure secrets vault rather than in plaintext files or source control.

## 12. Future Enhancements

Planned enhancements include adding email and SMS notifications triggered by status changes (for example via Cloud Functions), implementing an audit log that records application changes for compliance and traceability, providing a reports and analytics dashboard for admins, improving attachment handling with resumable uploads and progress reporting, and adding progressive web app (PWA) features to support offline usage.

## 13. Contribution Guide

Follow the repository `CONTRIBUTING.md` when making changes. Use a feature branch for any non‑trivial addition, conform to the project's code style (for example ESLint and Prettier if configured), and open a pull request with a clear description of the change and links to any related issue so reviewers can validate the intent and impact.

## 14. Appendices

### Appendix A — Database schema (detailed)

This appendix provides a recommended Firestore schema for collections and document fields. Use this as a reference for building queries and security rules.

Collection: users — Each user document (identified by the `uid`) stores the user's name, email, an array of `roles` (for example `['user']` or `['staff','finance']`), a `createdAt` timestamp and a `profile` object with address and phone details.

Collection: services — Service documents (identified by `id`) include the service name, a human‑readable description, `requiredFields` (an array describing form inputs such as `{name:'birthDate', type:'date', required:true}`), a `requiredDocuments` array, an optional `fee` and an `active` flag.

Collection: applications — Application documents contain the `userId` of the applicant, the `serviceId`, the submitted form `data`, any `attachments` as storage URLs, the current `status` (for example `submitted`, `under_review`, `approved`, `rejected`, `completed`), an `assignedTo` staff identifier where relevant, and lifecycle timestamps such as `createdAt` and `updatedAt`.

### Appendix B — Sample JSON payloads

Sample registration payload (client sends to Firebase Auth indirect via client SDK):

{
"email": "user@example.com",
"password": "securePassword123",
"profile": {
"name": "User Name",
"address": "Village, District"
}
}

Sample application payload for `dataService.submitApplication`:

{
"userId": "uid_123",
"serviceId": "service_birth_cert",
"data": {
"fullName": "User Name",
"birthDate": "1990-01-01",
"fatherName": "Father Name"
},
"attachments": [
"https://firebasestorage.googleapis.com/.../doc1.jpg"
]
}

### Appendix C — Important files and snippets

Important files to review when extending or debugging the app include `src/config/firebase.js` which initializes the Firebase client and exports `auth`, `firestore` and `storage` helpers; `src/context/AuthContext.js` which holds the user session and role helper functions; `src/services/dataService.js` which centralizes data access patterns; and the `firestore.rules` file in the repository which you should update and test before deploying security rules to production.

Example firebase initialization (client):

```js
// src/config/firebase.js (example)
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const firestore = app.firestore();
export const storage = app.storage();
export default app;
```

### Appendix D — Changelog

Version 1.0 is the initial documentation draft covering architecture, setup, and user/admin guides (2025-10-26).

---

## How to use this documentation

You can paste this Markdown directly into Microsoft Word (or convert it to `.docx`) and then adjust headings and spacing to match your preferred print layout. If you need to reach a specific page count such as 50 Word pages, extend the appendices with longer examples, add full‑screen mockups and screenshots, or insert detailed step‑by‑step tutorials with annotated images.

## Next steps and suggestions

Recommended next steps include consolidating duplicated files (for example the duplicate `AuthContext` copies) and performing a small refactor to standardize the context, implementing or extending unit tests and adding a CI step to validate them on push, and hardening Firestore security rules followed by verification using the Firebase Emulator Suite.

---

End of document.

## 15. Expanded Component Reference and Code Examples

This section contains detailed, copy-ready code examples for the most important pieces of the application: the authentication context, protected routes, data service wrappers, and an example migration/seed script for Firestore. These files are intended as a reference implementation you can drop into the project or adapt during refactors.

### 15.1 `AuthContext.js` (detailed implementation)

Contract: The `AuthContext` contract expects the Firebase `auth` instance from `src/config/firebase.js` and provides a `user` object, a `loading` flag and helper functions for login, register, logout, and token refresh. It also exposes a `hasRole(role)` helper to query role membership. Error modes to handle include network failures and authentication errors.

Edge cases to design for include auth state transitions occurring while the UI is interacting (race conditions), missing `users` documents for Firebase-authenticated users and token expiration or refresh anomalies.

Sample implementation (drop-in):

```js
// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../config/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Fetch user profile from Firestore
      try {
        const userDoc = await firestore
          .collection("users")
          .doc(fbUser.uid)
          .get();
        if (userDoc.exists) {
          setUser({ uid: fbUser.uid, email: fbUser.email, ...userDoc.data() });
        } else {
          // If no user doc, create a minimal profile
          const profile = {
            email: fbUser.email,
            roles: ["user"],
            createdAt: new Date(),
          };
          await firestore.collection("users").doc(fbUser.uid).set(profile);
          setUser({ uid: fbUser.uid, ...profile });
        }
      } catch (err) {
        console.error("AuthContext - failed to fetch user doc", err);
        setUser({ uid: fbUser.uid, email: fbUser.email, roles: ["user"] });
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);
  const register = async (email, password, profile = {}) => {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    const uid = result.user.uid;
    const doc = { email, roles: ["user"], createdAt: new Date(), ...profile };
    await firestore.collection("users").doc(uid).set(doc);
    setUser({ uid, ...doc });
    return result;
  };

  const logout = () => auth.signOut();

  const hasRole = (role) =>
    !!(user && Array.isArray(user.roles) && user.roles.includes(role));

  const value = { user, loading, login, register, logout, hasRole };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

Notes: This implementation intentionally creates an accompanying `users` document for every authenticated user if one does not exist. While this is convenient it may create minimal profile documents for third‑party auth providers; adjust the behavior if you prefer explicit onboarding flows.

### 15.2 `ProtectedRoute.js` (example)

Objective: ensure only authenticated users with required roles access routes.

```js
// src/components/common/ProtectedRoute.js
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({
  component: Component,
  roles = [],
  ...rest
}) {
  const { user, loading, hasRole } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) return <div>Loading...</div>;
        if (!user)
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        if (roles.length && !roles.some((r) => hasRole(r)))
          return <Redirect to="/unauthorized" />;
        return <Component {...props} />;
      }}
    />
  );
}
```

### 15.3 `dataService.js` (full feature example)

Responsibilities: The `dataService` should wrap Firestore reads and writes with consistent error handling and optional retry logic, and present clear, typed‑like contracts for returned objects so callers can depend on predictable shapes and error semantics.

Example implementation (core functions):

```js
// src/services/dataService.js
import { firestore, storage } from "../config/firebase";
import firebase from "firebase/compat/app";

const applicationsCol = firestore.collection("applications");
const servicesCol = firestore.collection("services");
const usersCol = firestore.collection("users");

export async function getServices() {
  const snap = await servicesCol.where("active", "==", true).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getApplicationsForUser(uid) {
  const snap = await applicationsCol
    .where("userId", "==", uid)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function submitApplication(application, files = []) {
  // application: { userId, serviceId, data }
  const now = firebase.firestore.FieldValue.serverTimestamp();
  const docRef = await applicationsCol.add({
    ...application,
    status: "submitted",
    createdAt: now,
    updatedAt: now,
  });

  // Upload files to Storage and attach URLs
  if (files.length) {
    const urls = [];
    for (let file of files) {
      const storageRef = storage
        .ref()
        .child(`applications/${docRef.id}/${file.name}`);
      await storageRef.put(file);
      const url = await storageRef.getDownloadURL();
      urls.push(url);
    }
    await docRef.update({ attachments: urls });
  }

  return docRef.id;
}

export async function updateApplicationStatus(id, updates) {
  updates.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
  await applicationsCol.doc(id).update(updates);
}

export async function getUsers(filter = {}) {
  // simple get-all; expand with pagination in real app
  const snap = await usersCol.get();
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

export async function setUserRole(uid, roles) {
  await usersCol.doc(uid).update({ roles });
}
```

Notes: For larger uploads implement resumable transfers and a progress UI rather than synchronous blocking uploads. When working with large collections consider pagination (for example `limit`/`startAfter`) to keep read performance and client memory usage predictable.

### 15.4 Firestore migration & seeding script example

Use this script for initial data seeding and idempotent migrations. It uses firebase-admin and should be run locally with a service account or inside a trusted environment.

```js
// scripts/seed.js
const admin = require("firebase-admin");
const serviceAccount = require("../path/to/serviceAccountKey.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function seed() {
  const services = [
    {
      id: "birth_certificate",
      name: "Birth Certificate",
      description: "Apply for birth certificate",
      requiredDocuments: ["id_proof"],
      fee: 0,
      active: true,
    },
    {
      id: "residence_certificate",
      name: "Residence Certificate",
      description: "Proof of residence",
      requiredDocuments: ["id_proof"],
      fee: 0,
      active: true,
    },
  ];

  for (let svc of services) {
    const ref = db.collection("services").doc(svc.id);
    const doc = await ref.get();
    if (!doc.exists) {
      await ref.set(svc);
      console.log("Created service", svc.id);
    } else {
      console.log("Service exists", svc.id);
    }
  }

  // Default admin user (do NOT use in production — use env-driven provisioning)
  const adminUid = process.env.DEFAULT_ADMIN_UID;
  if (adminUid) {
    await db
      .collection("users")
      .doc(adminUid)
      .set(
        {
          roles: ["admin"],
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    console.log("Ensured admin user", adminUid);
  }
}

seed()
  .then(() => {
    console.log("Seeding complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

Security note: keep `serviceAccountKey.json` out of version control. Use environment-based provisioning where possible.

## 16. Example Firestore Security Rules (complete)

Below is a practical, explicit set of Firestore security rules that implement many of the checks discussed earlier. Adapt and test with the Firebase emulator suite before deploying.

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // helper to read user document for the authenticated user
    function userDoc(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data;
    }

    function hasRole(uid, role) {
      return (userDoc(uid).roles != null && userDoc(uid).roles.indexOf(role) >= 0);
    }

    match /users/{userId} {
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && (request.auth.uid == userId || hasRole(request.auth.uid, 'admin') || hasRole(request.auth.uid, 'staff'));
      allow update: if request.auth != null && (request.auth.uid == userId || hasRole(request.auth.uid, 'admin'));
      allow delete: if false; // prefer soft-delete via an 'active' flag and admin workflows
    }

    match /services/{serviceId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && hasRole(request.auth.uid, 'admin');
    }

    match /applications/{appId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid && request.resource.data.keys().hasAll(['userId','serviceId','data']);
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || hasRole(request.auth.uid, 'staff') || hasRole(request.auth.uid, 'admin'));
      allow update: if request.auth != null && (
        // user can update their draft fields before submission
        (resource.data.userId == request.auth.uid && request.resource.data.status == resource.data.status) ||
        // staff or admin can update status and assignment
        hasRole(request.auth.uid, 'staff') || hasRole(request.auth.uid, 'admin')
      );
      allow delete: if false;
    }

    // fallback deny
    match /{document=**} { allow read, write: if false; }
  }
}
```

Testing rules: use the emulator with a test harness that loads a user doc with roles and attempts a set of allowed/denied operations. Document the test scenarios in your test suite.

## 17. Admin & Staff: Step-by-step Workflows (expanded)

This section includes very granular workflows with UI steps and expected outcomes. When converted to Word, add screenshots for each step using the placeholders below.

### 17.1 Onboarding a new Admin

Onboarding a new admin is an intentional, administrative process: an administrator provisions or invites a Firebase Authentication account for the person, signs in as an existing admin, navigates to Admin Dashboard → User Management, locates the new user (or triggers a manual sync if the user has not yet registered), opens the user's profile and adds the `admin` role. After the role is saved the user's Firestore document will contain `roles: ['admin']` and the new admin will be able to access administrative routes once they sign in. When producing a Word version of this guide, replace the screenshot placeholders with images showing the search users page and the edit roles modal.

### 17.2 Staff review and approve an application

A typical staff review workflow begins with a staff member logging into the Staff Dashboard and opening the Review Applications area. The staff member filters for newly submitted items (for example by `status: submitted` or by service type), opens an application to review any attached documents, and adds internal comments as necessary. The application can be assigned to another staff member or moved into an `under_review` state during verification; once verification is complete the reviewer changes the application status to `approved` or `rejected` and records notes. This updates the application's `updatedAt` timestamp and the applicant sees the new status in their dashboard; an optional email notification can be sent if that integration is enabled. Replace the staff review screenshot placeholder with a real image when finalizing the guide.

### 17.3 Service creation by Admin

To create a new service, an administrator signs into the Admin Dashboard and opens Service Management, uses the create service form to provide a name, description, required fields (each defined by name, type and a required flag) and the list of required documents, then saves the service. The system creates a document in the `services` collection populated with the provided metadata and a default `active: true` flag. Replace the service creation screenshot placeholder with an image of the create form when preparing the Word version.

## 18. Testing Matrix and Expanded Manual Test Cases

This section expands the set of test cases to cover happy paths, negative tests and edge cases that ensure the application meets acceptance criteria. For authentication and profile flows include tests for registering a new user (happy path), attempting registration with an already used email (expecting validation errors), logging in with incorrect credentials (verifying the proper error behavior without locking accounts unintentionally), and the password reset flow if it is implemented (requesting a reset, receiving the email and completing the reset). For the application lifecycle write tests that submit a properly completed application with attachments (verifying that an `applications` document is created and storage objects are uploaded), tests that attempt submission without required fields (expecting client validation and server‑side rule rejection), tests that exercise staff approval and verify the `status` and `updatedAt` fields update correctly, and negative tests that attempt unauthorized status updates which should be denied by security rules. Admin functionality tests should cover creating a service and confirming it is visible to users, and assigning and revoking staff roles while verifying access control changes. For basic performance validation include a load scenario such as simulating many concurrent reads of the `services` collection to evaluate latency; production readiness will require CDNs, proper indexing and a more complete load testing plan. Include explicit test data and a runnable test runner plan (for example a Postman collection or Cypress scripts) in Appendix F when available.

## 19. CI/CD Example: GitHub Actions

Below is a sample GitHub Actions workflow to run tests, lint, and deploy to Firebase Hosting.

```yaml
name: CI

on:
  push:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run lint --if-present
      - run: npm test --if-present
  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: FirebaseExtended/action-hosting-deploy@v2
        with:
          repoToken: "${{ secrets.GITHUB_TOKEN }}"
          firebaseServiceAccount: "${{ secrets.FIREBASE_SERVICE_ACCOUNT_JSON }}"
          channelId: live
```

Secrets to set in GitHub: `FIREBASE_SERVICE_ACCOUNT_JSON` (base64-encoded service account JSON). Do not store raw keys in repo.

## 20. Accessibility, Localization, and UX Guidelines

Accessibility, localization and UX are critical to adoption. Ensure form fields include associated labels, use aria‑live regions for dynamic status messages, meet WCAG AA contrast ratios, and provide keyboard navigability for interactive components such as modals and dialogs. For localization keep visible strings in a `locales/` folder and use a small loader (for example an `i18n.js` helper) to substitute language packs; be mindful of date and number formats when presenting localized content. From a UX perspective prefer progressive disclosure on long forms, show clear inline validation messages when fields are invalid, and provide visible upload progress for attachments so users understand the current state of large file transfers.

## 21. Backup, Retention, and Data Governance

Establish an operational backup and retention policy: schedule daily exports of Firestore to Cloud Storage and maintain a rolling 30‑day backup set, migrating older backups to cold storage. Define retention periods for attachments and sensitive artifacts (for example, remove attachments tied to applications older than a legally mandated retention window only after appropriate review). Implement soft‑delete patterns for data deletion workflows so that downstream tasks, audits and restores can be performed reliably without immediate physical deletion.

## 22. Troubleshooting Recipes

Common operational issues have straightforward diagnostics: permission denied errors when reading Firestore are most commonly due to mismatched security rules or missing user documents — use the Firebase Console Rules playground to exercise and debug rules and ensure the user's document contains the expected roles. File upload failures in production are often a Storage rules, CORS or configuration problem; verify bucket names and Storage rules and confirm CORS settings on the bucket match your front-end origin. Token expiration problems can be caused by incorrect system clocks in long‑running environments; ensure clocks are synchronized and, where appropriate, refresh tokens using `getIdToken(true)` in long‑lived browser sessions.

## 23. Full Glossary

Admin refers to a full system administrator who can manage services, users and roles. Staff denotes operational users responsible for reviewing and processing applications. A Service is a definable application type that users can request (for example birth certificate or residence certificate). An Application is an instance of a user's request for a Service and contains the submitted form data, attachments and lifecycle metadata.

## 24. Expanded Appendices

Appendix E — Example Email Templates

1. Application submitted notification (to user)

Subject: Your application for {{serviceName}} has been received

Body:
Hello {{userName}},

We have received your application (ID: {{applicationId}}) for {{serviceName}} submitted on {{submittedAt}}. Your current status is "submitted". We'll notify you when the status changes.

Thank you,
Digital E-Gram Team

2. Application approved (to user)

Subject: Your application for {{serviceName}} has been approved

Body:
Hello {{userName}},

Good news — your application (ID: {{applicationId}}) for {{serviceName}} has been approved. Please check your dashboard for further instructions.

Thanks,
Digital E-Gram Team

Appendix F — Sample Cypress test outline (E2E)

```js
describe("User flows", () => {
  it("registers and submits an application", () => {
    cy.visit("/register");
    cy.get("[data-cy=name]").type("Test User");
    cy.get("[data-cy=email]").type("test.user@example.com");
    cy.get("[data-cy=password]").type("Password123!");
    cy.get("[data-cy=submit]").click();
    // continue with application flow
  });
});
```

Appendix G — Sample Data Exports and Formats

Provide example CSV and JSON export formats for `applications` to support offline reporting and audits; include mapping notes that describe how each application field maps to columns or JSON properties so analysts can consume the exports reliably.

## 25. Final notes and next steps

We've expanded the documentation with code-level examples, security rules, admin workflows, testing matrices, CI/CD pipeline examples, and many appendices. This substantially increases the document size and provides concrete artifacts you can paste into Word and format.

I can take a few immediate next steps to finalize this deliverable: convert the Markdown into a `.docx` file and add it to the repository, populate the documentation with screenshot placeholders and recommended alt text and sizes, generate additional sample test cases (for example Cypress and Jest) and place them under a `tests/` directory, and create a `docs/images/` folder containing placeholder images and an example architecture diagram in SVG. Let me know which of these you want me to proceed with and I will continue.

---

## Conclusion

The Digital E‑Gram Panchayat project represents a significant step toward modernizing local government service delivery through digital transformation. By providing a centralized, role‑based platform for residents to submit applications, staff to review and process requests, and administrators to manage services and users, this system addresses the inefficiencies and accessibility challenges inherent in traditional paper‑based workflows. The architecture leverages proven technologies—React for a responsive frontend, Firebase for secure authentication and scalable data storage, and Tailwind CSS for consistent styling—while maintaining clear separation of concerns through well‑defined service layers and context providers. This foundation ensures that the application remains maintainable, testable and extensible as requirements evolve and new features are introduced.

Security and governance are central to the project's design philosophy. Firestore security rules enforce role‑based access control at the database level, ensuring that authorization decisions are not merely client‑side suggestions but server‑enforced guarantees. The application lifecycle for submissions—from initial creation through review, approval and completion—is tracked with timestamps and assignee metadata that support accountability and audit requirements. Backup and retention policies, soft‑delete patterns and explicit role management workflows further demonstrate a commitment to operational best practices that align with the compliance and transparency expectations of public sector systems. These mechanisms ensure that data integrity, user privacy and regulatory adherence are not afterthoughts but integral components of the platform.

Looking forward, the roadmap outlined in this documentation positions the project for continuous improvement and broader impact. Planned enhancements such as email and SMS notifications, audit logging, resumable file uploads, analytics dashboards and progressive web app capabilities will increase user engagement, operational insight and offline accessibility. The contribution guidelines and CI/CD examples provide a clear path for developers to extend functionality, fix bugs and propose improvements in a disciplined and collaborative manner. By combining a solid technical foundation with a user‑centered approach and a commitment to iterative enhancement, the Digital E‑Gram Panchayat project has the potential to serve as a replicable model for digital governance initiatives in similar administrative contexts, ultimately improving service quality and citizen satisfaction across rural and municipal communities.

End of extended document.
