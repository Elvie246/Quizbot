// Register.js
// React component for user registration using Material UI
// Author: Quizbot Team
//
// This component provides a registration form with email, password, and confirm password fields.
// It uses Material UI for styling and form controls.
//
// Props:
// - onRegister: function to call after successful registration

import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Paper } from '@mui/material';

/**
 * Register component for new user sign up.
 * @component
 * @param {Object} props
 * @param {Function} props.onRegister - Callback after successful registration
 */
function Register({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with real registration API call
    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      setError('');
      onRegister && onRegister({ email });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>Register</Typography>
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
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </Box>
    </Paper>
  );
}

export default Register;
