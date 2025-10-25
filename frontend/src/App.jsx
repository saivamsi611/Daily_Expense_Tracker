import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import styled, { keyframes } from "styled-components";

// Animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;

// Styled Components
const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    animation: ${pulse} 4s ease-in-out infinite;
  }

  &::before {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255,255,255,0.1), transparent);
    top: -250px;
    right: -250px;
  }

  &::after {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255,255,255,0.08), transparent);
    bottom: -200px;
    left: -200px;
    animation-duration: 3s;
    animation-direction: reverse;
  }
`;

const LoadingContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
`;

const LogoContainer = styled.div`
  margin-bottom: 30px;
  .logo-icon {
    font-size: 5rem;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255,255,255,0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 20px;
`;

const LoadingText = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 20px 0 10px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
`;

const LoadingSubtext = styled.p`
  color: rgba(255,255,255,0.9);
  font-size: 1rem;
  margin: 0;
`;

const AppContainer = styled.div`
  min-height: 100vh;
  animation: ${fadeIn} 0.3s ease-out;
`;

// Protected Route
const ProtectedRoute = ({ children, user, redirectTo = "/login" }) => {
  return user ? children : <Navigate to={redirectTo} replace />;
};

// Public Route
const PublicRoute = ({ children, user, redirectTo = "/dashboard" }) => {
  return user ? <Navigate to={redirectTo} replace /> : children;
};

export default function App() {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // simulate auth check/loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <LogoContainer>
            <div className="logo-icon">💰</div>
          </LogoContainer>
          <Spinner />
          <LoadingText>Daily Expense Tracker</LoadingText>
          <LoadingSubtext>Loading your financial dashboard...</LoadingSubtext>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  return (
    <AppContainer>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute user={user}><Login /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute user={user}><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute user={user}><Register /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppContainer>
  );
}
