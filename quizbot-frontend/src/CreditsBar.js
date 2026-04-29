// CreditsBar.js
// Horizontal bar component to display the current credits policy
// Author: Quizbot Team

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * CreditsBar displays the active credits policy for the current visitor.
 * @component
 * @param {Object} props
 * @param {Object} props.creditsSummary - Current credits summary returned by the API
 * @param {Function} props.onLoginClick - Callback when Login button is clicked
 */
function CreditsBar({ creditsSummary, onLoginClick }) {
  if (!creditsSummary) {
    return null;
  }

  const isGuest = creditsSummary.mode === 'guest';
  const background = isGuest
    ? creditsSummary.canGenerate
      ? 'linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)'
      : 'linear-gradient(90deg, #ef5350 0%, #e57373 100%)'
    : 'linear-gradient(90deg, #1e88e5 0%, #42a5f5 100%)';

  const message = isGuest
    ? `Guest access: ${creditsSummary.remaining} of ${creditsSummary.dailyLimit} quiz generations remaining today.`
    : `Account balance: ${creditsSummary.balance} credits remaining. Each saved quiz costs ${creditsSummary.costPerQuiz} credit.`;

  return (
    <Box sx={{
      width: 600,
      maxWidth: '95vw',
      background,
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
        {message}
      </Typography>
      {isGuest && (
        <Button variant="contained" color="secondary" sx={{ mx: 1 }} onClick={onLoginClick}>
          Login / Register
        </Button>
      )}
    </Box>
  );
}

export default CreditsBar;
