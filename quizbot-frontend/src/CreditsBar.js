// CreditsBar.js
// Horizontal bar component to display credits info for non-authenticated users
// Author: Quizbot Team

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * CreditsBar displays a warning bar with daily usage limit and upgrade/login options.
 * @component
 * @param {Object} props
 * @param {Function} props.onLoginClick - Callback when Login button is clicked
 */
function CreditsBar({ onLoginClick }) {
  return (
    <Box sx={{
      width: 600,
      maxWidth: '95vw',
      bgcolor: 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)',
      background: 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)',
      color: '#fff',
      py: 1.5,
      px: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      mb: 2,
      borderRadius: 1,
      boxShadow: 1,
      mx: 'auto'
    }}>
      <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 500 }}>
        Free users are limited to 2 quiz generations per day. Upgrade for unlimited access!
      </Typography>
      <Button variant="contained" color="secondary" sx={{ mx: 1 }} onClick={onLoginClick}>
        Upgrade
      </Button>
    </Box>
  );
}

export default CreditsBar;
