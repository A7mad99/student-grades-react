import React, { useState, useEffect } from 'react';
import { 
  Chip, 
  Paper, 
  Typography, 
  LinearProgress,
  Alert,
  Box,
  Button
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('http://localhost:5000/api/students', {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }

      // Transform data to ensure consistent field names
      const transformedData = data.map(student => ({
        ...student,
        // Handle case differences in field names
        First_Name: student.First_Name || student.first_Name || '',
        Last_Name: student.Last_Name || student.last_Name || ''
      }));

      setStudents(transformedData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.name === 'AbortError' 
        ? 'Request timed out. Please check your connection.'
        : `Failed to load student data: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    return () => {
      // Cleanup function
    };
  }, []);

  const calculateAverage = (student) => {
    if (!student) return 0;
    
    // Use either the pre-calculated average or calculate it
    if (student.average !== undefined) {
      return student.average;
    }
    
    // Safely get grades with fallback to 0
    const grade1 = Number(student.Module1_Grade) || 0;
    const grade2 = Number(student.Module2_Grade) || 0;
    const grade3 = Number(student.Module3_Grade) || 0;
    
    const sum = grade1 + grade2 + grade3;
    const count = [grade1, grade2, grade3].filter(g => g > 0).length || 1;
    
    return sum / count;
  };

  const getClassification = (average) => {
    if (average >= 70) return "Distinction";
    if (average >= 60) return "Merit";
    if (average >= 40) return "Pass";
    return "Fail";
  };

  const columns = [
    { 
      field: 'studentId', 
      headerName: 'Student ID', 
      width: 150,
      valueGetter: (params) => {
        return params ?? 'N/A'}
    },
    { 
      field: 'fullName', 
      headerName: 'Name', 
      width: 200,
      valueGetter: (params,row) => {
        return `${row.First_Name || ''} ${row.Last_Name || ''}`.trim() || 'N/A';
      }
    },
    { 
      field: 'average', 
      headerName: 'Average', 
      width: 120,
      valueGetter: (params,row) => {
        return calculateAverage(row);
      },
      renderCell: (params) => {
        const avg = Number(params?.value) || 0;
        const classification = getClassification(avg);
        return (
          <Chip
            label={`${avg.toFixed(1)}%`}
            color={
              classification === 'Distinction' ? 'success' :
              classification === 'Merit' ? 'warning' :
              classification === 'Pass' ? 'primary' : 'error'
            }
            variant="outlined"
          />
        );
      }
    },
    {
      field: 'DOB',
      headerName: 'Date of Birth',
      width: 150,
      valueGetter: (params) => params || 'N/A'
    }
  ];

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={fetchStudents}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, height: 700 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Student Records
      </Typography>
      <DataGrid
        rows={students}
        columns={columns}
        pageSize={10}
        loading={loading}
        getRowId={(row) => row.studentId ?? row.id ?? Math.random().toString(36).substring(2, 9)}
        slots={{
          loadingOverlay: LinearProgress,
          noRowsOverlay: () => (
            <Typography sx={{ p: 2 }}>
              {loading ? 'Loading...' : 'No student records found'}
            </Typography>
          )
        }}
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center'
          }
        }}
      />
    </Paper>
  );
};

export default StudentList;