// QuizbotTutorialCard.js
// Horizontal card component displaying a step-by-step tutorial for Quizbot usage
// Author: Quizbot Team

import React from 'react';
import { Card, CardContent, Typography, Box, Stepper, Step, StepLabel } from '@mui/material';

/**
 * QuizbotTutorialCard displays a horizontal card with a 4-step tutorial.
 * @component
 */
function QuizbotTutorialCard() {
  const steps = [
    'Import or paste your document',
    'Set quiz options (questions, difficulty, timer)',
    'Generate your quiz',
    'Answer and review your results'
  ];

  return (
    <Card sx={{ display: 'flex', flexDirection: 'row', minWidth: 400, maxWidth: 600, m: 2 }}>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>How does Quizbot work?</Typography>
        <Stepper activeStep={-1} orientation="vertical">
          {steps.map((label, idx) => (
            <Step key={label} completed={false}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </CardContent>
    </Card>
  );
}

export default QuizbotTutorialCard;
