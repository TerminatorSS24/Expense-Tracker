// src/pages/DashboardPage.jsx
import { useExpenses } from "../context/ExpenseContext";
import { useAnalytics, CAT_COLORS, CATEGORIES } from "../hooks/useAnalytics";
import MetricCard from "../components/MetricCard";
import { formatINR } from "../utils/helpers";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const { expenses, loading } = useExpenses();
  const { totalThisMonth, countThisMonth, biggest, dailyAvg, byCategory, last6Months, stackedData } = useAnalytics(expenses);

  if (loading) return <div className={styles.loading}>Loading your expenses...</div>;

  return (
    <div className={styles.page}>
      {/* Metric Cards */}
      <div className={styles.metrics}>
        <MetricCard label="Total spent this month" value={formatINR(totalThisMonth)} sub="current month" />
        <MetricCard label="Transactions" value={countThisMonth} sub="this month" />
        <MetricCard label="Biggest expense" value={formatINR(biggest.amount)} sub={biggest.desc || "—"} />
        <MetricCard label="Daily average" value={formatINR(dailyAvg)} sub="per day" />
      </div>

      <div className={styles.chartRow}>
        {/* Pie chart */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Spending by category</h2>
          {byCategory.length === 0 ? (
            <p className={styles.empty}>No data yet</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={48}>
                    {byCategory.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatINR(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.legend}>
                {byCategory.map((c) => (
                  <div key={c.name} className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ background: c.color }} />
                    <span>{c.name}</span>
                    <span className={styles.legendVal}>{formatINR(c.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Monthly bar chart */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Monthly trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last6Months} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0efe8" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#888780" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} tick={{ fontSize: 11, fill: "#888780" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => formatINR(v)} />
              <Bar dataKey="total" fill="#378ADD" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stacked bar chart */}
      <div className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Category breakdown (last 6 months)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={stackedData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0efe8" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#888780" }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} tick={{ fontSize: 11, fill: "#888780" }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v) => formatINR(v)} />
            {CATEGORIES.map((cat) => (
              <Bar key={cat} dataKey={cat} stackId="a" fill={CAT_COLORS[cat]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <div className={styles.legend}>
          {CATEGORIES.map((cat) => (
            <div key={cat} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: CAT_COLORS[cat] }} />
              <span>{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
