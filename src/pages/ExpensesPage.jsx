// src/pages/ExpensesPage.jsx
import { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { CATEGORIES, CAT_COLORS } from "../hooks/useAnalytics";
import { formatINR, formatDisplayDate } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import styles from "./ExpensesPage.module.css";

const CAT_LIGHT = {
  Food: "#E6F1FB", Transport: "#E1F5EE", Shopping: "#FBEAF0",
  Entertainment: "#FAEEDA", Health: "#EAF3DE", Bills: "#EEEDFE", Other: "#F1EFE8",
};

export default function ExpensesPage() {
  const { expenses, loading, deleteExpense } = useExpenses();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const filtered = expenses
    .filter((e) => {
      const matchSearch = e.desc?.toLowerCase().includes(search.toLowerCase());
      const matchCat = !filterCat || e.category === filterCat;
      return matchSearch && matchCat;
    })
    .sort((a, b) => b.date?.localeCompare(a.date));

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  async function handleDelete(id) {
    if (!window.confirm("Delete this expense?")) return;
    setDeleting(id);
    await deleteExpense(id);
    setDeleting(null);
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>All expenses</h1>
        <button className={styles.addBtn} onClick={() => navigate("/add")}>+ Add expense</button>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className={styles.select}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length > 0 && (
        <p className={styles.summary}>
          {filtered.length} expense{filtered.length !== 1 ? "s" : ""} · {formatINR(total)}
        </p>
      )}

      <div className={styles.tableCard}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            {expenses.length === 0 ? "No expenses yet. Add your first one!" : "No results found."}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th className={styles.right}>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td>
                    <span className={styles.desc}>{e.desc}</span>
                    {e.note && <span className={styles.note}>{e.note}</span>}
                  </td>
                  <td>
                    <span
                      className={styles.badge}
                      style={{ background: CAT_LIGHT[e.category] || "#F1EFE8", color: CAT_COLORS[e.category] || "#888" }}
                    >
                      {e.category}
                    </span>
                  </td>
                  <td className={styles.date}>{formatDisplayDate(e.date)}</td>
                  <td className={styles.amount}>{formatINR(e.amount)}</td>
                  <td>
                    <button
                      className={styles.delBtn}
                      onClick={() => handleDelete(e.id)}
                      disabled={deleting === e.id}
                    >
                      {deleting === e.id ? "..." : "✕"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
