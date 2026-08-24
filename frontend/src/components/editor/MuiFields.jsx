'use client';

import { useState } from 'react';
import {
  TextField as MuiTextField,
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox as MuiCheckbox,
  FormControlLabel,
  InputAdornment,
  Chip,
  Box,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Check from '@mui/icons-material/Check';
import dayjs from 'dayjs';

const INPUT_HEIGHT = '44px';

const theme = createTheme({
  palette: {
    primary: { main: '#2563eb' },
    success: { main: '#10b981' },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 13,
  },
  shape: { borderRadius: 10 },
  components: {
    MuiTextField: {
      defaultProps: { size: 'small', fullWidth: true },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            fontSize: 14,
            borderRadius: 10,
            backgroundColor: '#fff',
            height: INPUT_HEIGHT,
            padding: '0 12px',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2563eb',
              borderWidth: 1.5,
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(37,99,235,0.08)',
            },
          },
          '& .MuiInputLabel-root': { fontSize: 13, color: '#64748b' },
          '& .MuiInputLabel-shrink': { fontSize: 12 },
          '& .MuiInputBase-input::placeholder': { color: '#94a3b8', opacity: 1 },
        },
      },
    },
    MuiSelect: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          fontSize: 14,
          borderRadius: 10,
          backgroundColor: '#fff',
          height: INPUT_HEIGHT,
          padding: '0 12px',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: { fontSize: 14 },
        label: { fontSize: 14, color: '#475569' },
      },
    },
  },
});

export function MuiProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export function TextField({ label, value, onChange, placeholder, disabled, multiline, rows, type = 'text', InputProps, onKeyDown, ...rest }) {
  return (
    <MuiTextField
      label={label}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      type={type}
      multiline={multiline}
      rows={rows}
      onKeyDown={onKeyDown}
      InputProps={{
        endAdornment: value?.trim() ? (
          <InputAdornment position="end">
            <Check sx={{ fontSize: 16, color: '#10b981' }} />
          </InputAdornment>
        ) : null,
        ...InputProps,
      }}
      {...rest}
    />
  );
}

export function DateField({ label, value, onChange, disabled }) {
  const dateValue = value ? convertToDate(value) : null;
  return (
    <DatePicker
      label={label}
      value={dateValue}
      disabled={disabled}
      onChange={(newValue) => {
        if (newValue && newValue.isValid()) {
          onChange(newValue.format('MM/YYYY'));
        } else {
          onChange('');
        }
      }}
      slotProps={{
        textField: {
          size: 'small',
          fullWidth: true,
          sx: {
            '& .MuiOutlinedInput-root': {
              fontSize: 14,
              borderRadius: 2.5,
              backgroundColor: '#fff',
              height: INPUT_HEIGHT,
              padding: '0 12px',
            },
            '& .MuiInputLabel-root': { fontSize: 13 },
          },
        },
      }}
      views={['month', 'year']}
      format="MM/YYYY"
      minDate={dayjs('2000-01-01')}
      maxDate={dayjs().add(5, 'year')}
    />
  );
}

export function SelectField({ label, value, onChange, options, disabled }) {
  return (
    <FormControl fullWidth size="small" disabled={disabled}>
      <InputLabel sx={{ fontSize: 12 }}>{label}</InputLabel>
      <MuiSelect
        label={label}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        sx={{ fontSize: 13, borderRadius: 2.5, backgroundColor: '#fff' }}
      >
        {options.map(opt => (
          <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>
            {opt.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}

export function PhoneField({ label, value, onChange, placeholder, code, onCodeChange, codes }) {
  return (
    <MuiTextField
      label={label}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <MuiSelect
              value={code || '+92'}
              onChange={e => onCodeChange(e.target.value)}
              variant="standard"
              disableUnderline
              sx={{ fontSize: 13, minWidth: 56, '& .MuiSelect-select': { py: 0 } }}
            >
              {codes.map(c => (
                <MenuItem key={c} value={c} sx={{ fontSize: 12 }}>{c}</MenuItem>
              ))}
            </MuiSelect>
          </InputAdornment>
        ),
        endAdornment: value?.trim() ? (
          <InputAdornment position="end">
            <Check sx={{ fontSize: 16, color: '#10b981' }} />
          </InputAdornment>
        ) : null,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          height: INPUT_HEIGHT,
          padding: '0 12px',
        },
      }}
    />
  );
}

export function Checkbox({ label, checked, onChange }) {
  return (
    <FormControlLabel
      control={
        <MuiCheckbox
          checked={checked || false}
          onChange={e => onChange(e.target.checked)}
          size="small"
          sx={{ color: '#94a3b8', '&.Mui-checked': { color: '#2563eb' } }}
        />
      }
      label={label}
    />
  );
}

function convertToDate(val) {
  if (!val) return null;
  const parts = val.split('/');
  if (parts.length === 2) {
    const d = dayjs(`${parts[1]}-${parts[0]}-01`, 'YYYY-MM-DD');
    return d.isValid() ? d : null;
  }
  return null;
}
