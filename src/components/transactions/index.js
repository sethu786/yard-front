import React, { useEffect, useState } from "react";
import "./index.css"; // <-- use new CSS file

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const res = await fetch("http://localhost:3000/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  const deleteTransaction = async (id) => {
    await fetch(`http://localhost:3000/api/transactions/${id}`, { method: "DELETE" });
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="transactions-container">
      <h1 className="transactions-title">Transactions</h1>
      <div className="transactions-table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.transaction_id}>
                <td>{txn.title}</td>
                <td>${txn.amount}</td>
                <td>{txn.category_id}</td>
                <td>{txn.date}</td>
                <td>
                  <button
                    onClick={() => deleteTransaction(txn.transaction_id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
