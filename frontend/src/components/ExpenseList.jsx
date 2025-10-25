    import { useState, useRef } from "react";
    import {
    Card,
    CardContent,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    Chip,
    Stack,
    } from "@mui/material";
    import { TransitionGroup, CSSTransition } from "react-transition-group";
    import styled from "styled-components";
    import API from "../services/api";

    // --- Global styles for transitions ---
    const GlobalStyle = styled.div`
    .fade-enter {
        opacity: 0;
        transform: translateY(20px);
    }
    .fade-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 500ms ease-in, transform 500ms ease-in;
    }
    .fade-exit {
        opacity: 1;
        transform: translateY(0);
    }
    .fade-exit-active {
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 500ms ease-out, transform 500ms ease-out;
    }
    `;

    // --- Container for cards ---
    const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 15px;
    margin-top: 20px;
    `;

    // --- Expense card styling ---
    const ExpenseCard = styled(Card)`
    width: 100%;
    max-width: 100%;
    border-radius: 12px;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-left 0.3s ease;
    background: #fff;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    border-left: 6px solid transparent;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
    }

    &.high-priority {
        border-left-color: #f44336;
    }
    &.medium-priority {
        border-left-color: #ff9800;
    }
    &.low-priority {
        border-left-color: #4caf50;
    }

    &.recurring {
        background: #e3f2fd;
    }
    `;

    const ExpenseContent = styled(CardContent)`
    display: flex;
    flex-direction: column;
    gap: 5px;
    `;

    const ChipContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 5px;
    `;

    const AmountText = styled(Typography)`
    font-weight: 600;
    color: #1976d2;
    `;

    export default function ExpenseList({ expenses, fetchExpenses, setAlert }) {
    const [open, setOpen] = useState(false);
    const [currentExpense, setCurrentExpense] = useState({});
    const nodeRefs = useRef({});

    const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

    const handleDelete = async (id) => {
        try {
        await API.delete(`/expense/${id}`);
        fetchExpenses();
        } catch (error) {
        console.error("Failed to delete expense:", error);
        setAlert && setAlert({ type: "error", message: "Failed to delete expense" });
        }
    };

    const handleEdit = (expense) => {
        setCurrentExpense({
        ...expense,
        _id: expense._id,
        date: expense.date ? new Date(expense.date).toISOString().split("T")[0] : "",
        priority: expense.priority || "medium",
        tags: Array.isArray(expense.tags) ? expense.tags : [],
        recurring: !!expense.recurring,
        recurrenceType: expense.recurrenceType || "monthly",
        budgetType: expense.budgetType || "",
        paymentMethod: expense.paymentMethod || "cash",
        });
        setOpen(true);
    };

    const handleUpdate = async () => {
        if (!currentExpense._id) return;

        try {
        // Normalize enums to lowercase for backend
        const normalizeEnum = (value, defaultValue) =>
            value ? value.toString().toLowerCase() : defaultValue;

        const updatedExpense = {
            ...currentExpense,
            amount: Number(currentExpense.amount) || 0,
            budgetAmount: currentExpense.budgetAmount ? Number(currentExpense.budgetAmount) : 0,
            priority: normalizeEnum(currentExpense.priority, "medium"),
            paymentMethod: normalizeEnum(currentExpense.paymentMethod, "cash"),
            budgetType: normalizeEnum(currentExpense.budgetType, null),
            tags: Array.isArray(currentExpense.tags)
            ? currentExpense.tags.filter(Boolean)
            : currentExpense.tags?.split(",").map((t) => t.trim()).filter(Boolean) || [],
        };

        await API.put(`/expense/${currentExpense._id}`, updatedExpense);
        setOpen(false);
        fetchExpenses();
        } catch (error) {
        console.error("Failed to update expense:", error);
        setAlert && setAlert({ type: "error", message: "Failed to update expense" });
        }
    };

    const getPriorityClass = (priority) => {
        switch ((priority || "").toLowerCase()) {
        case "high":
            return "high-priority";
        case "medium":
            return "medium-priority";
        case "low":
            return "low-priority";
        default:
            return "";
        }
    };

    return (
        <GlobalStyle>
        <Container>
            <TransitionGroup component={null}>
            {expenses.map((exp) => {
                if (!nodeRefs.current[exp._id]) nodeRefs.current[exp._id] = { current: null };
                const nodeRef = nodeRefs.current[exp._id];

                return (
                <CSSTransition key={exp._id} nodeRef={nodeRef} timeout={500} classNames="fade">
                    <div ref={nodeRef} style={{ width: "100%" }}>
                    <ExpenseCard
                        className={`${getPriorityClass(exp.priority)} ${
                        exp.recurring ? "recurring" : ""
                        }`}
                    >
                        <ExpenseContent>
                        <Typography variant="h6">{exp.title}</Typography>
                        <AmountText>Amount: ${exp.amount}</AmountText>
                        <Typography>Category: {exp.category}</Typography>
                        {exp.date && (
                            <Typography variant="caption" color="text.secondary">
                            Date: {new Date(exp.date).toLocaleDateString()}
                            </Typography>
                        )}
                        {exp.description && <Typography fontStyle="italic">{exp.description}</Typography>}
                        {exp.recurring && <Typography color="primary">Recurring: {exp.recurrenceType}</Typography>}
                        {exp.budgetType && (
                            <Typography color="success.main">
                            Budget: {exp.budgetAmount} ({capitalize(exp.budgetType)})
                            </Typography>
                        )}
                        {exp.priority && <Chip label={`Priority: ${capitalize(exp.priority)}`} size="small" color="warning" />}
                        {exp.paymentMethod && <Typography>Payment: {capitalize(exp.paymentMethod)}</Typography>}
                        {exp.tags?.length > 0 && (
                            <ChipContainer>
                            {exp.tags.map((tag, idx) => (
                                <Chip key={idx} label={tag} size="small" color="secondary" />
                            ))}
                            </ChipContainer>
                        )}
                        <Stack direction="row" spacing={1} marginTop={1}>
                            <Button variant="contained" color="error" size="small" onClick={() => handleDelete(exp._id)}>
                            Delete
                            </Button>
                            <Button variant="contained" color="primary" size="small" onClick={() => handleEdit(exp)}>
                            Edit
                            </Button>
                        </Stack>
                        </ExpenseContent>
                    </ExpenseCard>
                    </div>
                </CSSTransition>
                );
            })}
            </TransitionGroup>

            {/* Edit Modal */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                <TextField
                    label="Title"
                    fullWidth
                    value={currentExpense.title || ""}
                    onChange={(e) => setCurrentExpense({ ...currentExpense, title: e.target.value })}
                />
                <TextField
                    label="Amount"
                    type="number"
                    fullWidth
                    value={currentExpense.amount || ""}
                    onChange={(e) => setCurrentExpense({ ...currentExpense, amount: e.target.value })}
                />
                <TextField
                    label="Category"
                    fullWidth
                    value={currentExpense.category || ""}
                    onChange={(e) => setCurrentExpense({ ...currentExpense, category: e.target.value })}
                />
                <TextField
                    label="Description"
                    fullWidth
                    value={currentExpense.description || ""}
                    onChange={(e) => setCurrentExpense({ ...currentExpense, description: e.target.value })}
                />
                <TextField
                    label="Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={currentExpense.date || ""}
                    onChange={(e) => setCurrentExpense({ ...currentExpense, date: e.target.value })}
                />
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={currentExpense.recurring || false}
                        onChange={(e) => setCurrentExpense({ ...currentExpense, recurring: e.target.checked })}
                    />
                    }
                    label="Recurring"
                />
                {currentExpense.recurring && (
                    <Select
                    value={currentExpense.recurrenceType || "monthly"}
                    onChange={(e) => setCurrentExpense({ ...currentExpense, recurrenceType: e.target.value })}
                    fullWidth
                    >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                )}
                <Select
                    value={currentExpense.budgetType || ""}
                    onChange={(e) => setCurrentExpense({ ...currentExpense, budgetType: e.target.value })}
                    fullWidth
                    displayEmpty
                >
                    <MenuItem value="">Budget Type (optional)</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                </Select>
                <TextField
                    label="Budget Amount"
                    type="number"
                    fullWidth
                    value={currentExpense.budgetAmount || ""}
                    onChange={(e) => setCurrentExpense({ ...currentExpense, budgetAmount: e.target.value })}
                />
                <Select
                    value={currentExpense.priority || ""}
                    onChange={(e) => setCurrentExpense({ ...currentExpense, priority: e.target.value.toLowerCase() })}
                    fullWidth
                    displayEmpty
                >
                    <MenuItem value="">Priority (optional)</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                </Select>
                <Select
                    value={currentExpense.paymentMethod || ""}
                    onChange={(e) => setCurrentExpense({ ...currentExpense, paymentMethod: e.target.value.toLowerCase() })}
                    fullWidth
                    displayEmpty
                >
                    <MenuItem value="">Payment Method (optional)</MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="upi">UPI</MenuItem>
                    <MenuItem value="wallet">Wallet</MenuItem>
                </Select>
                <TextField
                    label="Tags (comma separated)"
                    fullWidth
                    value={Array.isArray(currentExpense.tags) ? currentExpense.tags.join(", ") : ""}
                    onChange={(e) =>
                    setCurrentExpense({ ...currentExpense, tags: e.target.value.split(",").map((t) => t.trim()) })
                    }
                />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} color="secondary">
                Cancel
                </Button>
                <Button onClick={handleUpdate} color="primary">
                Update
                </Button>
            </DialogActions>
            </Dialog>
        </Container>
        </GlobalStyle>
    );
    }
