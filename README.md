# 🐕 Fetch Dog Adoption Platform

A modern web application for browsing and adopting dogs, built for Fetch's frontend take-home assessment.

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context + React Query
- **Testing**: Vitest + React Testing Library
- **API Integration**: Axios
- **Styling**: Emotion (MUI's styling solution)
- **CI/CD**: GitHub Actions + Vercel


## 🛠️ Setup & Development

### Prerequisites
- Node.js 20.x or higher
- npm 9.x or higher

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://frontend-take-home-service.fetch.com
```

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## 🧪 Testing Strategy

- Unit tests for utility functions
- Integration tests for components
- E2E testing for critical user flows
- Mock service worker for API simulation

## 🌟 Features

1. **Authentication**
   - Secure login/logout flow
   - Protected routes
   - Session persistence

2. **Dog Search**
   - Advanced filtering
   - Breed selection
   - Pagination
   - Sorting options

3. **Favorites Management**
   - Add/remove favorites
   - localStorage persistence
   - Match generation

4. **User Experience**
   - Responsive design
   - Dark/light theme
   - Loading states
   - Error handling
   - Accessibility support

## 🔐 Security Considerations

- No sensitive data in client-side storage
- Protected routes implementation
- API error handling
- Input validation
- CORS compliance

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## 📄 License

MIT License - see LICENSE file for details
