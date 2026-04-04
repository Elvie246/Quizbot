// QuizDisplay.js
// Component to display and play a generated quiz
// Author: Quizbot Team

import React, { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Radio, RadioGroup, 
  FormControlLabel, FormControl, Button, Divider, Paper 
} from '@mui/material';

/**
 * QuizDisplay allows users to take the generated quiz.
 */
function QuizDisplay({ quiz, onFinish }) {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz) return null;

  const handleOptionChange = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId
    });
  };

  const handleSubmit = () => {
    let currentScore = 0;
    quiz.questions.forEach(q => {
      const selectedOptionId = answers[q.id];
      const correctOption = q.options.find(o => o.isCorrect);
      if (selectedOptionId === correctOption.id) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setShowResult(true);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, width: '100%', maxWidth: 800, mx: 'auto', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom color="primary">{quiz.title}</Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>{quiz.description}</Typography>
      
      <Divider sx={{ mb: 4 }} />

      {!showResult ? (
        <Box>
          {quiz.questions.map((q, index) => (
            <Box key={q.id} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {index + 1}. {q.text}
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup 
                  value={answers[q.id] || ''} 
                  onChange={(e) => handleOptionChange(q.id, parseInt(e.target.value))}
                >
                  {q.options.map((opt) => (
                    <FormControlLabel 
                      key={opt.id} 
                      value={opt.id} 
                      control={<Radio />} 
                      label={opt.text} 
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
          
          <Button 
            variant="contained" 
            size="large" 
            fullWidth 
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < quiz.questions.length}
            sx={{ mt: 2 }}
          >
            Submit Quiz
          </Button>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h3" color="primary" gutterBottom>
            Your Score: {score} / {quiz.questions.length}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            {score === quiz.questions.length ? 'Perfect! 🎉' : 'Good job! Keep studying. 📚'}
          </Typography>
          <Button variant="outlined" onClick={() => { setShowResult(false); setAnswers({}); }}>
            Try Again
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export default QuizDisplay;
