    import { useState } from "react";
    import API from "../services/api";
    import "../components/ExpenseForm.css";

    export default function ExpenseForm({ fetchExpenses, setAlert }) {
    const [form, setForm] = useState({
        title: "",
        amount: "",
        category: "",
        description: "",
        recurring: false,
        recurrenceType: "daily",
        budgetType: "",
        budgetAmount: "",
        paymentMethod: "cash",
        tags: "",
        currency: "USD",
        location: "",
        reimbursed: false,
        priority: "medium",
    });

    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.amount || !form.category) {
        setAlert?.({
            open: true,
            type: "warning",
            message: "Please fill in Title, Amount, and Category.",
        });
        return;
        }

        // ✅ Prepare payload in JSON format
        const payload = {
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category.trim(),
        description: form.description.trim(),
        recurring: Boolean(form.recurring),
        recurrenceType: form.recurrenceType,
        budgetType: form.budgetType || null,
        budgetAmount: form.budgetAmount ? Number(form.budgetAmount) : null,
        paymentMethod: form.paymentMethod,
        tags: form.tags
            ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
        currency: form.currency,
        location: form.location.trim(),
        reimbursed: Boolean(form.reimbursed),
        priority: form.priority,
        };

        console.log("Submitting expense:", payload);

        try {
        await API.post("/expense", payload, {
            headers: { "Content-Type": "application/json" },
        });

        // ✅ Reset form
        setForm({
            title: "",
            amount: "",
            category: "",
            description: "",
            recurring: false,
            recurrenceType: "daily",
            budgetType: "",
            budgetAmount: "",
            paymentMethod: "cash",
            tags: "",
            currency: "USD",
            location: "",
            reimbursed: false,
            priority: "medium",
        });
        setShowAdvanced(false);
        fetchExpenses();

        setAlert?.({
            open: true,
            type: "success",
            message: "Expense added successfully!",
        });
        } catch (err) {
        console.error("Failed to add expense:", err.response?.data || err.message);
        setAlert?.({
            open: true,
            type: "error",
            message:
            err.response?.data?.message ||
            "Failed to add expense. Please check your data.",
        });
        }
    };

    return (
        <form className="expense-form" onSubmit={handleSubmit}>
        {/* Basic Fields */}
        <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
        />
        <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
        />
        <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
        />
        <input
            type="text"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Recurring Expense */}
        <label>
            <input
            type="checkbox"
            checked={form.recurring}
            onChange={(e) =>
                setForm({ ...form, recurring: e.target.checked })
            }
            />{" "}
            Recurring Expense
        </label>
        {form.recurring && (
            <select
            value={form.recurrenceType}
            onChange={(e) =>
                setForm({ ...form, recurrenceType: e.target.value })
            }
            >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            </select>
        )}

        {/* Toggle Advanced Fields */}
        <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="toggle-advanced-btn"
        >
            {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
        </button>

        {showAdvanced && (
            <>
            {/* Budget */}
            <select
                value={form.budgetType}
                onChange={(e) =>
                setForm({ ...form, budgetType: e.target.value })
                }
            >
                <option value="">Budget Type (optional)</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
            <input
                type="number"
                placeholder="Budget Amount (optional)"
                value={form.budgetAmount}
                onChange={(e) =>
                setForm({ ...form, budgetAmount: e.target.value })
                }
            />

            {/* Payment Method */}
            <select
                value={form.paymentMethod}
                onChange={(e) =>
                setForm({ ...form, paymentMethod: e.target.value })
                }
            >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="online">Online</option>
            </select>

            {/* Tags */}
            <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />

            {/* Currency */}
            <select
                value={form.currency}
                onChange={(e) =>
                setForm({ ...form, currency: e.target.value })
                }
            >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
            </select>

            {/* Location */}
            <input
                type="text"
                placeholder="Location (optional)"
                value={form.location}
                onChange={(e) =>
                setForm({ ...form, location: e.target.value })
                }
            />

            {/* Reimbursed */}
            <label>
                <input
                type="checkbox"
                checked={form.reimbursed}
                onChange={(e) =>
                    setForm({ ...form, reimbursed: e.target.checked })
                }
                />{" "}
                Reimbursed
            </label>

            {/* Priority */}
            <select
                value={form.priority}
                onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
                }
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            </>
        )}

        <button type="submit">Add Expense</button>
        </form>
    );
    }
