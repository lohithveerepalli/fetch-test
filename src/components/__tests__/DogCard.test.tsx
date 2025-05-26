import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DogCard, DogCardSkeleton } from '../DogCard';

const mockDog = {
  id: '123',
  name: 'Buddy',
  breed: 'Labrador',
  age: 3,
  zip_code: '12345',
  img: 'https://example.com/dog.jpg',
};

describe('DogCard', () => {
  it('renders dog information correctly', () => {
    render(
      <DogCard
        dog={mockDog}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onClick={() => {}}
      />
    );

    expect(screen.getByText(mockDog.name)).toBeInTheDocument();
    expect(screen.getByText(`Breed: ${mockDog.breed}`)).toBeInTheDocument();
    expect(screen.getByText(`Age: ${mockDog.age} years`)).toBeInTheDocument();
    expect(screen.getByText(`Location: ${mockDog.zip_code}`)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', `Photo of ${mockDog.name}`);
  });

  it('handles singular/plural years correctly', () => {
    const youngDog = { ...mockDog, age: 1 };
    render(
      <DogCard
        dog={youngDog}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onClick={() => {}}
      />
    );

    expect(screen.getByText('Age: 1 year')).toBeInTheDocument();
  });

  it('shows correct favorite icon based on state', () => {
    const { rerender } = render(
      <DogCard
        dog={mockDog}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onClick={() => {}}
      />
    );

    expect(screen.getByLabelText('Add to favorites')).toBeInTheDocument();

    rerender(
      <DogCard
        dog={mockDog}
        isFavorite={true}
        onToggleFavorite={() => {}}
        onClick={() => {}}
      />
    );

    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument();
  });

  it('calls onToggleFavorite when favorite button is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <DogCard
        dog={mockDog}
        isFavorite={false}
        onToggleFavorite={handleToggle}
        onClick={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleToggle).toHaveBeenCalledWith(mockDog.id);
  });
});

describe('DogCardSkeleton', () => {
  it('renders skeleton elements', () => {
    render(<DogCardSkeleton />);
    
    // Check for skeleton elements using their test IDs or other attributes
    expect(screen.getByRole('article')).toBeInTheDocument(); // Card container
    expect(document.querySelector('.MuiSkeleton-rectangular')).toBeInTheDocument(); // Image skeleton
    expect(document.querySelectorAll('.MuiSkeleton-text').length).toBeGreaterThan(0); // Text skeletons
  });
}); 