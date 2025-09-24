# 🚀 CogniSync - AI-Powered Project Management Platform

A comprehensive project management platform that leverages AI agents to provide intelligent project coordination, risk assessment, and optimization recommendations.

## ✨ Features

- **AI-Powered Insights**: 4 specialized AI agents for project optimization
- **Advanced Analytics**: 6-tab comprehensive dashboard with data visualizations
- **Team Management**: Complete team coordination and workload tracking
- **Dependency Mapping**: Interactive task dependency visualization
- **Risk Assessment**: Automated risk detection and mitigation strategies
- **Real-time Chat**: AI assistant for project management queries

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **AI**: Google Gemini AI integration
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd cognisync-backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   # Add your Gemini API key to .env.local
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

\`\`\`env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
\`\`\`

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 📱 Pages

- `/` - Landing page with hero section and AI agents showcase
- `/login` - User authentication
- `/signup` - User registration
- `/forgot-password` - Password reset
- `/dashboard` - Main project management interface

## 🤖 AI Agents

1. **AlignBot** - Goal alignment and team coordination
2. **DepGraph AI** - Dependency mapping and workflow optimization
3. **RiskSeeker AI** - Risk detection and mitigation
4. **TimeShift AI** - Timeline optimization and scheduling

## 🏗 Project Structure

\`\`\`
cognisync-backend/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── page.tsx          # Homepage
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Custom components
├── lib/                  # Utility functions and AI logic
└── public/               # Static assets
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
bash
npm run build
# Deploy to Vercel

### Other Platforms
bash
npm run build
npm start

## 📊 Analytics Dashboard

The dashboard includes 6 comprehensive tabs:

1. **Overview** - Project health and key metrics
2. **Tasks** - Task management and progress tracking
3. **Team** - Team workload and skills assessment
4. **Analytics** - Advanced data visualizations
5. **Dependencies** - Interactive dependency graphs
6. **AI Insights** - AI-powered recommendations

## 🔧 Development

\`\`\`bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
\`\`\`

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
