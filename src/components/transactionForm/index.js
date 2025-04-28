import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../../lib/validationSchemas";
import { categories } from "../../constants/predefinedCategories";
import "./TransactionForm.css"; // <- Updated CSS import

const TransactionForm = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  return (
    <div className="transaction-form-container">
      <h2 className="form-title">{defaultValues ? "Update" : "Add"} Transaction</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="transaction-form">
        <input
          type="number"
          placeholder="Amount"
          {...register("amount", { valueAsNumber: true })}
          className="form-input"
        />
        {errors.amount && <span className="form-error">{errors.amount.message}</span>}

        <input
          type="date"
          {...register("date")}
          className="form-input"
        />
        {errors.date && <span className="form-error">{errors.date.message}</span>}

        <input
          type="text"
          placeholder="Description"
          {...register("description")}
          className="form-input"
        />
        {errors.description && <span className="form-error">{errors.description.message}</span>}

        <select {...register("category")} className="form-input">
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <span className="form-error">{errors.category.message}</span>}

        <button type="submit" className="form-button">
          {defaultValues ? "Update" : "Add"} Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
