import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Skeleton,
  CardActionArea,
  useTheme,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import type { Dog } from '../api/types';

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dogId: string) => void;
  onClick: (dog: Dog) => void;
}

export const DogCard = ({
  dog,
  isFavorite,
  onToggleFavorite,
  onClick,
}: DogCardProps) => {
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(dog.id);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardActionArea
        onClick={() => onClick(dog)}
        sx={{ flexGrow: 1 }}
        aria-label={`View details for ${dog.name}, a ${dog.breed}`}
      >
        {!imageError ? (
          <CardMedia
            component="img"
            height="200"
            image={dog.img}
            alt={`Photo of ${dog.name}, a ${dog.breed}`}
            onError={() => setImageError(true)}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              bgcolor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Image not available
            </Typography>
          </Box>
        )}

        <CardContent>
          <Typography gutterBottom variant="h6" component="h2">
            {dog.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {dog.breed}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dog.age} {dog.age === 1 ? 'year' : 'years'} old • {dog.zip_code}
          </Typography>
        </CardContent>
      </CardActionArea>

      <IconButton
        aria-label={isFavorite ? `Remove ${dog.name} from favorites` : `Add ${dog.name} to favorites`}
        onClick={handleFavoriteClick}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          bgcolor: 'background.paper',
          '&:hover': {
            bgcolor: 'background.paper',
          },
        }}
        color="primary"
      >
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Card>
  );
};

export const DogCardSkeleton = () => (
  <Card sx={{ height: '100%' }}>
    <Skeleton variant="rectangular" height={200} />
    <CardContent>
      <Skeleton variant="text" width="60%" height={32} />
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="30%" />
    </CardContent>
  </Card>
); 