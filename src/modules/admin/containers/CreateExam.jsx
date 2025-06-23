import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Grid,
  FormHelperText,
  DialogActions
} from '@cw/rds';
import { DatePicker, TimePicker } from '@cw/rds';
import { useNavigate } from 'react-router-dom';
import format from 'date-fns/format';
import * as XLSX from 'xlsx';
import parse from 'date-fns/parse';
import parseISO from 'date-fns/parseISO';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const CreateExam = ({ open, onClose = () => {}, exam = null }) => {
  const isEditMode = Boolean(exam);

  const [form, setForm] = useState({
    id: '',
    name: '',
    status: '',
    startTime: null,
    endTime: null,
    date: null,
    createdBy: '',
    sheetFile: null
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isEditMode && exam) {
      const [start, end] = exam.slot?.split(' - ') || [null, null];
      setForm({
        ...exam,
        date: exam.date ? dayjs(exam.date) : null,
        startTime: start ? dayjs(start, 'hh:mm A') : null,
        endTime: end ? dayjs(end, 'hh:mm A') : null,
        sheetFile: null,
        sheetFileBase64: exam.sheetFileBase64 || ''
      });
    }
  }, [exam]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.id.trim()) newErrors.id = 'Exam ID is required';
    if (!form.name.trim()) newErrors.name = 'Exam name is required';
    if (!form.status) newErrors.status = 'Status is required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.startTime) newErrors.startTime = 'Start time is required';
    if (!form.endTime) newErrors.endTime = 'End time is required';
    if (!form.createdBy.trim()) newErrors.createdBy = 'Creator name is required';
    if (!form.sheetFile && !form.sheetFileBase64 && !isEditMode) {
      newErrors.sheetFile = 'Excel file is required';
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(true);
      return;
    }

    const slot = `${format(form.startTime, 'hh:mm a')} - ${format(form.endTime, 'hh:mm a')}`;
    const newExam = {
      ...form,
      slot,
      date: format(form.date, 'yyyy-MM-dd'),
      ssheetFileName: form.sheetFile?.name || '',
      sheetFileBase64: form.sheetFileBase64
    };

    const saved = JSON.parse(localStorage.getItem('exams') || '[]');
    if (isEditMode) {
      const updated = saved.map(ex => (ex.id === exam.id ? newExam : ex));
      localStorage.setItem('exams', JSON.stringify(updated));
    } else {
      saved.push(newExam);
      localStorage.setItem('exams', JSON.stringify(saved));
    }
    onClose?.();
  };

  const handleFileUpload = file => {
    if (!form.id.trim()) {
      alert('Please enter Exam ID before uploading the file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet);
      localStorage.setItem(`exam-${form.id}-users`, JSON.stringify(json));
      const base64 = e.target.result.split(',')[1];
      setForm(prev => ({ ...prev, sheetFile: file, sheetFileBase64: base64 }));
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll='paper'
      maxWidth={false}
      PaperProps={{
        sx: {
          maxWidth: 1000,
          width: '100%',
          borderRadius: 4,
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}>
      <DialogTitle
        sx={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          textAlign: 'center',
          pb: 1
        }}>
        {isEditMode ? 'Edit Exam' : 'Create Exam'}
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          px: 3,
          py: 2,
          overflowY: 'auto',
          flexGrow: 1
        }}>
        {submitted && Object.keys(errors).length > 0 && (
          <Alert severity='error' sx={{ mb: 2 }}>
            Please fill all fields correctly.
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.id}>
              <InputLabel shrink>Exam ID</InputLabel>
              <TextField
                name='id'
                value={form.id}
                onChange={handleChange}
                fullWidth
                size='xlarge'
                disabled={isEditMode}
              />
              {errors.id && <FormHelperText>{errors.id}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.name}>
              <InputLabel shrink>Exam Name</InputLabel>
              <TextField name='name' value={form.name} onChange={handleChange} fullWidth size='xlarge' />
              {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel shrink>Status</InputLabel>
              <Select name='status' value={form.status} size='xlarge' onChange={handleChange}>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
                <MenuItem value='completed'>Completed</MenuItem>
              </Select>
              {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} style={{ padding: '6px 0 0 16px' }}>
            <FormControl fullWidth error={!!errors.date}>
              <InputLabel shrink>Exam Date</InputLabel>
              <DatePicker
                value={form.date}
                onChange={date => {
                  setForm(prev => ({ ...prev, date }));
                  setErrors(prev => ({ ...prev, date: '' }));
                }}
                minDate={dayjs().startOf('day')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'xlarge',
                    InputProps: {
                      style: { px: 2, py: 1.2, minHeight: '40px' }
                    }
                  }
                }}
              />
              {errors.date && <FormHelperText>{errors.date}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.startTime}>
              <InputLabel shrink>Start Time</InputLabel>
              <TimePicker
                value={form.startTime}
                onChange={time => {
                  setForm(prev => ({ ...prev, startTime: time }));
                  setErrors(prev => ({ ...prev, startTime: '' }));
                }}
                minTime={form.date?.isSame(dayjs(), 'day') ? dayjs() : undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'xlarge',
                    InputProps: {
                      style: { px: 2, py: 1.2, minHeight: '42px' }
                    }
                  }
                }}
              />
              {errors.startTime && <FormHelperText>{errors.startTime}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.endTime}>
              <InputLabel shrink>End Time</InputLabel>
              <TimePicker
                value={form.endTime}
                onChange={time => {
                  setForm(prev => ({ ...prev, endTime: time }));
                  setErrors(prev => ({ ...prev, endTime: '' }));
                }}
                minTime={form.date?.isSame(dayjs(), 'day') ? dayjs() : undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'xlarge',
                    InputProps: {
                      style: { px: 2, py: 1.2, minHeight: '42px' }
                    }
                  }
                }}
              />
              {errors.endTime && <FormHelperText>{errors.endTime}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.createdBy}>
              <InputLabel shrink>Created By</InputLabel>
              <TextField name='createdBy' value={form.createdBy} onChange={handleChange} fullWidth size='xlarge' />
              {errors.createdBy && <FormHelperText>{errors.createdBy}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} style={{ padding: '25px 0 0 16px' }}>
            <FormControl fullWidth>
              <InputLabel shrink>Upload Excel</InputLabel>
              <Box
                onDrop={e => {
                  if (isEditMode) return; // 🔒 disable in edit mode
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    setForm(prev => ({ ...prev, sheetFile: file }));
                    handleFileUpload(file);
                  }
                }}
                onDragOver={e => !isEditMode && e.preventDefault()}
                onClick={() => {
                  if (!isEditMode) document.getElementById('excel-file-input')?.click();
                }}
                sx={{
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed var(--divider)',
                  borderRadius: '8px',
                  backgroundColor: isEditMode ? 'var(--background-read-only)' : 'var(--background-disabled)',
                  cursor: isEditMode ? 'not-allowed' : 'pointer',
                  opacity: isEditMode ? 0.5 : 1,
                  px: 2
                }}>
                <Typography variant='body2' color='text.secondary' noWrap>
                  {form.sheetFile
                    ? `Uploaded: ${form.sheetFile.name}`
                    : form.sheetFileBase64 && isEditMode
                      ? 'Excel already uploaded'
                      : 'Upload Excel/CSV file here'}
                </Typography>

                <input
                  type='file'
                  accept='.xlsx,.xls'
                  id='excel-file-input'
                  hidden
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) handleFileUpload(file);
                  }}
                />
              </Box>

              {errors.sheetFile && (
                <Typography variant='body2' fontWeight='bold' color='var(--error-dark)' sx={{ mt: 0.5 }}>
                  {errors.sheetFile}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          borderTop: '1px solid var(--divider)',
          minHeight: { xs: '70px', sm: '80px' },
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
          gap: 2
        }}>
        <Button
          variant='outlined'
          onClick={() => onClose?.()}
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
          }}>
          Cancel
        </Button>

        <Button
          variant='outlined'
          onClick={handleSubmit}
          sx={{
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary   -main)',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: { xs: '16px', sm: '18px' },
            px: { xs: 3, sm: 4 },
            py: 1.8,
            minWidth: '80px',
            margin: '8px',
            minHeight: { xs: '38px', sm: '46px' },
            '&:hover': {
              backgroundColor: 'var(--primary-light)'
            }
          }}>
          {isEditMode ? 'Save Changes' : 'Create Exam'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateExam;
