# HomeoInvent - Homeopathic Medicine Inventory Manager

HomeoInvent is an advanced offline-first homeopathic medicine learning and inventory management application that provides comprehensive health insights through intelligent medication tracking and user-centric wellness tools.

## Features

- **Complete Inventory Management**: Track your homeopathic medicines with details like potency, company, location, and quantity
- **AI-Powered Analysis**: Get remedy suggestions through intelligent symptom analysis with Dr. Harmony
- **Cloud Sharing**: Share your inventory with family members through secure share codes
- **Offline-First Design**: Works without internet connection using local storage
- **Enhanced Learning Assistant**: Master homeopathic remedies with our interactive learning system featuring compact design, glowing purple gradients, and smooth animations
- **Life Wisdom**: Daily wellness tips and quotes from various traditions
- **Export Options**: Generate PDF and Excel reports of your inventory
- **Responsive UI**: Beautiful interface optimized for all devices

## UI Design

HomeoInvent features a premium, cohesive user interface with:

- **Purple Gradient Theme**: Consistent color scheme throughout the application
- **Glassy Effects**: Semi-transparent backgrounds with backdrop blur for a modern look
- **Animated Elements**: Subtle animations for interactive elements
- **Standardized Container Heights**: Fixed dimensions to prevent layout shifts
- **Glowing Effects**: Interactive elements have beautiful glow effects on hover
- **Smooth Transitions**: All state changes feature smooth animations

## Learning Assistant Features

The Learning Assistant has been enhanced with:

- **Perfectly Centered Header**: "Learning Assistant" title centered with enhanced purple gradient and glassy effects
- **Return to Home Button**: Easy navigation back to the main app with a clean X button
- **Enhanced Search Interface**: Simplified "Search medicines" placeholder with improved icon visibility in both light and dark modes
- **Improved Dark Mode**: Enhanced text contrast for "Test Knowledge" and "Learn Remedies" tabs with better visibility
- **Hidden Scrollbars**: Clean scrolling experience without visible scrollbars in the medicine display area
- **Smart Scroll Button**: Bottom-to-top button appears in the medicine area when scrolling down with smooth animation
- **Enhanced Medicine Cards**: Glowing purple gradients with smooth hover animations and glassy textures
- **Optimized Display Area**: Increased space for medicine visibility with better grid layout
- **Smart Medicine Counter**: Bottom-right placement of medicine count with glassy background
- **Scroll-Hidden Search**: Search bar elegantly hides on scroll down and reappears on scroll up
- **Incremental Loading**: "See More" button for loading 10 more medicines at a time

## Technology Stack

- **Frontend**: React with Vite
- **State Management**: Zustand for global state
- **Database**: PostgreSQL with Drizzle ORM
- **Local Storage**: IndexedDB for offline-first functionality
- **Styling**: Tailwind CSS with custom animations
- **AI Integration**: API-powered symptom analysis
- **Authentication**: Firebase (optional)

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server with `npm run dev`
5. Open [http://localhost:5000](http://localhost:5000) in your browser

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Boericke's Materia Medica for remedy data
- Classical homeopathic literature for AI analysis
- Tailwind CSS for styling utilities
- Replit for hosting and development environment