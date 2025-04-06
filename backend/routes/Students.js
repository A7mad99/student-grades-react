const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

const DEFAULT_STUDENTS = [
  {
    studentId: "DEMO001",
    First_Name: "Test",
    Last_Name: "Student",
    DOB: "01/01/2000",
    Module1_Grade: 75,
    Module2_Grade: 82,
    Module3_Grade: 68
  }
];
// Helper function to calculate classification
const getClassification = (average) => {
  if (average >= 70) return "Distinction";
  if (average >= 60) return "Merit";
  if (average >= 40) return "Pass";
  return "Fail";
};

// GET all students (formatted for frontend DataGrid)
router.get('/', async (req, res) => {
  try {
    let students = await Student.find().lean();
    
    // Fallback if no students (for debugging)
    if (students.length === 0) {
      console.warn('No students in DB, returning demo data');
      students = DEFAULT_STUDENTS;
    }
    // 1. Fetch from MongoDB
    //const students = await Student.find().lean();
    
    // 2. Transform data for frontend
    const formattedStudents = students.map(student => {
      const average = (
        student.Module1_Grade + 
        student.Module2_Grade + 
        student.Module3_Grade
      ) / 3;

      return {
        // Required fields for DataGrid
        id: student.studentId, // Essential for Material-UI DataGrid
        studentId: student.studentId,
        
        // Student information
        First_Name: student.First_Name,
        Last_Name: student.Last_Name,
        DOB: student.DOB,
        
        // Module grades
        Module1_Grade: student.Module1_Grade,
        Module2_Grade: student.Module2_Grade,
        Module3_Grade: student.Module3_Grade,
        
        // Calculated fields (optional)
        average: parseFloat(average.toFixed(1)),
        classification: getClassification(average)
      };
    });

    // 3. Send properly formatted response
    res.json(formattedStudents);

  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch students',
      error: err.message 
    });
  }
});

// GET single student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.id }).lean();
    
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: 'Student not found' 
      });
    }

    const average = (
      student.Module1_Grade + 
      student.Module2_Grade + 
      student.Module3_Grade
    ) / 3;

    res.json({
      // Required for DataGrid selection
      id: student.studentId,
      studentId: student.studentId,
      
      // Student data
      First_Name: student.First_Name,
      Last_Name: student.Last_Name,
      DOB: student.DOB,
      
      // Grades
      Module1_Grade: student.Module1_Grade,
      Module2_Grade: student.Module2_Grade,
      Module3_Grade: student.Module3_Grade,
      
      // Calculated values
      average: parseFloat(average.toFixed(1)),
      classification: getClassification(average)
    });

  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student',
      error: err.message
    });
  }
});

// POST calculate averages for selected students
router.post('/averages', async (req, res) => {
  try {
    const { studentIds } = req.body;
    
    // Validate input
    if (!studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid student IDs provided'
      });
    }

    // Fetch selected students
    const students = await Student.find({ 
      studentId: { $in: studentIds } 
    }).lean();

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No matching students found'
      });
    }

    // Calculate individual averages
    const results = students.map(student => {
      const average = (
        student.Module1_Grade + 
        student.Module2_Grade + 
        student.Module3_Grade
      ) / 3;

      return {
        id: student.studentId,
        studentId: student.studentId,
        First_Name: student.First_Name,
        Last_Name: student.Last_Name,
        average: parseFloat(average.toFixed(1)),
        classification: getClassification(average)
      };
    });

    // Calculate group average
    const groupAverage = results.reduce(
      (sum, student) => sum + student.average, 0
    ) / results.length;

    res.json({
      success: true,
      students: results,
      groupAverage: parseFloat(groupAverage.toFixed(1)),
      groupClassification: getClassification(groupAverage)
    });

  } catch (err) {
    console.error('Error calculating averages:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate averages',
      error: err.message
    });
  }
});

module.exports = router;