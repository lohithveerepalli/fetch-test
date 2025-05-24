import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthGuard, LoginGuard } from './components/AuthGuard';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { SearchPage } from './pages/SearchPage';
import { MatchPage } from './pages/MatchPage';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <CssBaseline />
        <AuthProvider>
          <FavoritesProvider>
            <Layout>
              <Routes>
                {/* Public routes */}
                <Route
                  path="/login"
                  element={
                    <LoginGuard>
                      <LoginPage />
                    </LoginGuard>
                  }
                />

                {/* Protected routes */}
                <Route
                  path="/search"
                  element={
                    <AuthGuard>
                      <SearchPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/match"
                  element={
                    <AuthGuard>
                      <MatchPage />
                    </AuthGuard>
                  }
                />

                {/* Redirect root to search or login based on auth status */}
                <Route path="/" element={<Navigate to="/search" replace />} />
                
                {/* Catch all redirect */}
                <Route path="*" element={<Navigate to="/search" replace />} />
              </Routes>
            </Layout>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
