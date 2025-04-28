import React, { useEffect, useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Line } from "recharts";
import "./index.css";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [budgetComparison, setBudgetComparison] = useState([]);
  const [insights, setInsights] = useState([]);
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"];

  const prepareBudgetComparison = useCallback((transactionsData) => {
    const actuals = {};

    transactionsData.forEach((txn) => {
      const category = txn.category_id || "Other";
      actuals[category] = (actuals[category] || 0) + txn.amount;
    });

    const comparison = budgets.map((budget) => ({
      category: budget.categoryName,
      budgeted: budget.amount,
      spent: actuals[budget.categoryName] || 0,
    }));

    setBudgetComparison(comparison);
    generateInsights(comparison);
  }, [budgets]);

  const generateInsights = (comparison) => {
    const overBudget = comparison.filter(item => item.spent > item.budgeted);
    setInsights(overBudget);
  };

  const processTransactionData = useCallback((data) => {
    const monthly = {};
    const categories = {};

    data.forEach((txn) => {
      const month = txn.date.slice(0, 7); // YYYY-MM
      monthly[month] = (monthly[month] || 0) + txn.amount;

      const category = txn.category_id || "Other";
      categories[category] = (categories[category] || 0) + txn.amount;
    });

    setMonthlyData(Object.entries(monthly).map(([month, amount]) => ({ month, amount })));
    setCategoryData(Object.entries(categories).map(([category, amount]) => ({ category, amount })));

    prepareBudgetComparison(data);
  }, [prepareBudgetComparison]);

  const fetchBudgets = useCallback(async () => {
    const res = await fetch("http://localhost:3000/api/budgets");
    const data = await res.json();
    setBudgets(data);
  }, []);

  const fetchTransactions = useCallback(async () => {
    const res = await fetch("http://localhost:3000/api/transactions");
    const data = await res.json();
    setTransactions(data);
    processTransactionData(data);
  }, [processTransactionData]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchBudgets();
      await fetchTransactions();
    };
    fetchData();
  }, [fetchBudgets, fetchTransactions]);

  const totalExpenses = transactions.reduce((acc, txn) => acc + txn.amount, 0);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>Total Expenses</h3>
          <p>${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Transactions</h3>
          <p>{transactions.length}</p>
        </div>
        <div className="card">
          <h3>Categories</h3>
          <p>{categoryData.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Monthly Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Budget vs Actual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetComparison}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budgeted" fill="#00C49F" />
              <Line type="monotone" dataKey="spent" stroke="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Spending Insights</h3>
          {insights.length === 0 ? (
            <p>You're within your budget! 🎯</p>
          ) : (
            <ul className="insights-list">
              {insights.map((item, idx) => (
                <li key={idx}>
                  Over budget on <strong>{item.category}</strong> by ${(item.spent - item.budgeted).toFixed(2)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
