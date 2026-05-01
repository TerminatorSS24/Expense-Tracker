// src/pages/AddExpensePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpenses } from "../context/ExpenseContext";
import { CATEGORIES } from "../hooks/useAnalytics";
import styles from "./AddExpensePage.module.css";

export default function AddExpensePage() {
  const { addExpense } = useExpenses();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({ desc: "", amount: "", category: "Food", date: today, note: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.desc || !form.amount || !form.date) {
      setError("Please fill in description, amount, and date.");
      return;
    }
    setLoading(true);
    try {
      await addExpense(form);
      navigate("/expenses");
    } catch (err) {
      setError("Failed to save expense. Try again.");
    }
    setLoading(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Add expense</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Description</label>
            <input name="desc" value={form.desc} onChange={handleChange} placeholder="e.g. Grocery run" />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Amount (₹)</label>
              <input name="amount" type="number" min="1" value={form.amount} onChange={handleChange} placeholder="500" />
            </div>
            <div className={styles.field}>
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} max={today} />
            </div>
          </div>

          <div className={styles.field}>
            <label>Note (optional)</label>
            <input name="note" value={form.note} onChange={handleChange} placeholder="Any extra details..." />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Saving..." : "Save expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
