// CookiesPolicy.js
// Component to display the Cookies Policy content
// Author: Quizbot Team

import React from 'react';
import { Box, Typography, Paper, Button, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';

/**
 * CookiesPolicy component displaying how we use tracking technologies.
 * @component
 */
function CookiesPolicy({ onBack }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 4 }}>
      <Button variant="outlined" onClick={onBack} sx={{ mb: 4 }}>
        ← Back
      </Button>

      <Paper elevation={3} sx={{ p: 6, borderRadius: 2 }}>
        <Typography variant="h3" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          Cookies Policy – Quizbot
        </Typography>
        
        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
            <InfoIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              We use minimal tracking technologies to ensure the proper functioning of our service.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
            <SecurityIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              At this time, Quizbot does not use cookies for advertising or analytics purposes.
            </Typography>
          </Box>

          <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Authentication & Storage
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Authentication is handled using secure tokens stored in your browser (localStorage), not cookies. 
              This ensures your session remains active without the need for traditional tracking cookies.
            </Typography>
          </Paper>

          <Typography variant="body1" paragraph>
            If cookies are used in the future (for authentication or analytics), this policy will be updated accordingly.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 4 }}>
            <SettingsIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              You can control or delete cookies through your browser settings at any time.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default CookiesPolicy;
