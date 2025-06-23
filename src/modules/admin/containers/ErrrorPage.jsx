import React from 'react';
import { Box, Typography, Button } from '@cw/rds';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: 'var(--background-default)',
        color: 'var(--text-primary)',
        px: 2
      }}
    >
      <Typography variant="h1" fontWeight="bold" sx={{ fontSize: { xs: '4rem', sm: '6rem' } }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'var(--text-secondary)' }}>
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{
          backgroundColor: 'var(--error-light)',
            color: 'var(--error-main)',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: { xs: '16px', sm: '18px' },
            px: { xs: 3, sm: 4 },
            py: 1.8,
            minWidth: '80px',
            margin: '8px',
            minHeight: { xs: '38px', sm: '46px' },
            '&:hover': {
              backgroundColor: 'var(--error-light)'
            }
        }}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
