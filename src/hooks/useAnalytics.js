// src/hooks/useAnalytics.js
import { useMemo } from "react";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";

export const CATEGORIES = ["Food", "Transport", "Shopping", "Entertainment", "Health", "Bills", "Other"];

export const CAT_COLORS = {
  Food: "#378ADD",
  Transport: "#1D9E75",
  Shopping: "#D4537E",
  Entertainment: "#BA7517",
  Health: "#639922",
  Bills: "#7F77DD",
  Other: "#888780",
};

export function useAnalytics(expenses) {
  return useMemo(() => {
    const now = new Date();
    const currentMonthKey = format(now, "yyyy-MM");

    // Current month expenses
    const thisMonth = expenses.filter((e) => e.date?.startsWith(currentMonthKey));

    // Total spent this month
    const totalThisMonth = thisMonth.reduce((s, e) => s + e.amount, 0);

    // Biggest single expense this month
    const biggest = thisMonth.reduce((a, e) => (e.amount > a.amount ? e : a), { amount: 0 });

    // Days in current month for daily average
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dailyAvg = totalThisMonth / daysInMonth;

    // Spending by category (all time)
    const byCategory = CATEGORIES.map((cat) => ({
      name: cat,
      value: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
      color: CAT_COLORS[cat],
    })).filter((c) => c.value > 0);

    // Last 6 months totals
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(now, 5 - i);
      const key = format(d, "yyyy-MM");
      const label = format(d, "MMM");
      const total = expenses
        .filter((e) => e.date?.startsWith(key))
        .reduce((s, e) => s + e.amount, 0);
      return { key, label, total };
    });

    // Stacked chart: category breakdown per month (last 6)
    const stackedData = last6Months.map(({ key, label }) => {
      const row = { month: label };
      CATEGORIES.forEach((cat) => {
        row[cat] = expenses
          .filter((e) => e.date?.startsWith(key) && e.category === cat)
          .reduce((s, e) => s + e.amount, 0);
      });
      return row;
    });

    return {
      totalThisMonth,
      countThisMonth: thisMonth.length,
      biggest,
      dailyAvg,
      byCategory,
      last6Months,
      stackedData,
    };
  }, [expenses]);
}
