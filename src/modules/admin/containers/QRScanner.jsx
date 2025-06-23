import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@cw/rds';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import useIsMobile from '../hooks/MobileHook';

const BASE_URL = 'https://student-view-app.cfapps.us10-001.hana.ondemand.com/register?id=';

const QRScanner = ({ open, onClose, exam }) => {
  const isMobile = useIsMobile();

  if (!exam) return null;

  const qrValue = `${BASE_URL}${exam.id}`;

  const handleDownload = () => {
    const qrElement = document.getElementById('qr-code');
    html2canvas(qrElement).then(canvas => {
      const link = document.createElement('a');
      link.download = `${exam.id}_qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  const handlePrint = () => {
    const content = document.getElementById('qr-code');
    const printWindow = window.open('', '', 'height=500,width=500');
    printWindow.document.write(`<html><head><title>Print ${exam.name} QR</title></head><body>`);
    printWindow.document.write(content.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='xs'
      PaperProps={{
        sx: {
          p: 2,
          maxWidth: 500,
          width: '100%',
          borderRadius: 4,
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}>
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          fontSize: isMobile ? '1.2rem' : '1.5rem',
          textAlign: 'center'
        }}>
        QR Code for {exam.name}
      </DialogTitle>

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 1,
          px: 2
        }}>
        <Box
          id='qr-code'
          sx={{
            bgcolor: '#fff',
            p: 2,
            borderRadius: 4,
            boxShadow: 1
          }}>
          <QRCode value={qrValue} size={isMobile ? 180 : 220} />
        </Box>
        <Typography variant='body2' sx={{ mt: 2, wordBreak: 'break-all', textAlign: 'center' }}>
          {qrValue}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1.5,
          px: 2,
          pb: 2
        }}>
        <Button
          onClick={handleDownload}
          fullWidth={isMobile}
          variant='contained'
          sx={{
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary   -main)',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: { xs: '16px', sm: '18px' },
            px: { xs: 3, sm: 4 },
            py: 1.8,
            minWidth: '80px',
            minHeight: { xs: '38px', sm: '46px' },
            '&:hover': {
              backgroundColor: 'var(--primary-light)'
            }
          }}>
          Download
        </Button>

        {!isMobile && (
          <Button
            onClick={handlePrint}
            fullWidth={isMobile}
            variant='contained'
            sx={{
              backgroundColor: 'var(--primary-light)',
            color: 'var(--primary   -main)',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: { xs: '16px', sm: '18px' },
            px: { xs: 3, sm: 4 },
            py: 1.8,
            minWidth: '80px',
            minHeight: { xs: '38px', sm: '46px' },
            '&:hover': {
              backgroundColor: 'var(--primary-light)'
            }
            }}>
            Print
          </Button>
        )}

        <Button
          onClick={onClose}
          variant='outlined'
          sx={{
            backgroundColor: 'var(--error-light)',
            color: 'var(--error-main)',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: { xs: '16px', sm: '18px' },
            px: { xs: 3, sm: 4 },
            py: 1.8,
            minWidth: '80px',
            minHeight: { xs: '38px', sm: '46px' },
            '&:hover': {
              backgroundColor: 'var(--error-light)'
            }
          }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRScanner;
