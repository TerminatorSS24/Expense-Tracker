// src/components/Navbar.jsx
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useTheme } from "../context/ThemeContext"; 

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>ExpenseTracker</span>
      <div className={styles.links}>
        <NavLink to="/" end className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Dashboard</NavLink>
        <NavLink to="/add" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Add</NavLink>
        <NavLink to="/expenses" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>Expenses</NavLink>
      </div>
      <div className={styles.right}>
        <span className={styles.email}>{user?.email}</span>
        <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <button className={styles.logout} onClick={() => signOut(auth)}>Sign out</button>
      </div>
    </nav>
  );
}
