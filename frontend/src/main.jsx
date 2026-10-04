import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
