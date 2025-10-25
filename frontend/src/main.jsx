import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { createGlobalStyle } from "styled-components";

// Global Styles with Modern CSS
const GlobalStyles = createGlobalStyle`
  /* CSS Reset & Base Styles */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #f0f2f5;
    color: #333;
    line-height: 1.6;
    overflow-x: hidden;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    transition: background 0.3s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }

  /* Firefox Scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: #667eea #f1f1f1;
  }

  /* Selection Styles */
  ::selection {
    background: rgba(102, 126, 234, 0.3);
    color: #333;
  }

  ::-moz-selection {
    background: rgba(102, 126, 234, 0.3);
    color: #333;
  }

  /* Focus Styles for Accessibility */
  *:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }

  *:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  /* Link Styles */
  a {
    color: #667eea;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: #764ba2;
  }

  /* Button Reset */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  /* Input Reset */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }

  /* Utility Classes */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .text-center {
    text-align: center;
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Loading Animation */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Responsive Typography */
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: 700;
    line-height: 1.2;
    color: #222;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 3rem);
  }

  h2 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
  }

  h3 {
    font-size: clamp(1.5rem, 3vw, 2rem);
  }

  h4 {
    font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  }

  h5 {
    font-size: clamp(1.1rem, 2vw, 1.5rem);
  }

  h6 {
    font-size: clamp(1rem, 1.5vw, 1.25rem);
  }

  p {
    margin: 0 0 1rem 0;
  }

  /* Card Shadow Utilities */
  .shadow-sm {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .shadow {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .shadow-lg {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  }

  /* Gradient Text Utility */
  .gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Glass Morphism Utility */
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  /* Smooth Transitions */
  * {
    transition-property: none;
    transition-duration: 0.2s;
    transition-timing-function: ease;
  }

  /* Disable transitions on page load */
  .preload * {
    transition: none !important;
  }

  /* Media Query Helpers */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    html {
      font-size: 13px;
    }
  }

  /* Print Styles */
  @media print {
    body {
      background: white;
    }
    
    .no-print {
      display: none !important;
    }
  }

  /* Dark Mode Support (Optional) */
  @media (prefers-color-scheme: dark) {
    /* Uncomment if you want to add dark mode support
    body {
      background: #1a1a1a;
      color: #f0f0f0;
    }
    */
  }

  /* Reduced Motion for Accessibility */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Loading State */
  .loading {
    pointer-events: none;
    opacity: 0.6;
  }

  /* Disabled State */
  :disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Image Optimization */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Remove default list styles */
  ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;

// Add class to prevent transitions on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    document.body.classList.remove('preload');
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalStyles />
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);