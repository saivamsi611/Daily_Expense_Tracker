    import express from "express";
    import Expense from "../models/Expense.js";
    import { verifyToken } from "../middleware/auth.js";
    import { Parser } from "json2csv";
    import multer from "multer";
    import csv from "csv-parser";
    import fs from "fs";

    const router = express.Router();
    const upload = multer({ dest: "uploads/" });

    // ------------------ Add Expense ------------------
    router.post("/", verifyToken, upload.array("attachments"), async (req, res) => {
    try {
        const {
        title, amount, category, description,
        recurring, recurrenceType, budgetType,
        budgetAmount, paymentMethod, tags,
        currency, location, reimbursed, priority,
        } = req.body;

        if (!title || !amount || !category) {
        return res.status(400).json({ message: "Title, amount, and category are required." });
        }

        const newExpense = await Expense.create({
        userId: req.user._id,
        title,
        amount: Number(amount),
        category,
        description: description || "",
        recurring: recurring === "true" || recurring === true,
        recurrenceType: recurrenceType || "daily",
        budgetType: budgetType || null,
        budgetAmount: budgetAmount ? Number(budgetAmount) : 0,
        paymentMethod: paymentMethod || "cash",
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map(tag => tag.trim())) : [],
        currency: currency || "USD",
        attachments: req.files ? req.files.map(f => f.path) : [],
        location: location || "",
        reimbursed: reimbursed === "true" || reimbursed === true,
        priority: priority || "medium",
        date: new Date(),
        });

        res.status(201).json(newExpense);
    } catch (err) {
        console.error("Add Expense Error:", err);
        res.status(500).json({ message: err.message });
    }
    });

    // ------------------ Get All Expenses ------------------
    router.get("/", verifyToken, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });

    // ------------------ Update Expense ------------------
    router.put("/:id", verifyToken, upload.array("attachments"), async (req, res) => {
    try {
        const updatedData = { ...req.body };

        // Handle booleans
        ["recurring", "reimbursed"].forEach(field => {
        if (updatedData[field] !== undefined) {
            updatedData[field] = updatedData[field] === "true" || updatedData[field] === true;
        }
        });

        // Handle numbers
        ["amount", "budgetAmount"].forEach(field => {
        if (updatedData[field] !== undefined && updatedData[field] !== "") {
            updatedData[field] = Number(updatedData[field]);
        }
        });

        // Handle tags safely
        if (updatedData.tags) {
        if (Array.isArray(updatedData.tags)) {
            updatedData.tags = updatedData.tags.map(tag => tag.trim());
        } else {
            updatedData.tags = updatedData.tags.split(",").map(tag => tag.trim());
        }
        }

        // Handle attachments (merge new with existing)
        if (req.files && req.files.length > 0) {
        updatedData.attachments = req.files.map(f => f.path);
        }

        // Update in DB
        const expense = await Expense.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        updatedData,
        { new: true, runValidators: true }
        );

        if (!expense) {
        return res.status(404).json({ message: "Expense not found or you are not authorized." });
        }

        res.json(expense);
    } catch (err) {
        console.error("Update Expense Error:", err);
        res.status(500).json({ message: err.message });
    }
    });

    // ------------------ Delete Expense ------------------
    router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!expense) return res.status(404).json({ message: "Expense not found." });
        res.json({ message: "Expense deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });

    // ------------------ Generate Recurring ------------------
    router.post("/generate-recurring", verifyToken, async (req, res) => {
    try {
        const today = new Date();
        const recurringExpenses = await Expense.find({ userId: req.user._id, recurring: true });
        const newExpenses = [];

        for (const exp of recurringExpenses) {
        const exists = await Expense.findOne({
            userId: req.user._id,
            title: exp.title,
            date: {
            $gte: new Date(today.setHours(0, 0, 0, 0)),
            $lte: new Date(today.setHours(23, 59, 59, 999))
            }
        });

        if (!exists) {
            newExpenses.push(await Expense.create({
            userId: exp.userId,
            title: exp.title,
            amount: exp.amount,
            category: exp.category,
            description: exp.description || "",
            attachments: exp.attachments || [],
            paymentMethod: exp.paymentMethod || "cash",
            tags: exp.tags || [],
            currency: exp.currency || "USD",
            location: exp.location || "",
            reimbursed: exp.reimbursed || false,
            priority: exp.priority || "medium",
            date: new Date(),
            recurring: exp.recurring,
            recurrenceType: exp.recurrenceType || "daily",
            budgetType: exp.budgetType || null,
            budgetAmount: exp.budgetAmount || 0
            }));
        }
        }

        res.json({ message: "Recurring expenses generated", expenses: newExpenses });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });

    // ------------------ Export CSV ------------------
    router.get("/export/csv", verifyToken, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
        const fields = [
        "title","amount","category","date","description",
        "attachments","paymentMethod","tags","currency",
        "location","reimbursed","priority","recurring",
        "recurrenceType","budgetType","budgetAmount"
        ];
        const parser = new Parser({ fields });
        const csv = parser.parse(expenses);

        res.header("Content-Type", "text/csv");
        res.attachment("expenses.csv");
        res.send(csv);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });

    // ------------------ Import CSV ------------------
    router.post("/import/csv", verifyToken, upload.single("file"), async (req, res) => {
    try {
        const results = [];
        fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", data => results.push(data))
        .on("end", async () => {
            const expensesToInsert = results.map(exp => ({
            userId: req.user._id,
            title: exp.title,
            amount: Number(exp.amount),
            category: exp.category,
            description: exp.description || "",
            attachments: exp.attachments ? exp.attachments.split(",") : [],
            paymentMethod: exp.paymentMethod || "cash",
            tags: exp.tags ? exp.tags.split(",") : [],
            currency: exp.currency || "USD",
            location: exp.location || "",
            reimbursed: exp.reimbursed === "true",
            priority: exp.priority || "medium",
            recurring: exp.recurring === "true",
            recurrenceType: exp.recurrenceType || "daily",
            budgetType: exp.budgetType || null,
            budgetAmount: Number(exp.budgetAmount) || 0,
            date: exp.date ? new Date(exp.date) : new Date()
            }));

            await Expense.insertMany(expensesToInsert);
            fs.unlinkSync(req.file.path);
            res.json({ message: "CSV imported successfully", imported: expensesToInsert.length });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });

    export default router;
