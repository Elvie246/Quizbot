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

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with real authentication API call
    if (email && password) {
      setError('');
      onLogin && onLogin({ email });
    } else {
      setError('Please enter both email and password.');
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
