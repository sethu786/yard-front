import React, { useState, useEffect } from "react";
import "./index.css";

const Budgets = () => {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("expense");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchBudgets();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/budgets");
      if (!res.ok) throw new Error("Failed to fetch budgets");
      const data = await res.json();
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !newCategoryType) {
      alert("Please enter category name and select type");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName, type: newCategoryType }),
      });
      if (!res.ok) throw new Error("Failed to add category");

      alert("Category added successfully!");
      setNewCategoryName("");
      setNewCategoryType("expense");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Error adding category");
    }
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!selectedCategoryId || !amount) {
      alert("Please select a category and enter amount");
      return;
    }
    try {
      await fetch("http://localhost:3000/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId: selectedCategoryId, amount: parseFloat(amount) }),
      });
      alert("Budget added successfully!");
      setSelectedCategoryId("");
      setAmount("");
      fetchBudgets();
    } catch (error) {
      console.error("Error adding budget:", error);
      alert("Error saving budget");
    }
  };

  return (
    <div className="budgets-container">
      <h1>Manage Budgets</h1>

      {/* Add New Category */}
      <form className="form-section" onSubmit={handleAddCategory}>
        <h2>Add New Category</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <select
            value={newCategoryType}
            onChange={(e) => setNewCategoryType(e.target.value)}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button type="submit">Add Category</button>
        </div>
      </form>

      {/* Categories List */}
      <div className="list-section">
        <h2>Available Categories</h2>
        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <div className="categories-grid">
            {categories.map((cat) => (
              <div key={cat.category_id} className="category-card">
                <p><strong>Name:</strong> {cat.name}</p>
                <p><strong>ID:</strong> {cat.category_id}</p>
                <p><strong>Type:</strong> {cat.type}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Budget */}
      <form className="form-section" onSubmit={handleAddBudget}>
        <h2>Assign Budget to Category</h2>
        <div className="form-group">
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name} ({cat.type})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Enter Budget Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button type="submit">Save Budget</button>
        </div>
      </form>

      {/* Budget List */}
      <div className="list-section">
        <h2>Budgets</h2>
        {budgets.length === 0 ? (
          <p>No budgets found.</p>
        ) : (
          <ul className="budget-list">
            {budgets.map((budget, idx) => (
              <li key={idx}>
                <strong>{budget.categoryName}</strong>: ${budget.amount}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Budgets;
