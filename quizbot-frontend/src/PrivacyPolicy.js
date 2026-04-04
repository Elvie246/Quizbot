// PrivacyPolicy.js
// Component to display the Privacy Policy content
// Author: Quizbot Team

import React from 'react';
import { Box, Typography, Paper, Button, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import PersonIcon from '@mui/icons-material/Person';

/**
 * PrivacyPolicy component displaying how we handle user data.
 * @component
 */
function PrivacyPolicy({ onBack }) {
  const dataCollected = [
    'Email address for account creation',
    'Encrypted password',
    'Quiz data generated and user interactions'
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 4 }}>
      <Button variant="outlined" onClick={onBack} sx={{ mb: 4 }}>
        ← Back
      </Button>

      <Paper elevation={3} sx={{ p: 6, borderRadius: 2 }}>
        <Typography variant="h3" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          Privacy Policy – Quizbot
        </Typography>
        
        <Divider sx={{ my: 3 }} />

        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
            <ShieldIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              We respect your privacy and are committed to protecting your personal data.
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            We collect the following information:
          </Typography>
          <List sx={{ mb: 4 }}>
            {dataCollected.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon><ListAltIcon color="primary" fontSize="small" /></ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mb: 4, p: 3, bgcolor: '#f0f7ff', borderRadius: 1, borderLeft: '4px solid #1976d2' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DataUsageIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Data Usage</Typography>
            </Box>
            <Typography variant="body2">
              Your data is used to provide and improve the service, including quiz generation using AI technologies. 
              We do not sell your personal data. Some data may be processed by third-party services such as AI providers 
              to generate quizzes.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 4 }}>
            <PersonIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Your Rights</Typography>
              <Typography variant="body2" color="text.secondary">
                You have the right to access, modify, or delete your data at any time by contacting us.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default PrivacyPolicy;
