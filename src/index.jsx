// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import MainRouter from './MainRouter'; // Import the MainRouter component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <MainRouter />
  </Router>
);
