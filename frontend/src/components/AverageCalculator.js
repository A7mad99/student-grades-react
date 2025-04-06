import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Divider,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Calculate as CalculateIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

function AverageCalculator({ students, onBack }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggle = (studentId) => {
    const currentIndex = selectedIds.indexOf(studentId);
    const newSelected = [...selectedIds];

    if (currentIndex === -1) {
      newSelected.push(studentId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedIds(newSelected);
  };

  const calculateGroupAverage = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one student');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/students/averages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentIds: selectedIds }),
      });
      
      if (!response.ok) throw new Error('Calculation failed');
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Button
        variant="outlined"
        startIcon={<BackIcon />}
        onClick={onBack}
        sx={{ mb: 3 }}
      >
        Back to list
      </Button>

      <Typography variant="h5" component="h2" gutterBottom>
        Grade Calculator
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Select students to calculate group average
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto', mb: 3 }}>
        <List dense>
          {students.map((student) => (
            <ListItem key={student.studentId}>
              <Checkbox
                edge="start"
                checked={selectedIds.indexOf(student.studentId) !== -1}
                onChange={() => handleToggle(student.studentId)}
              />
              <ListItemText
                primary={`${student.First_Name} ${student.Last_Name}`}
                secondary={`ID: ${student.studentId}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Button
        variant="contained"
        startIcon={<CalculateIcon />}
        onClick={calculateGroupAverage}
        disabled={loading || selectedIds.length === 0}
        fullWidth
        size="large"
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Calculate Average'}
      </Button>

      {result && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Calculation Results
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Selected Students ({result.students.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {result.students.map((student) => (
                <Chip
                  key={student.studentId}
                  label={`${student.First_Name} ${student.Last_Name}: ${student.average.toFixed(1)}%`}
                  color={
                    student.classification === 'Distinction' ? 'success' :
                    student.classification === 'Merit' ? 'warning' :
                    student.classification === 'Pass' ? 'primary' : 'error'
                  }
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ 
            p: 2, 
            bgcolor: 'action.hover', 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6">
              Group Average
            </Typography>
            <Chip
              label={`${result.groupAverage.toFixed(1)}% (${result.groupClassification})`}
              color={
                result.groupClassification === 'Distinction' ? 'success' :
                result.groupClassification === 'Merit' ? 'warning' :
                result.groupClassification === 'Pass' ? 'primary' : 'error'
              }
              icon={
                result.groupClassification === 'Distinction' ? <SuccessIcon /> :
                result.groupClassification === 'Fail' ? <ErrorIcon /> : null
              }
              sx={{ fontSize: '1rem', p: 1 }}
            />
          </Box>
        </Paper>
      )}
    </Paper>
  );
}

export default AverageCalculator;