// src/context/ExpenseContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener — Firestore pushes updates automatically
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    const ref = collection(db, "users", user.uid, "expenses");
    const q = query(ref, orderBy("date", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setExpenses(data);
      setLoading(false);
    });

    return unsub;
  }, [user]);

  async function addExpense({ desc, amount, category, date, note }) {
    const ref = collection(db, "users", user.uid, "expenses");
    await addDoc(ref, {
      desc,
      amount: parseFloat(amount),
      category,
      date,           // stored as "YYYY-MM-DD" string for easy filtering
      note: note || "",
      createdAt: serverTimestamp(),
    });
  }

  async function deleteExpense(id) {
    const ref = doc(db, "users", user.uid, "expenses", id);
    await deleteDoc(ref);
  }

  return (
    <ExpenseContext.Provider value={{ expenses, loading, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpenseContext);
}
