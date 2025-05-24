import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // A nice blue color
    },
    secondary: {
      main: '#ff4081', // Pink accent
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevents all-caps buttons
        },
      },
    },
  },
}); 