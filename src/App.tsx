import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthGuard, LoginGuard } from './components/AuthGuard';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { SearchPage } from './pages/SearchPage';
import { MatchPage } from './pages/MatchPage';
import { useAuth } from './contexts/AuthContext';

// Root redirect component that checks auth status
function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/search" : "/login"} replace />;
}

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <FavoritesProvider>
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

            {/* Protected routes - wrapped in Layout */}
            <Route
              element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              }
            >
              <Route path="/search" element={<SearchPage />} />
              <Route path="/match" element={<MatchPage />} />
            </Route>

            {/* Root and catch-all routes */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
