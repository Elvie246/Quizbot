// QuizbotFeatures.js
// Responsive feature highlights for Quizbot
// Author: Quizbot Team

import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import DevicesIcon from '@mui/icons-material/Devices';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleIcon from '@mui/icons-material/People';

/**
 * QuizbotFeatures displays main features in a responsive layout.
 * Each card has the same height for consistency.
 * @component
 */
function QuizbotFeatures() {
  const features = [
    {
      icon: <PeopleIcon color="primary" sx={{ fontSize: 40 }} />, 
      title: 'Ideal for Students',
      desc: 'A tool designed to simplify your revision and boost your academic success.'
    },
    {
      icon: <DevicesIcon color="primary" sx={{ fontSize: 40 }} />, 
      title: '24/7 Accessibility',
      desc: 'Review anywhere, anytime, on mobile or desktop.'
    },
    {
      icon: <SchoolIcon color="primary" sx={{ fontSize: 40 }} />, 
      title: 'Exam Preparation',
      desc: 'Practice in real conditions to arrive confident on your exam day.'
    },
    {
      icon: <SpeedIcon color="primary" sx={{ fontSize: 40 }} />, 
      title: 'One-Click Quiz',
      desc: 'Generate questions instantly from your course materials.'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, mt: 8, mb: 10, px: 3, width: '100%', maxWidth: 1200 }}>
      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {features.map((f, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx} sx={{ display: 'flex' }}>
            <Card sx={{ 
              width: '100%',
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center',
              py: 4, 
              px: 2,
              boxShadow: 3,
              borderRadius: 3,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6
              }
            }}>
              <Box sx={{ mb: 2 }}>{f.icon}</Box>
              <CardContent sx={{ flexGrow: 1, p: 0 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>
                  {f.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {f.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default QuizbotFeatures;
