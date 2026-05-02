// src/utils/helpers.js

export function formatINR(amount) {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

export function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[parseInt(m) - 1]} ${y}`;
}

export function exportToCSV(expenses) {
  if (expenses.length === 0) return;

  const headers = ["Description", "Amount (₹)", "Category", "Date", "Note"];
  const rows = expenses.map((e) => [
    `"${e.desc}"`,
    e.amount,
    e.category,
    e.date,
    `"${e.note || ""}"`,
  ]);

  const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}