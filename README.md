# Pico Learn App

A modern React + TypeScript + Vite educational platform with Supabase authentication, multi-language support, and a role-based learning interface.

## Project Overview

This project is structured as a learning platform for students, teachers, and schools. It currently includes:

- landing page and course showcase
- Supabase-based login and signup
- auth state tracking using a custom hook
- i18n support for English and Bangla
- routed pages for students, admin, and general app navigation
- reusable global components like nav, hero, and footer

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Supabase JS client
- i18next + browser language detection
- Tailwind-style utility classes already used in component markup

## Project Structure

```bash
src/
  App.tsx
  i18n.tsx
  main.tsx
  supabaseClient.tsx
  hooks/
    useAuth.ts
  component-global/
    Nav.tsx
    Hero.tsx
    Footer.tsx
  pages/
    Home.tsx
    Login.tsx
    Signup.tsx
    About.tsx
    Course.tsx
    NotFound.tsx
    HomeComponent/
      CourseSection.tsx
  users/
    Organization.tsx
    Education.tsx
    MyCourse.tsx
    Profile.tsx
    MyTest.tsx
    MyPayment.tsx
  admin/
    Dashboard.tsx
    Users.tsx
    Courses.tsx
    Organizations.tsx
  locales/
    en.json
    bn.json
```

## Core Features

### 1. Authentication

Authentication is powered by Supabase and already implemented in:

- `src/supabaseClient.tsx`
- `src/hooks/useAuth.ts`
- `src/pages/Login.tsx`
- `src/pages/Signup.tsx`

Current auth flow:

- sign up with name, phone, email, and password
- sign in with email or phone + password
- session tracking through `useAuth()`
- navbar updates based on logged-in state

### 2. Language Support

The app uses `react-i18next` with JSON translation files:

- `src/locales/en.json`
- `src/locales/bn.json`

The language detector saves user preference in local storage and reloads it automatically.

### 3. Routing

`src/main.tsx` contains the route map:

- `/` Home
- `/home` Home
- `/courses` Course page
- `/about` About page
- `/login` Login page
- `/signup` Signup page
- `/users/...` user pages
- `/admin/...` admin pages
- `*` NotFound

### 4. Global Layout

`src/App.tsx` wraps pages with:

- `Nav`
- `Outlet`
- `Footer`

This keeps layout consistent across all pages.

## Environment Setup

Create a `.env.local` file in the project root with your Supabase keys:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

Important:

- never commit `.env.local` to version control
- keep production credentials separate from development credentials
- always use the correct Supabase project for the current environment

## Local Development

Install dependencies:

```bash
npm install
```

Run the project:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Lint the project:

```bash
npm run lint
```

## Recommended Next-Level Development Guidelines

### 1. Improve the auth flow

Focus on the following next:

- add logout confirmation modal
- create protected route guards for user/admin pages
- add password reset flow
- add email verification and resend email action
- save user profile details to a Supabase table after signup

Recommended files to extend:

- `src/hooks/useAuth.ts`
- `src/pages/Login.tsx`
- `src/pages/Signup.tsx`
- `src/App.tsx`

### 2. Move toward a real data model

The current app still has demo data and mocked presentation values. For production readiness, introduce proper data layers:

- user profiles table
- courses table
- enrollments table
- payments table
- tests and results table
- organization/school records table

Use Supabase database tables and row-level security policies for real app state.

### 3. Standardize reusable UI patterns

The app currently contains several repeated UI patterns. Next steps:

- extract reusable `Button`, `Input`, `Card`, and `Modal` components
- create a shared layout folder for authenticated pages
- standardize naming and styling conventions across components

This will make the project easier to scale and maintain.

### 4. Build a real user dashboard

The admin and user pages should evolve from placeholder components into real dashboards:

- statistics cards
- recent enrollments
- student performance charts
- payment records
- course analytics

Use components from a dashboard library or build a consistent internal design system.

### 5. Add stronger form validation

Current forms work, but they can be improved with:

- required field validation messages
- phone format validation
- password strength rules
- confirm password field
- inline error highlighting
- form-level loading states

### 6. Expand i18n coverage

Right now, the app handles core landing-page and navigation text. Next step is to translate all visible labels and dynamic content across:

- general pages
- form fields
- button labels
- dashboard content
- error/success notifications

### 7. Optimize code organization

For future growth, consider separating functionality into clear domains:

- `auth/`
- `courses/`
- `users/`
- `dashboard/`
- `layout/`
- `common/`

This will keep the project clean and easier to maintain as more features are added.

### 8. Production hardening

Before deploying to production, plan for:

- environment-based configuration
- Route guards and auth redirection
- error boundaries
- loader and skeleton states
- SEO metadata for pages
- analytics tracking
- performance optimization and image optimization
- automated tests for auth and route flows

## Suggested Roadmap

### Phase 1 - Stabilize core app

- finish signup/login polish
- add password reset and logout
- secure protected routes
- validate database schema in Supabase

### Phase 2 - Product features

- implement course listing and detail pages
- add student enrollments and progress tracking
- implement admin dashboard analytics
- add payments and billing flow

### Phase 3 - Scale the platform

- add teacher features
- add school/organization management
- expand to mobile-first UX
- launch a production-grade backend integration model

## Best Practices

- keep components focused and small
- avoid mixing business logic into UI components
- prefer shared hooks for auth and data fetching
- use environmental variables for secrets
- keep code consistent with TypeScript types
- review UI changes against both English and Bangla flows

## Notes

This project is a strong foundation for a full learning platform. The current structure is already suitable for continued growth into a real SaaS-style product, especially with Supabase for backend services and React for frontend experience.

## Contribution Guidance

When adding new features:

1. keep the route structure consistent with `src/main.tsx`
2. follow current naming conventions in the project
3. reuse global layout components whenever possible
4. add Supabase queries in dedicated hooks or service files
5. update both English and Bangla translations when changing visible UI text
6. run `npm run build` before finalizing work

---

If you are continuing development, the next most important tasks are:

- finish production-safe auth flow
- connect user data to Supabase tables
- create a real dashboard and course management workflow
- migrate all demo content to live backend data

