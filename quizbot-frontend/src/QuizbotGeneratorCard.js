// QuizbotGeneratorCard.js
// Horizontal card component for quiz generation (text input, upload, options)
// Author: Quizbot Team

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, TextField, Button, InputAdornment, MenuItem, FormControlLabel, Switch
} from '@mui/material';

/**
 * QuizbotGeneratorCard allows users to input text, upload a document, and set quiz options.
 * @component
 */
function QuizbotGeneratorCard() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [timer, setTimer] = useState(false);
  const maxChars = 30000;

  // Handles file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handles quiz generation
  const handleGenerate = async () => {
    let content = text;
    
    if (!text && !file) {
      alert('Please enter some text or upload a document.');
      return;
    }

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('Please login first.');
      return;
    }

    try {
      // If a file is uploaded and no text is provided, read the file
      if (!text && file) {
        content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        });
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${apiUrl}/quizzes/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: content || 'General',
          questionCount: numQuestions
        })
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || 'Generation failed.');
        return;
      }

      const quiz = await response.json();
      console.log('Quiz generated:', quiz);
      alert('Quiz generated successfully! Check console for details.');
    } catch (err) {
      console.error('Generation Error:', err);
      alert('Error: ' + err.message);
    }
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'row', minWidth: 400, maxWidth: 600, m: 2 }}>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>Generate your Quiz</Typography>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Paste your text here"
            multiline
            minRows={3}
            maxRows={6}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxChars))}
            fullWidth
            helperText={`${text.length}/${maxChars} characters`}
            inputProps={{ maxLength: maxChars }}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Button variant="outlined" component="label">
            Upload Document
            <input type="file" hidden accept=".pdf,.doc,.docx,.txt,.md" onChange={handleFileChange} />
          </Button>
          {file && <Typography variant="body2" sx={{ ml: 2 }}>{file.name}</Typography>}
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Number of Questions"
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Math.max(10, Math.min(20, Number(e.target.value))))}
            InputProps={{
              inputProps: { min: 10, max: 20 },
              endAdornment: <InputAdornment position="end">(10-20)</InputAdornment>
            }}
            sx={{ width: 200, mr: 2 }}
          />
          <TextField
            select
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={<Switch checked={timer} onChange={(e) => setTimer(e.target.checked)} />}
            label="Enable Timer"
          />
        </Box>
        <Button variant="contained" color="primary" onClick={handleGenerate}>
          Generate Quiz
        </Button>
      </CardContent>
    </Card>
  );
}

export default QuizbotGeneratorCard;
