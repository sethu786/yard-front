import React, { useState } from "react";
import "./index.css"; // We'll add CSS too

const AddTransaction = () => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    categoryId: "",
    type: "Expense",
    date: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const newTransaction = {
        title: formData.title,
        amount: parseInt(formData.amount),         // 🔥 Convert properly
        categoryId: parseInt(formData.categoryId), // 🔥 Convert properly
        type: formData.type,
        date: formData.date,
    };
    if (isNaN(newTransaction.categoryId)) {
      setStatus("Invalid category ID. It must be a number.");
      return;
    }

    try {

      const response = await fetch("https://yarb-back-1.onrender.com/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });

      if (response.ok) {
        setStatus("✅ Transaction added successfully!");
        setFormData({
          title: "",
          amount: "",
          categoryId: "",
          type: "Expense",
          date: "",
        });
      } else {
        const errorData = await response.json();
        setStatus(`❌ Failed to add transaction: ${errorData.message || "Unknown error"}`);
        console.error(errorData);
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Error connecting to server.");
    }
  };

  return (
    <div className="add-transaction-container">
      <h2>Add New Transaction</h2>
      <form onSubmit={handleSubmit} className="transaction-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="categoryId"
          placeholder="Category ID"
          value={formData.categoryId}
          onChange={handleChange}
          required
        />

        <select name="type" value={formData.type} onChange={handleChange} required>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Transaction</button>
      </form>

      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default AddTransaction;
