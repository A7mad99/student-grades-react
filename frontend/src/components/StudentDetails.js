import React from 'react';
import { 
  Box, 
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  ArrowBack as BackIcon,
  Person as PersonIcon,
  Cake as DobIcon,
  Book as ModuleIcon,
  EmojiEvents as DistinctionIcon,
  School as MeritIcon,
  CheckCircle as PassIcon,
  Error as FailIcon
} from '@mui/icons-material';

function StudentDetails({ studentId, students, onBack, calculateAverage, getClassification }) {
  const student = students.find(s => s.studentId === studentId);
  const average = calculateAverage(student);
  const classification = getClassification(average);

  const getClassificationIcon = () => {
    switch(classification) {
      case 'Distinction': return <DistinctionIcon color="success" />;
      case 'Merit': return <MeritIcon color="warning" />;
      case 'Pass': return <PassIcon color="primary" />;
      default: return <FailIcon color="error" />;
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ 
              width: 120, 
              height: 120, 
              fontSize: 48,
              mb: 2,
              bgcolor: 'primary.main'
            }}>
              {student.First_Name.charAt(0)}{student.Last_Name.charAt(0)}
            </Avatar>
            <Typography variant="h5" component="h2">
              {student.First_Name} {student.Last_Name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              ID: {student.studentId}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <List>
            <ListItem>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Full Name" secondary={`${student.First_Name} ${student.Last_Name}`} />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <DobIcon />
              </ListItemIcon>
              <ListItemText primary="Date of Birth" secondary={student.DOB} />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                {getClassificationIcon()}
              </ListItemIcon>
              <ListItemText 
                primary="Overall Performance" 
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      Average: {average.toFixed(1)}% ({classification})
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(average, 100)} 
                      color={
                        classification === 'Distinction' ? 'success' :
                        classification === 'Merit' ? 'warning' :
                        classification === 'Pass' ? 'primary' : 'error'
                      }
                      sx={{ height: 8, borderRadius: 4, mt: 1 }}
                    />
                  </Box>
                } 
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Module Grades
      </Typography>
      <Grid container spacing={2}>
        {[
          { name: 'Module 1', grade: student.Module1_Grade },
          { name: 'Module 2', grade: student.Module2_Grade },
          { name: 'Module 3', grade: student.Module3_Grade },
        ].map((module, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ModuleIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">{module.name}</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                {module.grade}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={module.grade} 
                color={
                  module.grade >= 70 ? 'success' :
                  module.grade >= 60 ? 'warning' :
                  module.grade >= 40 ? 'primary' : 'error'
                }
                sx={{ height: 8, borderRadius: 4, mt: 1 }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default StudentDetails;