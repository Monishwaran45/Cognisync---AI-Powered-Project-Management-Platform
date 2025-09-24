# 🚀 CogniSync - AI-Powered Project Management Platform

A comprehensive project management platform that leverages AI agents to provide intelligent project coordination, risk assessment, and optimization recommendations.

---

## ✨ Features

- **AI-Powered Insights**: 4 specialized AI agents for project optimization  
- **Advanced Analytics**: 6-tab comprehensive dashboard with data visualizations  
- **Team Management**: Complete team coordination and workload tracking  
- **Dependency Mapping**: Interactive task dependency visualization  
- **Risk Assessment**: Automated risk detection and mitigation strategies  
- **Real-time Chat**: AI assistant for project management queries  

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript  
- **Styling**: Tailwind CSS, shadcn/ui components  
- **Charts**: Recharts for data visualization  
- **AI**: Google Gemini AI integration  
- **Icons**: Lucide React  

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cognisync-backend
Install dependencies

bash
Copy code
npm install
Set up environment variables

bash
Copy code
cp .env.example .env.local
# Add your Gemini API key to .env.local
Run the development server

bash
Copy code
npm run dev
Open your browser
Navigate to http://localhost:3000

🔑 Environment Variables
env
Copy code
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
👉 Get your API key from Google AI Studio

📱 Pages
/ - Landing page with hero section and AI agents showcase

/login - User authentication

/signup - User registration

/forgot-password - Password reset

/dashboard - Main project management interface

🤖 AI Agents
AlignBot - Goal alignment and team coordination

DepGraph AI - Dependency mapping and workflow optimization

RiskSeeker AI - Risk detection and mitigation

TimeShift AI - Timeline optimization and scheduling

🏗 Project Structure
bash
Copy code
cognisync-backend/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   ├── dashboard/          # Dashboard pages
│   ├── login/              # Authentication pages
│   └── page.tsx            # Homepage
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   └── *.tsx               # Custom components
├── lib/                    # Utility functions and AI logic
└── public/                 # Static assets
🚀 Deployment
Vercel (Recommended)
bash
Copy code
npm run build
# Deploy to Vercel
Other Platforms
bash
Copy code
npm run build
npm start
📊 Analytics Dashboard
The dashboard includes 6 comprehensive tabs:

Overview - Project health and key metrics

Tasks - Task management and progress tracking

Team - Team workload and skills assessment

Analytics - Advanced data visualizations

Dependencies - Interactive dependency graphs

AI Insights - AI-powered recommendations

🔧 Development
bash
Copy code
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
📄 License
This project is licensed under the MIT License.

🤝 Contributing
Fork the repository

Create a feature branch

Make your changes

Submit a pull request

📞 Support
For support and questions, please open an issue in the repository.

vbnet
Copy code

✅ This is now **GitHub-ready** with proper markdown formatting, code blocks, and section dividers.  

Do you want me to also design a **short tagline + badges section** (like "Built with Next.js | Gemini AI | Tailwind") at the very top for extra polish?







Ask ChatGPT
