import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button, BusyLoader } from '@cw/rds';

const StatCard = ({ label, value, color, onClick }) => (
  <Paper
    elevation={3}
    onClick={onClick}
    sx={{
      p: { xs: 2, sm: 3 },
      textAlign: 'center',
      cursor: onClick ? 'pointer' : 'default',
      transition: '0.3s',
      '&:hover': { boxShadow: onClick ? 6 : 3 },
      height: '100%'
    }}>
    <Typography variant='body2' color='text.secondary' sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
      {label}
    </Typography>
    <Typography variant='h4' fontWeight='bold' color={color} sx={{ fontSize: { xs: '1.8rem', sm: '2.4rem' }, mt: 1 }}>
      {value}
    </Typography>
  </Paper>
);

const ExamStatistics = ({ examId, onClose, goToSheet }) => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [registrations, setRegistrations] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      try {
        const raw = localStorage.getItem(`exam-${examId}-users`);
        if (!raw) {
          setTotalStudents(0);
          setRegistrations(0);
        } else {
          const data = JSON.parse(raw);
          const total = data.length;
          const registered = data.filter(u => u.registered === true).length;

          setTotalStudents(total);
          setRegistrations(registered);
        }
      } catch (err) {
        console.error('Error reading local data', err);
        alert('Failed to load local exam user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examId]);

  const delta = totalStudents - registrations;

  return (
    <Box
      sx={{
        maxWidth: '1700px',
        mx: 'auto',
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, sm: 4 }
      }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' flexWrap='wrap' gap={2} mb={4}>
        <Typography
          variant='h3'
          fontWeight='bold'
          color='var(--text-primary)'
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.6rem' }
          }}>
          Exam Statistics
        </Typography>

        <Button
          variant='outlined'
          color='error'
          onClick={onClose}
          sx={{
            backgroundColor: 'var(--error-light)',
            color: 'var(--error-main)',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: { xs: '13px', sm: '14px' },
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.2 },
            border: 'none',
            '&:hover': {
              backgroundColor: 'var(--error-light)',
              boxShadow: 'none'
            }
          }}>
          Close
        </Button>
      </Box>

      {loading ? (
        <Box textAlign='center' mt={6}>
          <BusyLoader />
          <Typography mt={2}>Loading statistics...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent='center'>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard label='No of Students' value={totalStudents} color='text.primary' />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard label='Registrations' value={registrations} color='success.main' onClick={goToSheet} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard label='Delta' value={delta} color='error.main' onClick={goToSheet} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ExamStatistics;
