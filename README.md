# HomeoInvent - Homeopathic Medicine Inventory Manager

HomeoInvent is an advanced offline-first homeopathic medicine learning and inventory management application that provides comprehensive health insights through intelligent medication tracking and user-centric wellness tools, powered by **DeepSeek R1 AI** for all intelligent features.

## 🚀 AI Features Powered by DeepSeek R1

HomeoInvent now uses **DeepSeek R1 API** for ALL AI functionality, providing:

- **🩺 AI Doctor (Dr. Harmony)**: Advanced symptom analysis and remedy suggestions
- **🤖 AI Helper**: Intelligent inventory management and trend analysis  
- **📚 Learning Assistant**: Dynamic quiz generation and educational content
- **💬 Smart Chatbot**: Natural language conversations about homeopathy

## ✨ Core Features

- **Complete Inventory Management**: Track your homeopathic medicines with details like potency, company, location, and quantity
- **AI-Powered Analysis**: Get remedy suggestions through intelligent symptom analysis with Dr. Harmony (DeepSeek R1)
- **Cloud Sharing**: Share your inventory with family members through secure share codes
- **Offline-First Design**: Works without internet connection using local storage
- **Enhanced Learning Assistant**: Master homeopathic remedies with AI-generated interactive quizzes
- **Life Wisdom**: Daily wellness tips and quotes from various traditions
- **Export Options**: Generate PDF and Excel reports of your inventory
- **Responsive UI**: Beautiful interface optimized for all devices

## 🔧 DeepSeek R1 API Setup Instructions

### Step 1: Get Your DeepSeek API Key

1. **Visit DeepSeek**: Go to [https://platform.deepseek.com](https://platform.deepseek.com)
2. **Create Account**: Sign up for a DeepSeek account if you don't have one
3. **Generate API Key**: Navigate to API Keys section and create a new API key
4. **Copy Key**: Save your API key securely (it starts with `sk-`)

### Step 2: Configure Environment Variables

#### Option A: Using .env File (Recommended)

1. **Create .env file**: In your project root directory, create a file named `.env`
2. **Add API Key**: Add the following line to your `.env` file:
   ```
   DEEPSEEK_API_KEY=your_actual_api_key_here
   ```
3. **Replace placeholder**: Replace `your_actual_api_key_here` with your actual DeepSeek API key

#### Option B: Using Replit Secrets (For Replit Users)

1. **Open Secrets**: In Replit, click on the "Secrets" tab (lock icon) in the left sidebar
2. **Add Secret**: Click "New Secret"
3. **Set Key**: Enter `DEEPSEEK_API_KEY` as the key
4. **Set Value**: Paste your DeepSeek API key as the value
5. **Save**: Click "Add Secret"

### Step 3: Verify Setup

1. **Restart Application**: Restart your development server
2. **Check Console**: Look for the startup message - you should NOT see the warning about missing API key
3. **Test AI Features**: Try using any AI feature (AI Doctor, AI Helper, Learning Assistant)

### Step 4: Testing Your DeepSeek Integration

#### Test AI Doctor (Dr. Harmony):
1. Click the "AI Doctor" button in the app
2. Enter symptoms like "headache and fever"
3. You should receive detailed remedy suggestions powered by DeepSeek R1

#### Test AI Helper:
1. Click the "AI Helper" button
2. Ask questions like "show my inventory trends" or "alternatives for Arnica"
3. You should get intelligent responses about your medicine collection

#### Test Learning Assistant:
1. Navigate to the Learning section
2. Request quiz questions about specific remedies
3. The system will generate dynamic educational content

### 🔍 Troubleshooting

**If you see "API key not configured" warnings:**
- Double-check your `.env` file exists in the root directory
- Verify the API key is correctly formatted (starts with `sk-`)
- Restart the application after adding the key
- Check for any extra spaces or quotes around the key

**If AI features return fallback responses:**
- Ensure your DeepSeek account has sufficient credits
- Verify the API key has proper permissions
- Check your internet connection
- Review the console for any error messages

**For Replit users:**
- Make sure the secret is named exactly `DEEPSEEK_API_KEY`
- Try refreshing the Replit workspace after adding secrets

### 📚 How DeepSeek R1 Powers HomeoInvent

**AI Doctor (Dr. Harmony)**:
- Uses DeepSeek R1 to analyze symptom descriptions
- Provides evidence-based remedy recommendations
- Integrates with your inventory for personalized suggestions
- Falls back to authentic Boericke's Materia Medica if API unavailable

**AI Helper**:
- Analyzes your medicine inventory patterns
- Suggests alternatives and substitutions
- Provides usage trends and optimization tips
- Handles natural language queries about your collection

**Learning Assistant**:
- Generates custom quiz questions using DeepSeek R1
- Creates educational content tailored to your level
- Provides detailed explanations for learning concepts
- Adapts difficulty based on your progress

**Smart Chatbot**:
- Handles general conversations about homeopathy
- Provides contextual help and guidance
- Routes queries to appropriate specialized functions
- Maintains conversation context for better interactions

### 🚀 Benefits of DeepSeek R1 Integration

- **Unified AI Experience**: All AI features use the same advanced model
- **Consistent Quality**: High-quality responses across all functions
- **Cost Effective**: Single API subscription for all AI features
- **Better Performance**: Advanced reasoning capabilities of DeepSeek R1
- **Authentic Data**: AI enhanced with authentic homeopathic literature
- **Graceful Fallback**: App continues working with local data if API unavailable

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