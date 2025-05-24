import { Box, IconButton, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { mode, toggleTheme } = useTheme();
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        transition: 'background-color 0.3s ease',
      }}
    >
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        sx={{
          position: 'fixed',
          top: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          bgcolor: 'background.paper',
          boxShadow: theme.shadows[2],
          '&:hover': {
            bgcolor: 'background.paper',
          },
        }}
      >
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      {children}
    </Box>
  );
} 