// QuizbotGeneratorCard.js
// Horizontal card component for quiz generation (text input, upload, options)
// Author: Quizbot Team

import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, TextField, Button, InputAdornment, MenuItem, FormControlLabel, Switch
} from '@mui/material';
import { getOrCreateGuestId } from './guestSession';

const SUPPORTED_TEXT_EXTENSIONS = ['.txt', '.md'];

/**
 * QuizbotGeneratorCard allows users to input text, upload a document, and set quiz options.
 * @component
 */
function QuizbotGeneratorCard({ onQuizGenerated, isLoggedIn, creditsSummary }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [timer, setTimer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const maxChars = 30000;
  const maxFileSizeMB = 5;
  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

  // Clear state on logout
  useEffect(() => {
    if (!isLoggedIn) {
      setText('');
      setFile(null);
    }
  }, [isLoggedIn]);

  const normalizeQuizForDisplay = (quiz) => ({
    ...quiz,
    id: quiz.id ?? 0,
    questions: (quiz.questions || []).map((question, questionIndex) => ({
      ...question,
      id: question.id ?? questionIndex + 1,
      options: (question.options || []).map((option, optionIndex) => ({
        ...option,
        id: option.id ?? questionIndex * 100 + optionIndex + 1,
      })),
    })),
  });

  // Handles file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }

    const normalizedFileName = selectedFile.name.toLowerCase();
    const isSupportedTextFile = SUPPORTED_TEXT_EXTENSIONS.some((extension) =>
      normalizedFileName.endsWith(extension),
    );

    if (!isSupportedTextFile) {
      alert('Only .txt and .md files are currently supported for quiz generation.');
      e.target.value = null; // Reset input
      setFile(null);
      return;
    }

    if (selectedFile && selectedFile.size > maxFileSizeBytes) {
      alert(`File is too large. Maximum allowed size is ${maxFileSizeMB} MB.`);
      e.target.value = null; // Reset input
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  // Handles quiz generation
  const handleGenerate = async () => {
    if (isGenerating) {
      return;
    }

    const trimmedText = text.trim();
    let content = trimmedText;
    
    if (!trimmedText && !file) {
      alert('Please enter some text or upload a document.');
      return;
    }

    const token = localStorage.getItem('jwtToken');

    if (token && creditsSummary?.mode === 'authenticated' && !creditsSummary.canGenerate) {
      alert('You do not have enough credits to generate another quiz.');
      return;
    }

    if (!token && creditsSummary?.mode === 'guest' && !creditsSummary.canGenerate) {
      alert('Guest daily limit reached. Please register or try again tomorrow.');
      return;
    }

    setIsGenerating(true);

    try {
      // If a file is uploaded and no text is provided, read the file
      if (!trimmedText && file) {
        content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        });
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const endpoint = token ? `${apiUrl}/quizzes/generate` : `${apiUrl}/quizzes/generate-public`;
      
      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        headers['X-Guest-Id'] = getOrCreateGuestId();
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          topic: content || 'General',
          questionCount: numQuestions
        })
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Generation failed.';
        alert(errorMessage);
        return;
      }

      const quiz = await response.json();
      console.log('Quiz generated:', quiz);

      if (onQuizGenerated) onQuizGenerated(normalizeQuizForDisplay(quiz));
    } catch (err) {
      console.error('Generation Error:', err);
      alert('Error: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'row', minWidth: 400, maxWidth: 800, m: 2 }}>
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
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Button variant="outlined" component="label">
            Upload Document
            <input type="file" hidden accept=".txt,.md" onChange={handleFileChange} />
          </Button>
          <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
            Max: 5MB (.txt, .md)
          </Typography>
          {file && <Typography variant="body2" sx={{ ml: 2, fontWeight: 'bold' }}>{file.name}</Typography>}
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
        <Button variant="contained" color="primary" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Quiz'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default QuizbotGeneratorCard;
