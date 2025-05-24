import type { ReactNode } from 'react';
import { Container, Box, Paper } from '@mui/material';

interface CenteredLayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md';
}

export function CenteredLayout({ children, maxWidth = 'sm' }: CenteredLayoutProps) {
  return (
    <Container component="main" maxWidth={maxWidth}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {children}
        </Paper>
      </Box>
    </Container>
  );
} 