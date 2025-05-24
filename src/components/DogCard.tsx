import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Skeleton,
  Box,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import type { Dog } from '../api';

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dogId: string) => void;
}

export function DogCard({ dog, isFavorite, onToggleFavorite }: DogCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={dog.img}
        alt={`Photo of ${dog.name}`}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {dog.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Breed: {dog.breed}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Age: {dog.age} {dog.age === 1 ? 'year' : 'years'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Location: {dog.zip_code}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => onToggleFavorite(dog.id)}
          color="secondary"
        >
          {isFavorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </CardActions>
    </Card>
  );
}

export function DogCardSkeleton() {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={24} />
        <Skeleton variant="text" width="40%" height={24} />
        <Skeleton variant="text" width="50%" height={24} />
      </CardContent>
      <CardActions disableSpacing>
        <Skeleton variant="circular" width={40} height={40} />
      </CardActions>
    </Card>
  );
} 