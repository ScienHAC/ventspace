"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Heart, Leaf } from "lucide-react"
import Link from "next/link"

interface MoodEntry {
  id: string
  date: Date
  mood: "happy" | "sad" | "anxious" | "angry" | "neutral" | "hopeful"
  intensity: number
  notes?: string
  triggers?: string[]
}

export default function MoodPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMoodData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/mood', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch mood data')
      }

      const data = await response.json()
      console.log('Fetched mood data:', data) // Debug log

      // Handle different response formats safely
      let entries = []
      if (data.data && Array.isArray(data.data)) {
        entries = data.data
      } else if (data.entries && Array.isArray(data.entries)) {
        entries = data.entries
      } else if (Array.isArray(data)) {
        entries = data
      } else {
        console.warn('Unexpected data format:', data)
        entries = [] // Fallback to empty array
      }

      // Convert date strings to Date objects safely
      const entriesWithDates = entries.map((entry: any) => ({
        ...entry,
        date: entry.date ? new Date(entry.date) : new Date(),
        mood: entry.mood || 'neutral',
        intensity: entry.intensity || 3,
        notes: entry.notes || '',
        triggers: entry.triggers || []
      }))

      setMoodEntries(entriesWithDates)
      setError(null)
    } catch (error) {
      console.error('Error fetching mood data:', error)
      setError('Failed to load mood data')
      
      // Set fallback mock data
      setMoodEntries([
        {
          id: "1",
          date: new Date("2024-06-10"),
          mood: "anxious",
          intensity: 4,
          notes: "IIT exam stress hitting hard",
          triggers: ["academic", "future"],
        },
        {
          id: "2", 
          date: new Date("2024-06-11"),
          mood: "sad",
          intensity: 3,
          notes: "Didn't get admission to preferred college",
          triggers: ["academic", "disappointment"],
        },
        {
          id: "3",
          date: new Date("2024-06-12"),
          mood: "hopeful", 
          intensity: 4,
          notes: "Found alternative college options!",
          triggers: ["hope", "new_opportunities"],
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMoodData()
  }, [])

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "happy": return "bg-yellow-100 border-yellow-300 text-yellow-800"
      case "sad": return "bg-blue-100 border-blue-300 text-blue-800"
      case "anxious": return "bg-purple-100 border-purple-300 text-purple-800"
      case "angry": return "bg-red-100 border-red-300 text-red-800"
      case "hopeful": return "bg-green-100 border-green-300 text-green-800"
      default: return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "happy": return "😊"
      case "sad": return "😢"
      case "anxious": return "😰"
      case "angry": return "😠" 
      case "hopeful": return "🌟"
      default: return "😐"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your mood journey...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              VentSpace
            </h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/chat">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                Back to Chat
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Your Mood Journey
          </h2>
          <p className="text-gray-600">Track your emotional wellness and see your growth over time</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">⚠️ {error} - Showing sample data</p>
          </div>
        )}

        {/* Mood Entries */}
        <div className="space-y-4">
          {moodEntries.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No mood entries yet</h3>
              <p className="text-gray-500 mb-4">Start chatting to track your emotional journey!</p>
              <Link href="/chat">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  Start Venting
                </Button>
              </Link>
            </Card>
          ) : (
            moodEntries.map((entry) => (
              <Card key={entry.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{getMoodEmoji(entry.mood)}</div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getMoodColor(entry.mood)}>
                          {entry.mood}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Intensity: {entry.intensity}/5
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{entry.notes}</p>
                      {entry.triggers && entry.triggers.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.triggers.map((trigger, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {entry.date.toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {entry.date.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Stats Summary */}
        {moodEntries.length > 0 && (
          <Card className="mt-8 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold">Your Progress</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{moodEntries.length}</div>
                <div className="text-sm text-gray-600">Total Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.ceil(moodEntries.length / 10)}
                </div>
                <div className="text-sm text-gray-600">Trees Planted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(moodEntries.reduce((sum, entry) => sum + entry.intensity, 0) / moodEntries.length * 10) / 10}
                </div>
                <div className="text-sm text-gray-600">Avg Intensity</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
