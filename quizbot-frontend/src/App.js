
// App.js
// Main application component for Quizbot frontend
// Provides navigation between Login and Register components
// Author: Quizbot Team

import './App.css';
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { Button, Box, AppBar, Toolbar, Typography, Dialog, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QuizbotTutorialCard from './QuizbotTutorialCard';
import QuizbotGeneratorCard from './QuizbotGeneratorCard';
import CreditsBar from './CreditsBar';



/**
 * Main App component with public homepage and login/register dialogs.
 * Shows a top AppBar with Quizbot title and Login button at top right.
 * Login/Register forms appear as dialogs when Login is clicked.
 * @component
 */
function App() {
  // State to control dialog visibility and mode (login/register)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('login');

  // Handler after successful login
  const handleLogin = (user) => {
    // TODO: Redirect to dashboard or main app after login
    alert(`Logged in as ${user.email}`);
    setDialogOpen(false);
  };

  // Handler after successful registration
  const handleRegister = (user) => {
    // TODO: Redirect to login or main app after registration
    alert(`Registered as ${user.email}`);
    setDialogMode('login');
  };

  // Opens the dialog in login or register mode
  const openDialog = (mode) => {
    setDialogMode(mode);
    setDialogOpen(true);
  };

  // Closes the dialog
  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box className="App" sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Top AppBar with Quizbot title and Login button */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Quizbot
          </Typography>
          <Button color="inherit" onClick={() => openDialog('login')}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Public homepage content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, width: '100%' }}>
        <Typography variant="h3" gutterBottom>Welcome to Quizbot!</Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, textAlign: 'center', mb: 2 }}>
          Create, import, and play quizzes with ease. Please log in to access your dashboard and quiz history, or try out the public features below.
        </Typography>
        {/* Credits bar for non-authenticated users */}
        <CreditsBar onLoginClick={() => openDialog('login')} />
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <QuizbotTutorialCard />
          </Grid>
          <Grid item>
            <QuizbotGeneratorCard />
          </Grid>
        </Grid>
      </Box>

      {/* Login/Register dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="xs" fullWidth>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={closeDialog}>
            <CloseIcon />
          </IconButton>
        </Box>
        {dialogMode === 'login' ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Register onRegister={handleRegister} />
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
          {dialogMode === 'login' ? (
            <Button onClick={() => setDialogMode('register')}>Don't have an account? Register</Button>
          ) : (
            <Button onClick={() => setDialogMode('login')}>Already have an account? Login</Button>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}

export default App;
