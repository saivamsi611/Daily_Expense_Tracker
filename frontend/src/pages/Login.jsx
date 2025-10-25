    import { useState, useContext } from "react";
    import { AuthContext } from "../context/AuthContext";
    import API from "../services/api";
    import { Link, useNavigate } from "react-router-dom";
    import styled, { keyframes } from "styled-components";

    // Animations
    const fadeIn = keyframes`n
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
    `;

    const float = keyframes`
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -30px) rotate(5deg); }
    66% { transform: translate(-20px, 20px) rotate(-5deg); }
    `;

    const shimmer = keyframes`
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
    `;

    const pulse = keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
    `;

    // Styled Components
    const Container = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
    padding: 20px;
    
    &::before {
        content: '';
        position: absolute;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent);
        border-radius: 50%;
        top: -250px;
        left: -250px;
        animation: ${float} 20s ease-in-out infinite;
    }
    
    &::after {
        content: '';
        position: absolute;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.08), transparent);
        border-radius: 50%;
        bottom: -200px;
        right: -200px;
        animation: ${float} 15s ease-in-out infinite reverse;
    }
    `;

    const LoginCard = styled.div`
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 50px 40px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.3);
    position: relative;
    z-index: 1;
    animation: ${fadeIn} 0.8s ease-out;
    
    @media(max-width: 480px) {
        padding: 40px 30px;
    }
    `;

    const Logo = styled.div`
    text-align: center;
    margin-bottom: 35px;
    
    .icon {
        font-size: 4rem;
        margin-bottom: 15px;
        display: inline-block;
        animation: ${pulse} 2s ease-in-out infinite;
    }
    `;

    const Title = styled.h4`
    font-size: 2rem;
    font-weight: 800;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 10px 0;
    letter-spacing: -0.5px;
    `;

    const Subtitle = styled.p`
    text-align: center;
    color: #666;
    font-size: 0.95rem;
    margin: 0 0 35px 0;
    `;

    const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
    `;

    const InputWrapper = styled.div`
    position: relative;
    `;

    const Input = styled.input`
    width: 100%;
    padding: 16px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #fafafa;
    box-sizing: border-box;
    
    &:focus {
        outline: none;
        border-color: #667eea;
        background: white;
        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        transform: translateY(-2px);
    }
    
    &::placeholder {
        color: #999;
    }
    `;

    const Button = styled.button`
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    margin-top: 10px;
    position: relative;
    overflow: hidden;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.5s;
    }
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        
        &::before {
        left: 100%;
        }
    }
    
    &:active {
        transform: translateY(0);
    }
    `;

    const RegisterLink = styled.div`
    text-align: center;
    margin-top: 25px;
    color: #666;
    font-size: 0.95rem;
    
    a {
        color: #667eea;
        text-decoration: none;
        font-weight: 700;
        transition: all 0.3s ease;
        position: relative;
        
        &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transition: width 0.3s ease;
        }
        
        &:hover {
        color: #764ba2;
        
        &::after {
            width: 100%;
        }
        }
    }
    `;

    const Divider = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    margin: 25px 0;
    color: #999;
    font-size: 0.85rem;
    
    &::before,
    &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid #e0e0e0;
    }
    
    &::before {
        margin-right: 15px;
    }
    
    &::after {
        margin-left: 15px;
    }
    `;

    const FeatureList = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
    padding-top: 25px;
    border-top: 1px solid #e0e0e0;
    `;

    const Feature = styled.div`
    text-align: center;
    flex: 1;
    
    .feature-icon {
        font-size: 1.5rem;
        margin-bottom: 8px;
    }
    
    .feature-text {
        font-size: 0.75rem;
        color: #666;
    }
    `;

    export default function Login() {
    const { setUser, setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await API.post("/user/login", form);
        setUser(res.data.user);
        setToken(res.data.token);
        navigate("/dashboard");
        } catch (err) {
        alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <Container>
        <LoginCard>
            <Logo>
            <div className="icon">💰</div>
            </Logo>
            <Title>Welcome Back</Title>
            <Subtitle>Track your expenses with ease</Subtitle>
            
            <Form onSubmit={handleSubmit}>
            <InputWrapper>
                <Input
                type="email"
                placeholder="Email Address"
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
            </InputWrapper>
            
            <InputWrapper>
                <Input
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
            </InputWrapper>
            
            <Button type="submit">Login</Button>
            </Form>
            
            <RegisterLink>
            Don't have an account? <Link to="/register">Register</Link>
            </RegisterLink>
            
            <FeatureList>
            <Feature>
                <div className="feature-icon">📊</div>
                <div className="feature-text">Track Expenses</div>
            </Feature>
            <Feature>
                <div className="feature-icon">📈</div>
                <div className="feature-text">View Analytics</div>
            </Feature>
            <Feature>
                <div className="feature-icon">🔒</div>
                <div className="feature-text">Secure Data</div>
            </Feature>
            </FeatureList>
        </LoginCard>
        </Container>
    );
    }