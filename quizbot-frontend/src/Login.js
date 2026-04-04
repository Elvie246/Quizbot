// Login.js
// React component for user login using Material UI
// Author: Quizbot Team
//
// This component provides a login form with email and password fields.
// It uses Material UI for styling and form controls.
//
// Props:
// - onLogin: function to call after successful login

import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Paper } from '@mui/material';

/**
 * Login component for user authentication.
 * @component
 * @param {Object} props
 * @param {Function} props.onLogin - Callback after successful login
 */
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  /**
   * Handles form submission and authenticates user via API.
   * On success, stores JWT token in localStorage and calls onLogin callback.
   * On failure, displays error message.
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        // Handles HTTP errors (e.g. 401 Unauthorized)
        const data = await response.json();
        setError(data.message || 'Login failed.');
        return;
      }
      const data = await response.json();
      // Expects { token: 'JWT_TOKEN', user: { ... } }
      if (data.token) {
        // Store JWT token in localStorage for future API calls
        localStorage.setItem('jwtToken', data.token);
        setError('');
        onLogin && onLogin(data.user);
      } else {
        setError('Invalid response from server.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
    </Paper>
  );
}

export default Login;
