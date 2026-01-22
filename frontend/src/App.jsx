import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import LandingPage from './pages/home/LandingPage.jsx';
import HomePage from './pages/home/HomePage.jsx';
import AgentPage from './pages/home/AgentPage.jsx';
import CustomerPage from './pages/home/CustomerPage.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/customer" element={<CustomerPage />} />
      </Routes>
    </Router>
  );
};

export default App;
