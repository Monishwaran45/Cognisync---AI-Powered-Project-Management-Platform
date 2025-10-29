import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Target,
  GitBranch,
  AlertTriangle,
  Clock,
  Users,
  BarChart3,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="w-full fixed top-0 left-0 px-4 sm:px-6 lg:px-12 py-5 flex justify-between items-center z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <Link href="/" className="text-2xl font-bold text-white">
          CogniSync
        </Link>
        <ul className="flex items-center gap-4 sm:gap-8 list-none m-0 p-0">
          <li>
            <Link href="/" className="text-white no-underline font-semibold hover:text-blue-300 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className="text-white no-underline font-semibold hover:text-blue-300 transition-colors"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/login" className="text-white no-underline font-semibold hover:text-blue-300 transition-colors">
              Login
            </Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-600/20 text-blue-300 border-blue-500/30 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Project Management
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Intelligent Project
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Coordination
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Harness the power of AI agents to optimize your team's performance, predict project risks, and deliver
            exceptional results on time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-gray-400">Project Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">40%</div>
              <div className="text-gray-400">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">AI Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-400">Teams Powered</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Meet Your AI Team</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Four specialized AI agents working together to ensure your projects succeed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* AlignBot */}
            <Card className="bg-black/20 border-white/10 text-white hover:bg-black/30 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">AlignBot</CardTitle>
                <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">Goal Alignment</Badge>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-300 mb-4">
                  Ensures every team member stays aligned with project objectives and company goals.
                </CardDescription>
                <div className="flex justify-center gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Real-time monitoring</span>
                </div>
              </CardContent>
            </Card>

            {/* DepGraph AI */}
            <Card className="bg-black/20 border-white/10 text-white hover:bg-black/30 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <GitBranch className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">DepGraph AI</CardTitle>
                <Badge className="bg-green-600/20 text-green-300 border-green-500/30">Dependencies</Badge>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-300 mb-4">
                  Maps and optimizes task dependencies to prevent bottlenecks and delays.
                </CardDescription>
                <div className="flex justify-center gap-2 text-sm text-gray-400">
                  <BarChart3 className="w-4 h-4" />
                  <span>Visual mapping</span>
                </div>
              </CardContent>
            </Card>

            {/* RiskSeeker AI */}
            <Card className="bg-black/20 border-white/10 text-white hover:bg-black/30 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">RiskSeeker AI</CardTitle>
                <Badge className="bg-red-600/20 text-red-300 border-red-500/30">Risk Detection</Badge>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-300 mb-4">
                  Proactively identifies potential risks and suggests mitigation strategies.
                </CardDescription>
                <div className="flex justify-center gap-2 text-sm text-gray-400">
                  <Shield className="w-4 h-4" />
                  <span>Predictive analysis</span>
                </div>
              </CardContent>
            </Card>

            {/* TimeShift AI */}
            <Card className="bg-black/20 border-white/10 text-white hover:bg-black/30 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">TimeShift AI</CardTitle>
                <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">Timeline Optimization</Badge>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-300 mb-4">
                  Optimizes project timelines and resource allocation for maximum efficiency.
                </CardDescription>
                <div className="flex justify-center gap-2 text-sm text-gray-400">
                  <Zap className="w-4 h-4" />
                  <span>Smart scheduling</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">Powerful Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage projects efficiently and effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-blue-400 mb-4" />
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Comprehensive dashboards with real-time insights, performance metrics, and predictive analytics.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <Users className="w-8 h-8 text-green-400 mb-4" />
                <CardTitle>Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Seamless team coordination with workload balancing, skill tracking, and communication tools.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <Brain className="w-8 h-8 text-purple-400 mb-4" />
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Intelligent recommendations, risk predictions, and optimization suggestions powered by advanced AI.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-white/10 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Projects?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of teams already using CogniSync to deliver exceptional results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
                  >
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold text-white mb-4">CogniSync</div>
          <p className="text-gray-400 mb-6">AI-powered project management for the modern team</p>
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-gray-500">© 2024 CogniSync. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
