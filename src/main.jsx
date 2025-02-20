import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Render the React app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// Create meta tags for origin trials
const tokens = [
  { name: 'summarizer', env: import.meta.env.VITE_SUMMARIZER_TOKEN },
  { name: 'translator', env: import.meta.env.VITE_TRANSLATOR_TOKEN },
  { name: 'language-detector', env: import.meta.env.VITE_LANGUAGEDETECTOR_TOKEN },
];

tokens.forEach((token) => {
  if (token.env) {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'origin-trial';
    meta.content = token.env;
    document.head.append(meta);
  }
});