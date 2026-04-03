// QuizbotFeatures.js
// Responsive feature highlights for Quizbot
// Author: Quizbot Team

import React from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';

/**
 * QuizbotFeatures displays main features in a responsive layout.
 * @component
 */
function QuizbotFeatures() {
  const features = [
    {
      icon: <SchoolIcon color="primary" sx={{ fontSize: 40 }} />, title: 'Exam Preparation',
      desc: 'Practice with custom quizzes to prepare for your exams and assessments.'
    },
    {
      icon: <AssessmentIcon color="primary" sx={{ fontSize: 40 }} />, title: 'Score & Feedback',
      desc: 'Get instant scoring and feedback to track your progress.'
    },
    {
      icon: <HistoryIcon color="primary" sx={{ fontSize: 40 }} />, title: 'Quiz History',
      desc: 'Save and review your quiz history for continuous improvement.'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, mt: 4, mb: 6, px: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        {features.map((f, idx) => (
          <Grid item xs={12} sm={6} md={4} key={f.title}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
              {f.icon}
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>{f.title}</Typography>
                <Typography variant="body2" align="center">{f.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default QuizbotFeatures;
