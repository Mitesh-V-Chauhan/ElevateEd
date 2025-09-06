# 🎓 ElevateEd AI - Transform Learning with Intelligent Tools

<div align="center">

![ElevateEd AI](public/elevateed.jpeg)

*The all-in-one platform for modern students and educators to simplify and accelerate learning*

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

## 🌟 Overview

ElevateEd AI is a cutting-edge educational platform that harnesses the power of artificial intelligence to transform any content into interactive learning experiences. Whether you're a student studying for exams or an educator creating engaging materials, ElevateEd AI provides the tools you need to enhance learning outcomes.

### ✨ Key Features

- **🧠 AI-Powered Quiz Generation** - Transform any content into intelligent quizzes
- **📊 Interactive Flowcharts** - Visualize complex concepts with dynamic flowcharts
- **📚 Smart Flashcards** - Create memorable flashcard sets for effective studying
- **📝 Content Summarization** - Generate concise summaries from lengthy materials
- **🌍 Multi-Language Support** - Generate content in multiple languages
- **📱 Responsive Design** - Seamless experience across all devices
- **🔐 Secure Authentication** - Protected user accounts with Firebase
- **☁️ Cloud Storage** - Save and access your content anywhere

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18.0 or higher)
- **npm** (version 8.0 or higher)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mitesh-V-Chauhan/ElevateEd.git
   cd ElevateEd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain_here
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
ElevateEd-2-Frontend/
├── public/                     # Static assets
│   ├── elevateed.jpeg         # Logo and images
│   └── *.svg                  # Icon files
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── flowchart/         # Flowchart generation & viewing
│   │   ├── flashcard/         # Flashcard creation & viewing
│   │   ├── generator/         # Quiz generation
│   │   ├── summariser/        # Content summarization
│   │   ├── profile/           # User profile management
│   │   ├── history/           # User content history
│   │   └── ...               # Other feature pages
│   ├── components/            # Reusable UI components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Footer.tsx         # Site footer
│   │   ├── UniversalSidebar.tsx # Content input sidebar
│   │   ├── InteractiveFlowchart.tsx # Flowchart visualization
│   │   ├── InteractiveFlashcards.tsx # Flashcard interface
│   │   ├── ProtectedRoute.tsx # Authentication wrapper
│   │   └── ThemeToggle.tsx    # Dark/light mode toggle
│   ├── contexts/              # React Context providers
│   │   ├── AuthContext.tsx    # Authentication state
│   │   ├── ThemeContext.tsx   # Theme management
│   │   ├── InputContext.tsx   # Content input state
│   │   └── QuizContext.tsx    # Quiz state management
│   ├── services/              # External service integrations
│   │   ├── firebase.tsx       # Firebase configuration
│   │   ├── firebaseFunctions/ # Firebase CRUD operations
│   │   └── interfaces/        # TypeScript interfaces
│   └── utils/                 # Utility functions
├── .env                       # Environment variables
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

## 🔧 Features Deep Dive

### 🧠 AI-Powered Quiz Generation

Transform any text content into intelligent quizzes with customizable parameters:

- **Multiple Question Types**: Multiple choice, true/false, short answer
- **Difficulty Levels**: Easy, medium, hard
- **Custom Question Count**: 5-50 questions
- **Time Limits**: Configurable quiz timers
- **Detailed Analytics**: Performance tracking and insights

**Usage:**
1. Input your content via text, PDF, or URL
2. Select quiz parameters (difficulty, question count, time limit)
3. Generate quiz instantly
4. Take the quiz or share with others
5. View detailed results and analytics

### 📊 Interactive Flowcharts

Visualize complex processes and concepts with dynamic flowcharts:

- **Automatic Layout**: AI determines optimal flowchart structure
- **Interactive Navigation**: Click and zoom functionality
- **Custom Styling**: Different node types and colors
- **Export Options**: Download as PNG or SVG
- **Responsive Design**: Works on all screen sizes

**Usage:**
1. Provide process or concept description
2. Add custom instructions for specific formatting
3. Select output language
4. Generate interactive flowchart
5. Navigate and export your visualization

### 📚 Smart Flashcards

Create effective study materials with AI-generated flashcards:

- **Intelligent Content Extraction**: Identifies key concepts automatically
- **Spaced Repetition**: Optimized for memory retention
- **Progress Tracking**: Monitor learning progress
- **Export Options**: Download as CSV for external use
- **Interactive Study Mode**: Flip cards and track performance

**Usage:**
1. Input study material (text, PDF, notes)
2. AI extracts key concepts and creates Q&A pairs
3. Study with interactive flashcard interface
4. Track progress and identify weak areas
5. Export for offline study

### 📝 Content Summarization

Generate concise summaries from lengthy documents:

- **Adjustable Length**: Short, medium, or detailed summaries
- **Key Point Extraction**: Identifies most important information
- **Multi-Format Support**: Text, PDF, web pages
- **Language Preservation**: Maintains original language nuances

