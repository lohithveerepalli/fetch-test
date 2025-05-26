import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Tooltip,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useThemeToggle } from '../contexts/ThemeContext';

export const Header = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const { favorites } = useFavorites();
  const { toggleTheme, mode } = useThemeToggle();

  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Search Dogs';
      case '/favorites':
        return 'My Favorites';
      case '/match':
        return 'Your Match';
      default:
        return 'Fetch';
    }
  };

  return (
    <AppBar position="sticky" elevation={1} color="default">
      <Toolbar>
        <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PetsIcon color="primary" />
            <Typography variant="h6" component="h1" color="primary">
              Fetch
            </Typography>
          </Box>
        </RouterLink>

        <Typography
          variant="h6"
          component="h2"
          sx={{ ml: 3, color: 'text.primary', display: { xs: 'none', sm: 'block' } }}
        >
          {getPageTitle()}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton onClick={toggleTheme} color="inherit" aria-label="toggle theme">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="View favorites">
            <IconButton
              component={RouterLink}
              to="/favorites"
              color={pathname === '/favorites' ? 'primary' : 'inherit'}
              aria-label="view favorites"
            >
              <Badge badgeContent={Array.from(favorites).length} color="primary">
                <FavoriteIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Button
            onClick={logout}
            color="inherit"
            startIcon={<LogoutIcon />}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Logout
          </Button>
          <IconButton
            onClick={logout}
            color="inherit"
            aria-label="logout"
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 