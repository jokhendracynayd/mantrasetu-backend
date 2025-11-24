import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    height: 100%;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(34, 139, 34, 0.02) 0%, transparent 50%),
      linear-gradient(135deg, #FFFEF7 0%, #FFF8DC 100%);
    background-attachment: fixed;
  }

  body {
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 107, 53, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(34, 139, 34, 0.02) 0%, transparent 50%),
      linear-gradient(135deg, #FFFEF7 0%, #FFF8DC 100%);
    background-attachment: fixed;
    color: #333333;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #ff6b35;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #e55a2b;
  }

  /* Selection */
  ::selection {
    background-color: #ff6b35;
    color: white;
  }

  /* Focus styles */
  *:focus {
    outline: 2px solid #ff6b35;
    outline-offset: 2px;
    border:none;
  }

  /* Button reset */
  // button {
  //   border: none;
  //   background: none;
  //   cursor: pointer;
  //   font-family: inherit;
  // }

  /* Input reset */
  input, textarea, select {
    font-family: inherit;
    /* border: none; */ /* Commented out to allow custom borders */
    outline: none;
  }

  /* Link reset */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* List reset */
  ul, ol {
    list-style: none;
  }

  /* Image reset */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Vedic Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 0.5rem;
    // font-family: 'Playfair Display', 'Times New Roman', serif;
  }
  
  /* Sanskrit text styling */
  .sanskrit {
    font-family: 'Noto Sans Devanagari', 'Sanskrit Text', serif;
    font-weight: 500;
  }
  
  .vedic-title {
    // font-family: 'Playfair Display', 'Times New Roman', serif;
    color: #8B0000;
    text-shadow: 1px 1px 2px rgba(255, 215, 0, 0.3);
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.75rem;
  }

  h4 {
    font-size: 1.5rem;
  }

  h5 {
    font-size: 1.25rem;
  }

  h6 {
    font-size: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  /* Utility classes */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  .d-none {
    display: none;
  }

  .d-block {
    display: block;
  }

  .d-flex {
    display: flex;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .align-center {
    align-items: center;
  }

  .flex-column {
    flex-direction: column;
  }

  .w-100 {
    width: 100%;
  }

  .h-100 {
    height: 100%;
  }

  /* Animation classes */
  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }

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

  .slide-up {
    animation: slideUp 0.5s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive breakpoints */
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
    
    .container {
      padding: 0 0.5rem;
    }
  }

  @media (max-width: 480px) {
    html {
      font-size: 12px;
    }
  }
`;

export default GlobalStyles;
