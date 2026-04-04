// ContactUs.js
// Component to display the Contact Us page content
// Author: Quizbot Team

import React from 'react';
import { Box, Typography, Paper, Link, List, ListItem, ListItemIcon, ListItemText, Button, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import BugReportIcon from '@mui/icons-material/BugReport';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

/**
 * ContactUs component displaying contact information and support topics.
 * @component
 */
function ContactUs({ onBack }) {
  const contactPoints = [
    { text: 'Account or login issues', icon: <AccountCircleIcon color="primary" /> },
    { text: 'Questions about credits', icon: <CreditCardIcon color="primary" /> },
    { text: 'Bug reports', icon: <BugReportIcon color="primary" /> },
    { text: 'Requests to delete your data', icon: <DeleteForeverIcon color="primary" /> }
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 4 }}>
      <Button variant="outlined" onClick={onBack} sx={{ mb: 4 }}>
        ← Back
      </Button>

      <Paper elevation={3} sx={{ p: 6, borderRadius: 2 }}>
        <Typography variant="h3" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          Contact Us
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: 'text.secondary', mb: 4 }}>
          If you have any questions, issues, or requests, feel free to contact us.
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, p: 3, bgcolor: '#f0f4f8', borderRadius: 1 }}>
          <EmailIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Email:</Typography>
            <Link href="mailto:support@quizbot.com" sx={{ fontSize: '1.2rem', fontWeight: 500 }}>
              support@quizbot.com
            </Link>
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
          You can reach out for:
        </Typography>
        
        <List sx={{ mb: 4 }}>
          {contactPoints.map((point, index) => (
            <ListItem key={index}>
              <ListItemIcon>{point.icon}</ListItemIcon>
              <ListItemText primary={point.text} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', mb: 2 }}>
          We aim to respond within 24-48 hours.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          For any request related to your personal data, you can contact us at the email above.
        </Typography>
      </Paper>
    </Box>
  );
}

export default ContactUs;