### 🔐 User Authentication & Data Management

Secure user accounts with comprehensive data management:

- **Firebase Authentication**: Secure login/signup system
- **User Profiles**: Customizable profile information
- **Content History**: Access all previously generated content
- **Cloud Sync**: Content synced across devices
- **Privacy Controls**: Manage data sharing and privacy settings

### 🌙 Theme & Accessibility

Modern, accessible design with user preferences:

- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Mobile-first approach
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **High Contrast**: Optimized for visual accessibility

## 🛠️ Technology Stack

### Frontend
- **[Next.js 15.3.3](https://nextjs.org/)** - React framework with App Router
- **[React 19.0](https://reactjs.org/)** - UI library with latest features
- **[TypeScript 5.0](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4.0](https://tailwindcss.com/)** - Utility-first CSS framework

### UI Components & Icons
- **[Lucide React](https://lucide.dev/)** - Beautiful, customizable icons
- **[React Spring](https://react-spring.dev/)** - Smooth animations
- **[React Flow](https://reactflow.dev/)** - Interactive node-based UIs
- **[React Resizable Panels](https://github.com/bvaughn/react-resizable-panels)** - Resizable layouts

### Backend & Database
- **[Firebase 11.9.1](https://firebase.google.com/)** - Backend-as-a-Service
  - **Authentication** - User management
  - **Firestore** - NoSQL database
  - **Storage** - File uploads and storage
  - **Hosting** - Web hosting platform

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Vercel](https://vercel.com/)** - Deployment platform
- **[Git](https://git-scm.com/)** - Version control

## 📱 Responsive Design

ElevateEd AI is built with a mobile-first approach, ensuring optimal experience across all devices:

- **Mobile** (320px - 768px): Optimized touch interface
- **Tablet** (768px - 1024px): Adaptive layouts
- **Desktop** (1024px+): Full-featured experience
- **4K/Ultra-wide**: Scales beautifully on large displays

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Configure environment variables
   - Deploy automatically

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | ✅ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase analytics measurement ID | ❌ |

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication, Firestore, and Storage

2. **Configure Authentication**
   - Enable Email/Password authentication
   - Set up authorized domains

3. **Set up Firestore**
   - Create database in test mode
   - Configure security rules as needed

4. **Configure Storage**
   - Set up Firebase Storage
   - Configure CORS for file uploads

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### E2E Testing

```bash
# Run end-to-end tests
npm run e2e

# Run E2E tests in headed mode
npm run e2e:headed
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow ESLint configuration
- **TypeScript**: Use strict type checking
- **Components**: Create reusable, well-documented components
- **Testing**: Write tests for new features
- **Accessibility**: Ensure WCAG 2.1 compliance

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & FAQ

### Common Issues

**Q: Firebase authentication not working**
A: Ensure all environment variables are correctly set and Firebase project is properly configured.

**Q: Build failing on Vercel**
A: Check that all environment variables are set in Vercel dashboard and Node.js version is compatible.

**Q: Styles not loading correctly**
A: Clear browser cache and ensure Tailwind CSS is properly configured.

### Getting Help

- **Documentation**: Check our [Wiki](https://github.com/Mitesh-V-Chauhan/ElevateEd/wiki)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/Mitesh-V-Chauhan/ElevateEd/issues)
- **Discussions**: Join community discussions on [GitHub Discussions](https://github.com/Mitesh-V-Chauhan/ElevateEd/discussions)

## 🚦 Roadmap

### Upcoming Features

- [ ] **AI Voice Integration** - Text-to-speech and speech-to-text
- [ ] **Collaborative Study** - Real-time collaborative features
- [ ] **Advanced Analytics** - Detailed learning insights
- [ ] **Mobile App** - Native iOS and Android applications
- [ ] **Plugin System** - Third-party integrations
- [ ] **Offline Mode** - Work without internet connection

### Version History

- **v0.1.0** - Initial release with core features
- **v0.2.0** - Added flowchart generation (Coming Soon)
- **v0.3.0** - Enhanced AI capabilities (Coming Soon)

## 👥 Team

### Core Contributors

- **[Mitesh V. Chauhan](https://github.com/Mitesh-V-Chauhan)** - Co-Lead Developer & Project Co-Founder
- **[Yuvraj Rathod](https://github.com/YuvrajRathod)** - Co-Lead Developer & Project Co-Founder

### Acknowledgments

- Thanks to all contributors who have helped shape ElevateEd AI
- Special thanks to the open-source community for the amazing tools and libraries
- Inspired by the need for better educational technology solutions

---

<div align="center">

**[🌟 Star this repo](https://github.com/Mitesh-V-Chauhan/ElevateEd)** | **[🐛 Report Bug](https://github.com/Mitesh-V-Chauhan/ElevateEd/issues)** | **[💡 Request Feature](https://github.com/Mitesh-V-Chauhan/ElevateEd/issues)**

Made with ❤️ for education by the ElevateEd AI team

</div>
