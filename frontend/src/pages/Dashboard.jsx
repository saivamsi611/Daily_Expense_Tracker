import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/Chart";
import API from "../services/api";
import {
    Button,
    Typography,
    Card,
    CardContent,
    IconButton,
    Snackbar,
    Alert,
    TextField,
} from "@mui/material";
import styled, { keyframes } from "styled-components";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

// Floating animation for background (optional)
const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
`;

// Container
const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background: ${({ $dark }) =>
        $dark
            ? "#1e1e2f"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
    position: relative;
    overflow: hidden;
    color: ${({ $dark }) => ($dark ? "#fff" : "white")};
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.3), transparent 50%);
        pointer-events: none;
    }
    
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

// Sidebar
const Sidebar = styled.div`
    width: 280px;
    background: ${({ $dark }) => ($dark ? "#2c2c3e" : "rgba(255,255,255,0.1)")};
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(255,255,255,0.2);
    color: ${({ $dark }) => ($dark ? "#fff" : "white")};
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid rgba(255,255,255,0.2);
    }
`;

// Logo
const Logo = styled.div`
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(135deg, #ffffff 0%, #f0e6ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 10px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

// Welcome text
const WelcomeText = styled.div`
    font-size: 1rem;
    opacity: 0.95;
    font-weight: 500;
    padding: 15px;
    background: rgba(255,255,255,0.1);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.2);
    backdrop-filter: blur(5px);
`;

// Styled button
const StyledButton = styled(Button)`
    && {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        text-transform: none;
        font-size: 1rem;
        box-shadow: 0 4px 15px rgba(245,87,108,0.4);
        transition: all 0.3s ease;
        
        &:hover {
            background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245,87,108,0.6);
        }
    }
`;

// Main content
const Main = styled.div`
    flex: 1;
    padding: 30px;
    overflow-y: auto;
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
        padding: 20px;
    }
`;

// Page title
const PageTitle = styled(Typography)`
    && {
        font-size: 2.5rem;
        font-weight: 800;
        color: white;
        margin-bottom: 30px;
        text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        
        @media (max-width: 768px) {
            font-size: 2rem;
        }
    }
`;

// Card
const StyledCard = styled(Card)`
    && {
        margin-bottom: 24px;
        border-radius: 20px;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.3);
        transition: all 0.3s ease;
        overflow: visible;
        
        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 48px rgba(0,0,0,0.15);
        }
    }
`;

// Card title
const CardTitle = styled(Typography)`
    && {
        font-size: 1.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 20px;
    }
`;

// Card content
const StyledCardContent = styled(CardContent)`
    && {
        padding: 30px;
        
        &:last-child {
            padding-bottom: 30px;
        }
    }
`;

// Search input
const SearchInput = styled(TextField)`
    && {
        margin-bottom: 20px;
        width: 100%;
        background: white;
        border-radius: 8px;
        
        .MuiOutlinedInput-root {
            border-radius: 8px;
        }
    }
`;

export default function Dashboard() {
    const { user, setUser, setToken } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [alert, setAlert] = useState({ open: false, type: "success", message: "" });
    const [search, setSearch] = useState("");

    const fetchExpenses = async () => {
        try {
            const res = await API.get("/expense");
            const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setExpenses(sorted);
        } catch (err) {
            console.error("Failed to fetch expenses:", err);
            setAlert({ open: true, type: "error", message: "Failed to fetch expenses!" });
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
    };

    const toggleTheme = () => setDarkMode(!darkMode);

    // CSV export including new fields
    const handleExportCSV = () => {
        if (!expenses.length) {
            setAlert({ open: true, type: "warning", message: "No expenses to export!" });
            return;
        }
        
        const headers = [
            "title",
            "amount",
            "category",
            "date",
            "description",
            "recurring",
            "recurrenceType",
            "budgetType",
            "budgetAmount",
            "priority",
            "tags",
            "paymentMethod"
        ];
        
        const csvRows = [
            headers.join(','),
            ...expenses.map(exp => 
                headers.map(h => {
                    const value = exp[h];
                    // Handle arrays (like tags)
                    if (Array.isArray(value)) {
                        return `"${value.join('; ')}"`;
                    }
                    // Handle dates
                    if (h === 'date' && value) {
                        return `"${new Date(value).toLocaleDateString()}"`;
                    }
                    // Handle other values
                    return `"${value || ""}"`;
                }).join(',')
            )
        ];
        
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        setAlert({ open: true, type: "success", message: "CSV exported successfully!" });
    };

    // Filter expenses by title, category, or tags
    const filteredExpenses = expenses.filter(exp =>
        exp.title?.toLowerCase().includes(search.toLowerCase()) ||
        exp.category?.toLowerCase().includes(search.toLowerCase()) ||
        (exp.tags && exp.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
    );

    return (
        <Container $dark={darkMode}>
            <Sidebar $dark={darkMode}>
                <Logo>💰 Expense Tracker</Logo>
                <WelcomeText>Hello, {user?.name || 'User'}! 👋</WelcomeText>
                <div style={{ display: "flex", gap: "10px" }}>
                    <IconButton onClick={logout} sx={{ color: "white" }} aria-label="logout">
                        <LogoutIcon />
                    </IconButton>
                    <IconButton onClick={toggleTheme} sx={{ color: "white" }} aria-label="toggle theme">
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </div>
                <StyledButton onClick={handleExportCSV}>Export CSV</StyledButton>
            </Sidebar>

            <Main>
                <PageTitle>Dashboard</PageTitle>

                <StyledCard>
                    <StyledCardContent>
                        <CardTitle>Add New Expense</CardTitle>
                        <ExpenseForm fetchExpenses={fetchExpenses} setAlert={setAlert} />
                    </StyledCardContent>
                </StyledCard>

                <StyledCard>
                    <StyledCardContent>
                        <CardTitle>Search & Recent Expenses</CardTitle>
                        <SearchInput
                            placeholder="Search by title, category, tags..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            variant="outlined"
                        />
                        <ExpenseList 
                            expenses={filteredExpenses} 
                            fetchExpenses={fetchExpenses} 
                            setAlert={setAlert} 
                        />
                    </StyledCardContent>
                </StyledCard>

                <StyledCard>
                    <StyledCardContent>
                        <CardTitle>Expense Analytics</CardTitle>
                        <ExpenseChart data={expenses} />
                    </StyledCardContent>
                </StyledCard>
            </Main>

            {/* Snackbar notifications */}
            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={() => setAlert({ ...alert, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity={alert.type} variant="filled" onClose={() => setAlert({ ...alert, open: false })}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}