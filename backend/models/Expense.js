import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },

  // Recurring expenses
  recurring: { type: Boolean, default: false },
  recurrenceType: { type: String, enum: ["daily", "weekly", "monthly"], default: null },
  recurrenceEndDate: { type: Date, default: null },

  // Optional details
  description: { type: String },
  attachments: [{ type: String }], // receipt images
  paymentMethod: { type: String, enum: ["cash", "credit_card", "debit_card", "upi", "other"], default: "cash" },
  location: { type: String },
  tags: [{ type: String }],
  currency: { type: String, default: "USD" },
  reimbursed: { type: Boolean, default: false },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },

  // Budget tracking
  budgetType: { type: String, enum: ["daily", "weekly", "monthly"], default: null },
  budgetAmount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);
