"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Leaf, Heart, Shield, Users, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [treeCount, setTreeCount] = useState(2847)
  const [userCount, setUserCount] = useState(12543)

  useEffect(() => {
    // Simulate growing numbers
    const interval = setInterval(() => {
      setTreeCount((prev) => prev + Math.floor(Math.random() * 3))
      setUserCount((prev) => prev + Math.floor(Math.random() * 5))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              VentSpace
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/chat" className="text-gray-600 hover:text-green-600 transition-colors">
              Chat
            </Link>
            <Link href="/garden" className="text-gray-600 hover:text-green-600 transition-colors">
              My Garden
            </Link>
            <Link href="/mood" className="text-gray-600 hover:text-green-600 transition-colors">
              Mood Tracker
            </Link>
            <Link href="/chat">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                Start Venting
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
            <Sparkles className="w-4 h-4 mr-1" />
            AI-Powered Mental Health Support
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Vent. Heal. Grow.
            <br />
            <span className="text-3xl md:text-4xl">Plant the Planet 🌱</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your mental health matters, and so does our planet. Every time you vent, you're not just healing yourself –
            you're helping heal the Earth too. Because that's just how we roll. 💚
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/chat">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Venting (It's Free!)
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-full border-2 border-green-200 hover:border-green-300 hover:bg-green-50"
            >
              <Shield className="w-5 h-5 mr-2" />
              Emergency Support
            </Button>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{treeCount.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Trees Planted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{userCount.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Vents Shared</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-500">AI Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">100%</div>
              <div className="text-sm text-gray-500">Anonymous</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Why Gen Z Loves VentSpace
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-green-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">AI That Actually Gets It</h3>
            <p className="text-gray-600">
              No cringe therapy speak. Our AI understands your vibe and responds with real talk, memes, and actual
              helpful advice.
            </p>
          </Card>

          <Card className="p-6 bg-white/70 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Vent to Plant™</h3>
            <p className="text-gray-600">
              Every 10 vents = 1 real tree planted. Turn your emotional journey into environmental impact. Because
              healing the planet while healing yourself hits different.
            </p>
          </Card>

          <Card className="p-6 bg-white/70 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Mood Magic</h3>
            <p className="text-gray-600">
              Track your emotions with beautiful visualizations. Get personalized playlists, breathing exercises, and
              self-care suggestions.
            </p>
          </Card>

          <Card className="p-6 bg-white/70 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-600 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Crisis Mode Activated</h3>
            <p className="text-gray-600">
              SOS button, distress codewords, and instant connection to real humans when you need it most. We've got
              your back, always.
            </p>
          </Card>

          <Card className="p-6 bg-white/70 backdrop-blur-sm border-orange-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Anonymous Squad</h3>
            <p className="text-gray-600">
              Join group vents with people who get it. Share without judgment, connect without revealing your identity.
              It's like therapy, but make it social.
            </p>
          </Card>

          <Card className="p-6 bg-white/70 backdrop-blur-sm border-indigo-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Guided Journeys</h3>
            <p className="text-gray-600">
              "Breakup Recovery," "Exam Stress," "Quarter-Life Crisis" – 5-day courses that actually help you level up
              your mental game.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Gen Z'ers who are healing themselves and the planet, one vent at a time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/chat">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Your First Vent
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-green-600 hover:bg-white/10 text-lg px-8 py-6 rounded-full"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">VentSpace</h3>
              </div>
              <p className="text-gray-400">Mental health support that doesn't suck. For Gen Z, by Gen Z.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Crisis Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    AI Chat
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mood Tracking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Virtual Garden
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VentSpace. Making mental health cool since day one. 💚</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
