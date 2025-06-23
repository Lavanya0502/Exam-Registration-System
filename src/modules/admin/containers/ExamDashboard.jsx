import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Checkbox,
  DataTable,
  AppBar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  TablePagination
} from '@cw/rds';
import {
  MenuIcon,
  CircleCheckboxOutlined,
  CircleOff,
  CircleCheckbox,
  Home,
  Folder,
  MagnifyingGlass,
  Ellipsis
} from '@cw/rds/icons';
import QRScanner from './QRScanner';
import html2canvas from 'html2canvas';
import useIsMobile from '../hooks/MobileHook';
import CreateExam from './CreateExam';
import ExamUserSheet from './ExamUserSheet';
import ExamStatistics from './ExamStatistics';
import { useNavigate } from 'react-router-dom';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const ExamDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('asc');
  const [selectedNav, setSelectedNav] = useState('exams');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [view, setView] = useState(null);
  const [page, setPage] = useState(0);
  const [qrOptionsOpen, setQrOptionsOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSheet, setShowSheet] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = 'https://student-view-app.cfapps.us10-001.hana.ondemand.com/register?id=';

  const handleMenuOpen = (event, exam) => {
    setAnchorEl(event.currentTarget);
    setSelectedExam(exam);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedExam(null);
    fetchExams();
  };

  const drawer = (
    <Box
      sx={{
        width: isMobile ? 280 : 72,
        height: '100vh',
        backgroundColor: '#07263a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2
      }}>
      {/* {isMobile && (
        <Box sx={{ width: '90%', px: 1, pb: 2 }}>
          <Typography variant='subtitle2' sx={{ mb: 1, color: 'white' }}>
            Search
          </Typography>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '36px',
              backgroundColor: 'white',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '32px'
            }}>
            <MagnifyingGlass
              style={{
                position: 'absolute',
                left: '8px',
                color: 'var(--text-secondary)',
                fontSize: '18px'
              }}
            />
            <input
              type='text'
              placeholder='Search'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                height: '100%',
                fontSize: '14px',
                color: 'var(--text-primary)',
                background: 'transparent',
                paddingLeft: '8px'
              }}
            />
          </div>
        </Box>
      )} */}

      <IconButton
        onClick={() => {
          setSelectedNav('exams');
          setView(null);
        }}
        sx={{
          backgroundColor: selectedNav === 'exams' ? 'white' : 'transparent',
          color: selectedNav === 'exams' ? 'var(--primary-main)' : 'var(--contrast-text)',
          borderRadius: 2,
          width: 40,
          height: 40,
          '&:hover': {
            backgroundColor: 'white',
            color: '#07263a !important'
          }
        }}>
        <Home color='success-light' />
      </IconButton>
      <Typography variant='caption' fontSize='0.75rem' fontWeight='bold' color='white'>
        Exams
      </Typography>
    </Box>
  );

  const fetchExams = () => {
    const savedExams = JSON.parse(localStorage.getItem('exams') || '[]');
    setExams(savedExams);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const columnMap = {
    ID: 'id',
    Name: 'name',
    Date: 'date',
    Slot: 'slot',
    'Created By': 'createdBy',
    Status: 'status'
  };

  const visibleRows = React.useMemo(() => {
    const filtered = exams.filter(
      exam =>
        exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.createdBy?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [exams, searchQuery, order, orderBy, page, rowsPerPage]);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflowX: { xs: 'visible', md: 'hidden' },
        width: '100vw',
        m: 0,
        p: 0,
        boxShadow: 'none',
        color: 'white',
        backgroundColor: 'var(--background-paper)'
      }}>
      {isMobile && (
        <AppBar position='fixed' style={{ zIndex: 1201, bgcolor: 'var(--primary-main)' }}>
          <IconButton color='white' edge='start' onClick={() => setMobileOpen(!mobileOpen)}>
            <MenuIcon style={{ color: 'white' }} />
          </IconButton>
        </AppBar>
      )}

      <AppBar position='fixed' sx={{ backgroundColor: '#07263a', zIndex: 1300, height: 64 }}>
        <Box display='flex' alignItems='center' justifyContent='space-between' px={2} height='100%'>
          <Box display='flex' alignItems='center' gap={2}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ color: 'white' }}>
                <MenuIcon color='success-light' />
              </IconButton>
            )}
            <Box component='img' src='./assets/favicon.ico' alt='Logo' sx={{ height: 36, width: 'auto' }} />
            <Typography variant='h6' color='white' fontWeight='bold' noWrap>
              Exam Portal
            </Typography>
          </Box>

          {/* {!isMobile && (
            <Box
              sx={{
                flex: 1,
                maxWidth: 500,
                mx: 2,
                bgcolor: 'var(--background-paper)',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                px: 2,
                height: 36
              }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '36px',
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '32px'
                }}>
                <MagnifyingGlass
                  style={{
                    position: 'absolute',
                    left: '0px',
                    color: 'var(--text-secondary)',
                    fontSize: '18px'
                  }}
                />
                <input
                  type='text'
                  placeholder='Search'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    height: '100%',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    background: 'transparent'
                  }}
                />
              </div>
            </Box>
          )} */}
        </Box>
      </AppBar>

      {isMobile ? (
        <Drawer
          anchor='left'
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              width: 130,
              backgroundColor: 'var(--primary-main)',
              color: 'white',
              borderRight: 'none',
              pt: '64px',
              overflow: 'hidden',
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none'
            }
          }}>
          {drawer}
        </Drawer>
      ) : (
        <Box
          component='nav'
          sx={{
            width: 72,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 72,
              boxSizing: 'border-box',
              backgroundColor: '#07263a',
              color: 'white',
              borderRight: 'none'
            }
          }}>
          <Drawer
            variant='permanent'
            open
            PaperProps={{
              sx: {
                width: 72,
                position: 'fixed',
                height: '100vh',
                backgroundColor: '#07263a',
                color: 'white',
                overflow: 'hidden',
                pt: '64px'
              }
            }}>
            {drawer}
          </Drawer>
        </Box>
      )}

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 5,
          mt: 8,
          padding: '60px',
          height: '100vh',
          boxShadow: 'none',
          backgroundColor: 'var(--background-paper)'
        }}>
        {showStats && selectedExam ? (
          <ExamStatistics
            examId={selectedExam.id}
            onClose={() => {
              setShowStats(false);
              setSelectedExam(null);
            }}
            goToSheet={() => {
              setShowStats(false);
              setShowSheet(true);
            }}
          />
        ) : showSheet && selectedExam ? (
          <ExamUserSheet
            examId={selectedExam.id}
            onClose={() => {
              setShowSheet(false);
              setSelectedExam(null);
            }}
          />
        ) : (
          selectedNav === 'exams' &&
          !view && (
            <>
              <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                <Typography variant='h3' fontWeight='bold' color='var(--text-primary)'>
                  All Exams
                </Typography>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setSelectedExam(null);
                    setIsDialogOpen(true);
                  }}
                  endIcon={<Typography sx={{ fontWeight: 'bold', fontSize: '18px', lineHeight: 1 }}>+</Typography>}
                  sx={{
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary-main)',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '14px',
                    px: 2,
                    py: 1,
                    boxShadow: 'none',
                    border: 'none',
                    '&:hover': {
                      backgroundColor: 'var(--primary-light)',
                      boxShadow: 'none'
                    }
                  }}>
                  Create Exam
                </Button>
              </Box>

              <CreateExam open={isDialogOpen} onClose={handleClose} exam={selectedExam} />

              <Paper sx={{ overflow: 'hidden' }}>
                <TableContainer>
                  <DataTable size='small' aria-label='exam table'>
                    <TableHead>
                      <TableRow>
                        {Object.keys(columnMap).map(label => (
                          <TableCell
                            key={label}
                            sortDirection={orderBy === columnMap[label] ? order : false}
                            onClick={() => {
                              const colKey = columnMap[label];
                              const isAsc = orderBy === colKey && order === 'asc';
                              setOrder(isAsc ? 'desc' : 'asc');
                              setOrderBy(colKey);
                            }}
                            sx={{
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              color: 'var(--text-primary)',
                              '&:hover': { color: 'var(--primary-main)' }
                            }}>
                            <TableSortLabel
                              active={orderBy === columnMap[label]}
                              direction={orderBy === columnMap[label] ? order : 'asc'}>
                              {label}
                            </TableSortLabel>
                          </TableCell>
                        ))}
                        <TableCell sx={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {visibleRows.map(exam => (
                        <TableRow
                          key={exam.id}
                          hover
                          onClick={() => handleRowClick?.(exam)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'var(--background-hover)'
                            }
                          }}>
                          <TableCell>{exam.id}</TableCell>
                          <TableCell>{exam.name}</TableCell>
                          <TableCell>{exam.date}</TableCell>
                          <TableCell>{exam.slot}</TableCell>
                          <TableCell>{exam.createdBy}</TableCell>
                          <TableCell>
                            <Box display='flex' alignItems='center' gap={1}>
                              {exam.status === 'active' && <CircleCheckboxOutlined size='small' color='success' />}
                              {exam.status === 'inactive' && <CircleOff size='small' color='warning' />}
                              {exam.status === 'completed' && <CircleCheckbox size='small' color='primary' />}
                              <Typography variant='body2'>
                                {exam.status && exam.status[0].toUpperCase() + exam.status.slice(1).toLowerCase()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={e => handleMenuOpen(e, exam)}>
                              <Ellipsis />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </DataTable>
                </TableContainer>

                <TablePagination
                  component='div'
                  count={exams.length}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={e => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  rowsPerPageOptions={[5, 10, 25]}
                  sx={{
                    '& .MuiTablePagination-toolbar': {
                      px: 2,
                      py: 1
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)'
                    }
                  }}
                />
              </Paper>
            </>
          )
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: 'white',
              color: 'var(--text-primary)',
              boxShadow: 4,
              borderRadius: 2,
              minWidth: 160,
              '& .MuiMenuItem-root': {
                fontSize: '14px',
                fontWeight: 500,
                px: 2,
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-main)'
                }
              }
            }
          }}>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              setTimeout(() => {
                setShowSheet(true);
              }, 100);
            }}>
            View Sheet
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleMenuClose();
              setTimeout(() => {
                setShowStats(true);
              }, 100);
            }}>
            View Stats
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleMenuClose();
              setQrOptionsOpen(false);
              setTimeout(() => {
                setQrDialogOpen(true);
              }, 100);
            }}>
            View QR
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate('/error');
              handleMenuClose();
            }}>
            Heatmap
          </MenuItem>

          <MenuItem
            onClick={() => {
              setSelectedExam(selectedExam);
              setIsDialogOpen(true);
              handleMenuClose();
            }}>
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleMenuClose();
              setConfirmDeleteOpen(true);
            }}>
            Delete
          </MenuItem>
        </Menu>

        {view === 'heatmap' && selectedExam && <Heatmap examId={selectedExam?.id} />}

        {qrOptionsOpen && selectedExam && (
          <Dialog open={qrOptionsOpen} onClose={() => setQrOptionsOpen(false)}>
            <DialogTitle>QR Code Options for {selectedExam.name}</DialogTitle>
            <DialogContent>
              <Typography>Choose an action for the QR code:</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setQrOptionsOpen(false);
                  setQrDialogOpen(true);
                }}>
                View QR
              </Button>
              <Button
                onClick={() => {
                  const qrValue = `${BASE_URL}${selectedExam.id}`;
                  const tempDiv = document.createElement('div');
                  document.body.appendChild(tempDiv);
                  tempDiv.innerHTML = `<div id="qr-download"><div>${qrValue}</div></div>`;
                  const qr = document.createElement('div');
                  qr.id = 'qr-code';
                  tempDiv.appendChild(qr);
                  import('react-dom').then(({ render }) => {
                    render(<QRCode value={qrValue} size={220} />, qr);
                    setTimeout(() => {
                      html2canvas(qr).then(canvas => {
                        const link = document.createElement('a');
                        link.download = `${selectedExam.id}_qr.png`;
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                        document.body.removeChild(tempDiv);
                      });
                    }, 100);
                  });
                }}>
                Download QR
              </Button>
              <Button onClick={() => setQrOptionsOpen(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>
        )}

        {qrDialogOpen && selectedExam && (
          <QRScanner open={qrDialogOpen} onClose={() => setQrDialogOpen(false)} exam={selectedExam} />
        )}

        {view === 'edit' && selectedExam && (
          <CreateExam
            exam={selectedExam}
            onClose={() => {
              setView('table');
              setSelectedExam(null);
            }}
          />
        )}

        <Dialog
          open={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          PaperProps={{
            sx: {
              minWidth: 400,
              height: '150px',
              overflow: 'hidden',
              backgroundColor: 'var(--background-paper)'
            }
          }}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete <strong>{selectedExam?.name}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ margin: '10px' }}>
            <Button
              onClick={() => setConfirmDeleteOpen(false)}
              variant='outlined'
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
              Cancel
            </Button>
            <Button
              onClick={() => {
                const saved = JSON.parse(localStorage.getItem('exams') || '[]');
                const updated = saved.filter(exam => exam.id !== selectedExam.id);
                localStorage.setItem('exams', JSON.stringify(updated));
                setConfirmDeleteOpen(false);
                window.location.reload();
              }}
              variant='contained'
              color='error'
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
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ExamDashboard;
