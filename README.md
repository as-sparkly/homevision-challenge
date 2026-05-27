# HomeVision Frontend Challenge

A React + TypeScript application that displays an infinite scrolling list of house data with robust error handling for a flaky API.

## 🚀 Live Demo

View the live application: [https://homevision-challenge.vercel.app/](https://homevision-challenge.vercel.app/)

## 💡 Value Proposition

This application solves the challenge of presenting large datasets in a user-friendly, performant way while handling unreliable network conditions. Key benefits include:

### For Users
- **Seamless Browsing Experience**: No pagination clicks needed - content loads automatically as you scroll
- **Fast Initial Load**: Only loads what you need to see, reducing wait times
- **Reliable Performance**: Graceful handling of network issues with clear feedback and easy retry options
- **Mobile-Optimized**: Responsive design that works perfectly on any device
- **Accessible Design**: Screen reader friendly with proper semantic markup

### For Developers
- **Production-Ready Code**: Comprehensive error handling, type safety, and performance optimizations
- **Scalable Architecture**: Clean separation of concerns with custom hooks and modular components
- **Maintainable Codebase**: TypeScript throughout with clear interfaces and documentation
- **Modern Best Practices**: Leverages latest React patterns and browser APIs for optimal performance

![HomeVision Screenshot](https://via.placeholder.com/800x400/2c5aa0/ffffff?text=HomeVision+House+Listings)

## Features

- ✅ **Infinite Scrolling**: Automatically loads more houses as you scroll
- ✅ **Error Handling**: Robust retry mechanisms for flaky API responses
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices
- ✅ **Loading States**: Clear visual feedback during data fetching
- ✅ **Image Optimization**: Graceful handling of missing or broken images
- ✅ **TypeScript**: Full type safety throughout the application
- ✅ **Modern UI**: Clean, professional design with hover effects

## Tech Stack

- **React 18** with TypeScript
- **Custom Hooks** for state management
- **Intersection Observer API** for efficient scroll detection
- **CSS Grid** for responsive layouts
- **Modern CSS** with custom properties and animations

## API Integration

The application integrates with the HomeVision API:
- **Endpoint**: `https://staging.homevision.co/api_project/houses`
- **Pagination**: Supports `page` and `per_page` parameters
- **Error Handling**: Automatic retry with exponential backoff
- **Type Safety**: Full TypeScript interfaces for API responses

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd homevision-challenge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (⚠️ irreversible)

## Project Structure

```
src/
├── components/           # React components
│   ├── HouseCard.tsx        # Individual house display
│   ├── InfiniteScrollList.tsx # Main scrolling container
│   ├── LoadingSpinner.tsx   # Loading state indicator
│   └── ErrorMessage.tsx     # Error handling UI
├── hooks/               # Custom React hooks
│   └── useInfiniteScroll.ts # Infinite scroll logic
├── services/            # API layer
│   └── api.ts              # House data fetching
├── types/               # TypeScript definitions
│   └── house.ts            # Data interfaces
├── utils/               # Utility functions
│   ├── analytics.ts        # Analytics tracking
│   ├── constants.ts        # App configuration
│   └── performance.ts      # Performance monitoring
└── App.tsx             # Main application component
```

## Architecture Decisions

### Error Handling Strategy
- **Retry Logic**: Up to 3 attempts with exponential backoff
- **User Feedback**: Clear error messages with retry buttons
- **Graceful Degradation**: Partial data display when possible

### Performance Optimizations
- **Intersection Observer**: Efficient scroll detection
- **Image Lazy Loading**: Built-in browser lazy loading
- **Minimal Re-renders**: Optimized with useCallback and useMemo
- **CSS Grid**: Hardware-accelerated layouts

### Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Alt Text**: Descriptive image alternatives
- **Focus Management**: Keyboard navigation support
- **Color Contrast**: WCAG AA compliant color schemes

## Production Considerations

### Deployment Checklist
- [ ] Environment variables for API endpoints
- [ ] Service worker for offline functionality
- [ ] Image CDN integration
- [ ] Bundle size optimization
- [ ] Performance monitoring
- [ ] Error tracking (Sentry, LogRocket)

### Scaling Improvements
- [ ] Virtual scrolling for thousands of items
- [ ] Image optimization pipeline
- [ ] Progressive Web App features
- [ ] State management library (Redux, Zustand)
- [ ] Component library integration
- [ ] Automated testing suite

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the HomeVision Frontend Challenge
