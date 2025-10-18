# Exams And Test - Frontend

A modern, adaptive exam platform built with Next.js, featuring a clean authentication system and professional exam interface.

## 🚀 Features

### Authentication System
- **Google OAuth Integration**: Seamless sign-in with Google
- **Email/Password Authentication**: Traditional login with Supabase
- **Password Setup Flow**: First-time Google users can set a password
- **Secure Session Management**: JWT token handling with automatic refresh

### Exam Interface
- **Adaptive Testing**: Questions adapt to user ability in real-time
- **Professional Timer**: Enhanced timer with progress bar and urgency indicators
- **Clean UI**: Distraction-free exam environment
- **Responsive Design**: Works perfectly on all devices

### Landing Page
- **Modern Design**: HackerRank-inspired professional layout
- **Animated Starfield**: Beautiful background animations
- **Smooth Scrolling**: Native scroll-snap and reveal animations
- **Brand Consistency**: Emerald color scheme throughout

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **State Management**: React Context + Zustand
- **Icons**: Lucide React
- **Validation**: Zod

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_BASE=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── exam/              # Exam interface
│   │   ├── login/             # Login page
│   │   ├── set-password/      # Password setup
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── auth/              # Authentication components
│   │   ├── charts/            # Chart components
│   │   └── ui/                # UI components
│   ├── contexts/              # React contexts
│   ├── lib/                   # Utilities and configurations
│   └── media/                 # Static assets
├── public/                    # Public assets
└── package.json
```

## 🎨 Design System

### Button System
- **Primary**: Dark brand buttons for main actions
- **Emerald**: Brand-colored buttons for key CTAs
- **Outline**: Clean outline style
- **Ghost**: Muted tertiary style
- **Social**: Consistent social button styling

### Color Palette
- **Primary**: Emerald (#10b981)
- **Secondary**: Slate grays
- **Background**: White with subtle gradients
- **Text**: High contrast for accessibility

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, professional fonts
- **Code**: Monospace for technical content

## 🔐 Authentication Flow

1. **New Users**: Google OAuth → Password Setup → Dashboard
2. **Existing Users**: Email/Password or Google → Dashboard
3. **Session Management**: Automatic token refresh and logout

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet**: Enhanced layouts for medium screens
- **Desktop**: Full-featured experience with animations
- **Accessibility**: WCAG compliant with proper focus states

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with Next.js static export
- **AWS Amplify**: Full-stack deployment support
- **Docker**: Containerized deployment available

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: hello@examsandtest.com

## 🙏 Acknowledgments

- **Supabase** for authentication and database
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for beautiful icons
