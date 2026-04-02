
// App.js
// Main application component for Quizbot frontend
// Provides navigation between Login and Register components
// Author: Quizbot Team

import './App.css';
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { Button, Box } from '@mui/material';


/**
 * Main App component with navigation between Login and Register.
 * @component
 */
function App() {
  // State to toggle between Login and Register views
  const [view, setView] = useState('login');

  // Handler after successful login
  const handleLogin = (user) => {
    // TODO: Redirect to dashboard or main app after login
    alert(`Logged in as ${user.email}`);
  };

  // Handler after successful registration
  const handleRegister = (user) => {
    // TODO: Redirect to login or main app after registration
    alert(`Registered as ${user.email}`);
    setView('login');
  };

  return (
    <Box className="App" sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
        <Button
          variant={view === 'login' ? 'contained' : 'outlined'}
          onClick={() => setView('login')}
          sx={{ mr: 1 }}
        >
          Login
        </Button>
        <Button
          variant={view === 'register' ? 'contained' : 'outlined'}
          onClick={() => setView('register')}
        >
          Register
        </Button>
      </Box>
      {view === 'login' ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Register onRegister={handleRegister} />
      )}
    </Box>
  );
}

export default App;
