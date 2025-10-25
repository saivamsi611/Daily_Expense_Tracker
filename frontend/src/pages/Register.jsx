    import { useState, useContext } from "react";
    import { AuthContext } from "../context/AuthContext";
    import API from "../services/api";
    import { Link, useNavigate } from "react-router-dom";
    import "../pages/Register.css";

    export default function Register() {
    const { setUser, setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await API.post("/user/register", form);
        setUser(res.data.user);
        setToken(res.data.token);
        navigate("/dashboard");
        } catch (err) {
        alert(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="register-container">
        <h4>Register</h4>
        <form className="register-form" onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Name"
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit">Register</button>
            <div className="login-link">
            Already have an account? <Link to="/login">Login</Link>
            </div>
        </form>
        </div>
    );
    }
