# Expense Tracker

A full-stack expense tracking app built with React + Firebase.

## Features
- Email/password authentication (Firebase Auth)
- Add, view, and delete expenses
- Real-time sync across devices (Firestore)
- Analytics dashboard: pie chart, monthly bar chart, stacked category breakdown
- Search and filter expenses
- Fully responsive

## Tech Stack
- React 18 + React Router v6
- Firebase (Auth + Firestore)
- Recharts (charts)
- CSS Modules

---

## Setup Instructions

### 1. Clone and install
```bash
git clone <your-repo-url>
cd expense-tracker
npm install
```

### 2. Create a Firebase project
1. Go to https://console.firebase.google.com
2. Click **Add project** → name it → continue
3. Go to **Project Settings** → **Your apps** → click the Web icon (`</>`)
4. Register your app → copy the `firebaseConfig` object

### 3. Enable Firebase services
- **Authentication**: Firebase console → Authentication → Sign-in method → Enable **Email/Password**
- **Firestore**: Firebase console → Firestore Database → Create database → Start in **test mode**

### 4. Add your Firebase config
Open `src/firebase.js` and replace the placeholder values with your actual config:
```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  ...
};
```

### 5. Run locally
```bash
npm start
```
App opens at http://localhost:3000

### 6. Deploy to Vercel (free)
```bash
npm install -g vercel
vercel
```
Follow the prompts. Done — live URL in under 60 seconds.

---

## Project Structure
```
src/
  components/       # Reusable UI (Navbar, MetricCard)
  context/          # AuthContext, ExpenseContext (global state)
  hooks/            # useAnalytics (derived chart data)
  pages/            # LoginPage, DashboardPage, AddExpensePage, ExpensesPage
  utils/            # helpers (formatINR, formatDate)
  firebase.js       # Firebase init
  App.jsx           # Routing + auth guard
  index.js          # Entry point
```

## Firestore Data Model
```
users/
  {uid}/
    expenses/
      {expenseId}/
        desc: string
        amount: number
        category: string
        date: string (YYYY-MM-DD)
        note: string
        createdAt: timestamp
```
