
// App.js
// Main application component for Quizbot frontend
// Provides navigation between Login and Register components
// Author: Quizbot Team

import './App.css';
import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import { 
  Button, Box, AppBar, Toolbar, Typography, Dialog, IconButton, Grid, 
  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, TextField 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import NoteIcon from '@mui/icons-material/Note';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import LanguageIcon from '@mui/icons-material/Language';
import QuizbotTutorialCard from './QuizbotTutorialCard';
import QuizbotGeneratorCard from './QuizbotGeneratorCard';
import QuizbotWarning from './QuizbotWarning';
import QuizbotFeatures from './QuizbotFeatures';
import Footer from './Footer';
import CreditsBar from './CreditsBar';
import QuizDisplay from './QuizDisplay';
import ContactUs from './ContactUs';

/**
 * Main App component with public homepage and login/register dialogs.
 */
function App() {
  // State for authentication
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State for current quiz display
  const [currentQuiz, setCurrentQuiz] = useState(null);
  
  // State for contact page display
  const [showContact, setShowContact] = useState(false);

  // State to control dialog visibility and mode (login/register)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('login');

  // Sidebar state
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // App settings/features state
  const [history, setHistory] = useState([]); // Will store last 5 quizzes
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [theme, setTheme] = useState('light');

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsLoggedIn(true);
      setUser({ email: localStorage.getItem('userEmail') || 'user@example.com' }); 
      fetchHistory();
    }
  }, []);

  // Fetch real history from API
  const fetchHistory = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/quizzes/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data.slice(0, 5)); // Show last 5
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  // Handler after successful login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('userEmail', userData.email);
    setIsLoggedIn(true);
    setDialogOpen(false);
    fetchHistory();
  };

  // Callback when a new quiz is generated
  const handleQuizGenerated = (newQuiz) => {
    setHistory(prev => [newQuiz, ...prev].slice(0, 5));
    setCurrentQuiz(newQuiz);
  };

  // Handler for logout
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
    setIsLoggedIn(false);
    setDrawerOpen(false);
    setCurrentQuiz(null);
  };

  // Handler after successful registration
  const handleRegister = (userData) => {
    alert(`Registered as ${userData.email}. You can now login.`);
    setDialogMode('login');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'FR' : 'EN');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Sidebar Content
  const sideList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Typography variant="h6" sx={{ p: 2, color: 'primary.main' }}>
        Quizbot Menu
      </Typography>
      <Divider />
      <List>
        <ListItem button onClick={() => { setShowNotes(false); setCurrentQuiz(null); setShowContact(false); }}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary={language === 'EN' ? 'Home' : 'Accueil'} />
        </ListItem>
        
        <Divider sx={{ my: 1 }} />
        <Typography variant="caption" sx={{ px: 2, color: 'text.secondary' }}>
          {language === 'EN' ? 'RECENT HISTORY' : 'HISTORIQUE RÉCENT'}
        </Typography>
        {history.map((item) => (
          <ListItem button key={item.id} onClick={() => setCurrentQuiz(item)}>
            <ListItemIcon><HistoryIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary={item.title} secondaryTypographyProps={{ fontSize: '0.8rem' }} />
          </ListItem>
        ))}

        <Divider sx={{ my: 1 }} />
        <ListItem button onClick={(e) => { e.stopPropagation(); setShowNotes(!showNotes); }}>
          <ListItemIcon><NoteIcon /></ListItemIcon>
          <ListItemText primary={language === 'EN' ? 'Notes' : 'Notes'} />
        </ListItem>

        <ListItem button onClick={(e) => { e.stopPropagation(); toggleTheme(); }}>
          <ListItemIcon><Brightness4Icon /></ListItemIcon>
          <ListItemText primary={theme === 'light' ? (language === 'EN' ? 'Dark Mode' : 'Mode Sombre') : (language === 'EN' ? 'Light Mode' : 'Mode Clair')} />
        </ListItem>

        <ListItem button onClick={(e) => { e.stopPropagation(); toggleLanguage(); }}>
          <ListItemIcon><LanguageIcon /></ListItemIcon>
          <ListItemText primary={language === 'EN' ? 'Français' : 'English'} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box className="App" sx={{ minHeight: '100vh', bgcolor: theme === 'light' ? '#f5f5f5' : '#121212', color: theme === 'light' ? 'inherit' : '#fff' }}>
      {/* Top AppBar */}
      <AppBar position="static" sx={{ bgcolor: theme === 'light' ? 'primary.main' : '#1f1f1f' }}>
        <Toolbar>
          {isLoggedIn && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Quizbot
          </Typography>
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={() => { setDialogMode('login'); setDialogOpen(true); }}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {sideList()}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, width: '100%', pb: 10 }}>
        {!showContact && !currentQuiz && (
          <Typography variant="h3" gutterBottom align="center">
            {isLoggedIn 
              ? (language === 'EN' ? 'What Do You Want to Study Today?' : 'Que souhaitez-vous étudier aujourd\'hui ?')
              : (language === 'EN' ? 'Welcome to Quizbot!' : 'Bienvenue sur Quizbot !')}
          </Typography>
        )}
        
        {!isLoggedIn && !showContact && !currentQuiz && (
          <Typography variant="body1" sx={{ maxWidth: 600, textAlign: 'center', mb: 2 }}>
            {language === 'EN' 
              ? 'Create, import, and play quizzes with ease. Please log in to access your dashboard and quiz history.' 
              : 'Créez, importez et jouez à des quiz en toute simplicité. Connectez-vous pour accéder à votre tableau de bord.'}
          </Typography>
        )}

        {/* Show Credits Bar only if NOT logged in and not on other pages */}
        {!isLoggedIn && !showContact && !currentQuiz && <CreditsBar onLoginClick={() => { setDialogMode('login'); setDialogOpen(true); }} />}

        {/* Notepad (conditional) */}
        {isLoggedIn && showNotes && !showContact && !currentQuiz && (
          <Box sx={{ width: '100%', maxWidth: 600, mb: 4, p: 2 }}>
            <Typography variant="h6">{language === 'EN' ? 'My Study Notes' : 'Mes notes d\'étude'}</Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              placeholder={language === 'EN' ? 'Type your notes here...' : 'Tapez vos notes ici...'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ bgcolor: theme === 'light' ? '#fff' : '#333', input: { color: theme === 'light' ? 'inherit' : '#fff' } }}
            />
          </Box>
        )}

        {showContact ? (
          <ContactUs onBack={() => setShowContact(false)} />
        ) : !currentQuiz ? (
          <>
            <Grid container spacing={2} justifyContent="center" sx={{ px: 2 }}>
              <Grid item>
                <QuizbotTutorialCard />
              </Grid>
              <Grid item>
                <QuizbotGeneratorCard onQuizGenerated={handleQuizGenerated} />
              </Grid>
            </Grid>
            <QuizbotWarning />
            <QuizbotFeatures />
          </>
        ) : (
          <Box sx={{ width: '100%', maxWidth: 900, px: 2 }}>
            <Button variant="outlined" onClick={() => setCurrentQuiz(null)} sx={{ mb: 2 }}>
              {language === 'EN' ? '← Back to Generator' : '← Retour au générateur'}
            </Button>
            <QuizDisplay quiz={currentQuiz} onFinish={() => {}} />
          </Box>
        )}
      </Box>

      <Footer onContactClick={() => { setShowContact(true); setCurrentQuiz(null); }} />

      {/* Login/Register dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setDialogOpen(false)}>
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
            <Button onClick={() => setDialogMode('register')}>
              {language === 'EN' ? "Don't have an account? Register" : "Pas de compte ? S'inscrire"}
            </Button>
          ) : (
            <Button onClick={() => setDialogMode('login')}>
              {language === 'EN' ? "Already have an account? Login" : "Déjà un compte ? Connexion"}
            </Button>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}

export default App;
