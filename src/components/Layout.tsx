import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          p: 3,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
} 