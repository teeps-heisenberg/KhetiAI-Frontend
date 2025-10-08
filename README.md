# KhetiAI Frontend

A modern, minimalist React application for KhetiAI - an intelligent agricultural assistant that helps farmers make data-driven decisions through natural communication.

## Features

### 🎯 Core Functionality

- **Voice-First Interface**: Natural communication in local languages
- **Smart Crop Analysis**: Camera-based crop health monitoring
- **AI-Powered Predictions**: Optimal sowing and harvesting recommendations
- **Real-time Guidance**: Personalized farming advice

### 🎨 Design

- **Modern & Minimalist**: Clean, professional UI with agricultural theme
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Voice-first approach ensures accessibility for all literacy levels
- **Intuitive Navigation**: Easy-to-use interface with clear visual hierarchy

### 🔧 Technical Features

- **React 19** with TypeScript for type safety
- **React Router** for seamless navigation
- **Lucide React** for beautiful, consistent icons
- **CSS Variables** for maintainable theming
- **Speech Recognition API** integration for voice input
- **Camera API** integration for crop analysis

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── ChatInterface.tsx # Chat message display
│   ├── VoiceInterface.tsx # Voice input component
│   └── CameraInterface.tsx # Camera capture modal
├── pages/              # Page components
│   ├── Home.tsx        # Main chat interface
│   └── About.tsx       # Application information
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and design system
```

## Key Components

### Home Page

- ChatGPT-like chat interface with voice and text input
- Camera integration for crop analysis
- Real-time AI responses with loading states
- Responsive design for all devices

### About Page

- Comprehensive application information
- Feature highlights with icons
- Mission and values section
- Statistics and impact metrics
- Call-to-action section

### Voice Interface

- Browser speech recognition integration
- Visual feedback for listening states
- Support for multiple languages (configurable)
- Fallback to text input when not supported

### Camera Interface

- Modal-based camera capture
- Real-time preview with focus frame
- Image capture and confirmation
- Mobile-optimized interface

## Design System

The application uses a comprehensive CSS variable-based design system:

- **Colors**: Agricultural green theme with neutral grays
- **Typography**: Inter font family with consistent sizing
- **Spacing**: Consistent spacing scale using CSS variables
- **Components**: Reusable button, card, and form styles
- **Animations**: Smooth transitions and hover effects

## Browser Support

- Chrome/Edge: Full support including speech recognition
- Firefox: Text input mode (speech recognition limited)
- Safari: Text input mode (speech recognition limited)
- Mobile browsers: Full responsive support

## Future Enhancements

- Multi-language support for voice recognition
- Offline capability with service workers
- Advanced crop analysis with ML models
- Weather integration and forecasting
- Community features and farmer networks
- Push notifications for important alerts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is part of the KhetiAI agricultural assistance platform.
