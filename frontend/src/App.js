import React, { useState, useEffect } from 'react';
import StudentList from './components/StudentList';
import { CircularProgress, Alert, Container } from '@mui/material';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:5000/api/students');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Critical transformation for DataGrid
        const formattedData = data.map(student => ({
          id: student.studentId, 
          ...student
        }));
        
        setStudents(formattedData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load data: {error}
        </Alert>
      </Container>
    );
  }

  return <StudentList students={students} />;
}

export default App;