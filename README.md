# Bible Letters Adventure

A delightful faith-focused educational game where children learn Bible words and spelling through interactive play.

## 🎮 Game Features

- **Progressive Learning**: Home → Word Selection → Letter Spelling → Sentence Building → Reward
- **Interactive Gameplay**: Drag-and-drop letter tiles with visual and audio feedback
- **Speech Integration**: Text-to-speech for words, definitions, and encouragement
- **Progress Tracking**: Local storage saves completed words and settings
- **Responsive Design**: Optimized for mobile and desktop devices
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🛠 Technical Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Animations**: Framer Motion, Lottie animations
- **Build Tool**: Vite
- **Audio**: Web Audio API, Speech Synthesis API
- **Styling**: Custom CSS with Tailwind utilities

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Game.tsx        # Letter spelling game
│   ├── SentenceGame.tsx # Sentence building game
│   ├── Home.tsx        # Welcome screen
│   ├── WordList.tsx    # Word selection screen
│   ├── Reward.tsx      # Celebration screen
│   └── Settings.tsx    # Game settings
├── hooks/              # Custom React hooks
│   └── useGameState.ts # Game state management
├── services/           # Business logic services
│   ├── soundService.ts # Sound effects management
│   └── speechService.ts # Text-to-speech functionality
├── utils/              # Utility functions
│   └── responsive.ts   # Responsive design calculations
├── constants/          # Configuration constants
│   └── index.ts        # Game configuration
├── data/               # Static data
│   └── words.ts        # Bible words database
└── App.tsx             # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bible-letters-adventure
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Gemini API key to .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 Game Flow

1. **Home Screen**: Welcome message with progress indicator
2. **Word Selection**: Alphabetically organized Bible words with completion status
3. **Letter Game**: Drag letters to spell the selected word
4. **Sentence Game**: Arrange words to complete a Bible verse
5. **Reward Screen**: Celebration with word definition and verse context

## 🔧 Configuration

### Game Settings
- **Sound Effects**: Toggle game sounds on/off
- **Background Music**: Control background audio
- **Progress Reset**: Parental controls for resetting game progress

### Responsive Breakpoints
- **Small screens**: < 500px (mobile phones)
- **Medium screens**: < 640px (small tablets)
- **Large screens**: ≥ 640px (tablets and desktop)

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) - Trust and wisdom
- **Secondary**: Yellow (#F59E0B) - Joy and celebration  
- **Success**: Green (#10B981) - Achievement
- **Background**: Warm cream (#FDFBF2) - Comfort

### Typography
- **Display Font**: Outfit (headings and UI)
- **Body Font**: Inter (readable text)

### Animations
- **Framer Motion**: Page transitions and interactions
- **Lottie**: Character animations (dove, celebrations)
- **CSS**: Hover effects and micro-interactions

## 📱 Accessibility Features

- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Clear visual hierarchy and readable text
- **Audio Feedback**: Speech synthesis for learning support
- **Touch Targets**: Appropriately sized for mobile interaction

## 🔊 Audio System

### Sound Effects
- **Click**: UI interaction feedback
- **Correct**: Successful letter/word placement
- **Incorrect**: Wrong placement feedback
- **Win**: Level completion celebration

### Speech Synthesis
- **Word Pronunciation**: Helps with learning
- **Definition Reading**: Educational context
- **Encouragement**: Positive reinforcement

## 💾 Data Management

### Local Storage
- **Progress**: Completed words array
- **Settings**: Sound and music preferences
- **Persistence**: Survives browser sessions

### Word Database
- **50+ Bible Words**: Age-appropriate vocabulary
- **Definitions**: Child-friendly explanations
- **Sentences**: Contextual Bible verses
- **References**: Scripture citations

## 🧪 Development

### Code Quality
- **TypeScript**: Type safety and better developer experience
- **ESLint**: Code linting and consistency
- **Prettier**: Code formatting (if configured)

### Performance
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Optimized re-renders
- **Asset Optimization**: Compressed images and audio

### Testing
```bash
npm run lint    # Type checking and linting
```

### Dev Server Note
- After major React hook refactors (especially adding/removing `useState`/`useEffect` in shared hooks like `useGameState`), restart the dev server to avoid HMR hook-order mismatch errors.
- If you see hook-order errors in console, run:
  ```bash
  # stop dev server, then
  npm run dev
  ```
  and hard-refresh the browser (`Cmd+Shift+R` on macOS).

## 🚀 Deployment

This project is configured for deployment on Google AI Studio with automatic environment variable injection.

### Environment Variables
- `GEMINI_API_KEY`: Required for AI features (auto-injected in AI Studio)
- `APP_URL`: Application URL (auto-injected in AI Studio)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache 2.0 License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Bible verses and content for educational purposes
- Lottie animations for delightful user experience
- Framer Motion for smooth animations
- Tailwind CSS for rapid UI development

---

**Built with ❤️ for children's faith-based learning**
