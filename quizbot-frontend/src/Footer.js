// Footer.js
// Footer component for Quizbot with subjects and links
// Author: Quizbot Team

import React from 'react';
import { Box, Typography, Grid, Link, Divider, Container } from '@mui/material';

/**
 * Footer component for the application.
 * @component
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  const subjects = ['Maths', 'History', 'Science', 'Languages', 'Business'];

  return (
    <Box sx={{ bgcolor: '#ffffff', pt: 6, pb: 4, mt: 'auto', borderTop: '1px solid #e0e0e0', width: '100%' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Left Section: Quizbot and Summary */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quizbot
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, lineHeight: 1.6 }}>
              Your AI-powered study companion, helping you master any subject through personalized quizzes and instant feedback. Ideal for students preparing for exams.
            </Typography>
          </Grid>

          {/* Middle Section: Subjects */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Subjects
            </Typography>
            <Grid container spacing={1}>
              {subjects.map((subject) => (
                <Grid item xs={6} key={subject}>
                  <Typography variant="body2" color="text.secondary">
                    • {subject}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Right Section: Policies and Contact */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Support & Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="inherit" underline="hover" variant="body2">Privacy Policy</Link>
              <Link href="#" color="inherit" underline="hover" variant="body2">Cookies Policy</Link>
              <Link href="#" color="inherit" underline="hover" variant="body2">Contact Us</Link>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                © {currentYear} Quizbot. All rights reserved.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
      </Container>
    </Box>
  );
}

export default Footer;
