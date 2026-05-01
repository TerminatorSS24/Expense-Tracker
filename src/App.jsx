import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AddExpensePage from "./pages/AddExpensePage";
import ExpensesPage from "./pages/ExpensesPage";
import { ThemeProvider } from "./context/ThemeContext";

function AuthGuard({ children }) {
  const { user } = useAuth();
  if (user === undefined) return <div style={{ textAlign: "center", padding: "4rem", color: "#888" }}>Loading...</div>;
  if (user === null) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route
          path="/*"
          element={
            <AuthGuard>
              <ExpenseProvider>
                <Navbar />
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/add" element={<AddExpensePage />} />
                  <Route path="/expenses" element={<ExpensesPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ExpenseProvider>
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
    </ThemeProvider>
  );
}
