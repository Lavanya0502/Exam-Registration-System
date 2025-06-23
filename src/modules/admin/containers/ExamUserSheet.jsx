import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  DataTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  Chip,
  BusyLoader
} from '@cw/rds';
import useIsMobile from '../hooks/MobileHook';

const ExamUserSheet = ({ examId, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const stored = localStorage.getItem(`exam-${examId}-users`);
    if (stored) {
      const parsed = JSON.parse(stored).map((user, index) => ({
        id: index + 1,
        name: user.Name || user.name || 'N/A',
        email: user.Email || user.email || 'N/A',
        phone: user.Phone || user.phone || 'N/A',
        registered: user.registered === true
      }));
      setUsers(parsed);
    }
    setLoading(false);
  }, [examId]);

  return (
    <Box
      p={isMobile ? 2 : 4}
      sx={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
        border: 'none',
        borderRadius: 0,
        padding: '5px'
      }}>
      <Box
        display='flex'
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent='space-between'
        alignItems={isMobile ? 'flex-start' : 'center'}
        mb={3}
        gap={2}>
        <Typography
          variant='h3'
          fontWeight='bold'
          color='var(--text-primary)'
          sx={{
            fontSize: { xs: '1.4rem', sm: '1.8rem' }
          }}>
          Student Details
        </Typography>
        <Button
          variant='text'
          color='error'
          onClick={onClose}
          sx={{
            backgroundColor: 'var(--error-light)',
            color: 'var(--error-main)',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '14px',
            px: 2,
            py: 1,
            boxShadow: 'none',
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
        <Box textAlign='center' mt={6} display='flex' flexDirection='column' alignItems='center'>
          <BusyLoader />
          <Typography mt={2} color='var(--text-secondary)'>
            Loading student records...
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            overflowX: 'auto',
            width: '100%',
            WebkitOverflowScrolling: 'touch'
          }}>
          <Box minWidth={600} backgroundColor='white'>
            <DataTable size='medium'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id} hover>
                    <TableCell sx={{ fontSize: '0.95rem' }}>{user.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.95rem' }}>{user.email}</TableCell>
                    <TableCell sx={{ fontSize: '0.95rem' }}>{user.phone}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.registered ? 'Registered' : 'Delta'}
                        color={user.registered ? 'success' : 'error'}
                        size='small'
                        variant='outlined'
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          px: 1.5,
                          py: 0.5
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ExamUserSheet;
