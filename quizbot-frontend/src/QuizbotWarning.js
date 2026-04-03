// QuizbotWarning.js
// Warning alert for Quizbot limitations
// Author: Quizbot Team

import React from 'react';
import { Alert } from '@mui/material';

/**
 * QuizbotWarning displays a warning about possible AI errors.
 * @component
 */
function QuizbotWarning() {
  return (
    <Alert severity="warning" sx={{ maxWidth: 600, mx: 'auto', my: 2 }}>
      Quizbot is an AI assistant and may occasionally make mistakes. Always double-check important information!
    </Alert>
  );
}

export default QuizbotWarning;
