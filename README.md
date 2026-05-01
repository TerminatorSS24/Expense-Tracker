# Expense Tracker

A personal finance app I built to track daily expenses, visualize spending patterns, and understand where my money actually goes each month.

---

## Why I built this

I wanted a project that went beyond the usual todo-list or weather app. Expense tracking felt like something genuinely useful — it involves real user data, authentication, cloud storage, and data visualization all in one place. It also gave me a chance to work with Firebase properly, which I'd been meaning to do for a while.

---

## What it does

You sign up with your email, and from there you can log expenses with a description, amount, category, date, and an optional note. The dashboard shows you a breakdown of your spending — a donut chart by category, a monthly bar chart for the last 6 months, and a stacked chart showing how your category habits change over time. There's also a full expenses list with search and category filtering.

Everything syncs in real time across devices — if you add something on your phone, it shows up on your laptop instantly. That's Firestore doing its thing.

---

## Tech stack

- **React 18** with functional components and hooks throughout
- **React Router v6** for client-side navigation
- **Firebase Auth** for email/password login and registration
- **Cloud Firestore** for storing and syncing expense data in real time
- **Recharts** for the analytics charts
- **CSS Modules** for component-scoped styling — no class name collisions
- Deployed on **Vercel**

---

## How the data is structured

Each user gets their own subcollection in Firestore, so users can never see each other's data:

```
users/
  {uid}/
    expenses/
      {expenseId}/
        desc: string
        amount: number
        category: string
        date: string        // "YYYY-MM-DD"
        note: string
        createdAt: timestamp
```

Security rules on Firestore ensure that `request.auth.uid == userId` before any read or write is allowed.

---

## Project structure

```
src/
  components/       # Navbar, MetricCard — small reusable pieces
  context/          # AuthContext (login state), ExpenseContext (CRUD + Firestore), ThemeContext (dark mode)
  hooks/            # useAnalytics.js — derives all chart data from raw expenses
  pages/            # LoginPage, DashboardPage, AddExpensePage, ExpensesPage
  utils/            # formatINR, formatDisplayDate helpers
  firebase.js       # Firebase app init — reads from .env
  App.jsx           # Route definitions + auth guard
  index.js          # Entry point
```

The `useAnalytics` hook was probably the most interesting part to write — it takes the raw expenses array and derives totals by category, monthly trends, daily averages, and stacked data for the charts, all using `useMemo` so it only recalculates when expenses actually change.

---

## Running it locally

**1. Clone and install**
```bash
git clone https://github.com/TerminatorSS24/Expense-Tracker.git
cd expense-tracker
npm install
```

**2. Set up Firebase**
- Create a project at [console.firebase.google.com](https://console.firebase.google.com)
- Enable **Authentication** → Email/Password
- Enable **Firestore Database** → start in test mode
- Go to Project Settings → copy your web app config

**3. Add your environment variables**

Create a `.env` file in the project root:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

**4. Start the dev server**
```bash
npm start
```

Opens at `http://localhost:3000`

---

## Deploying to Vercel

Push to GitHub, then import the repo at [vercel.com](https://vercel.com). Add the same environment variables from your `.env` file under **Project Settings → Environment Variables** in Vercel, then deploy. Takes about 2 minutes total.

---

## What I'd add next

- Monthly budget limits with an alert when you're close to the limit
- Export expenses to CSV
- Google Sign-In as an alternative to email/password
- Mobile app version using React Native
