"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, Heart, Brain, Smile, Frown, Meh, Angry, Zap } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface MoodEntry {
  id: string
  date: Date
  mood: "happy" | "sad" | "anxious" | "angry" | "neutral"
  intensity: number // 1-5
  notes?: string
  triggers?: string[]
}

export default function MoodPage() {
  const { toast } = useToast()
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [currentMood, setCurrentMood] = useState<"happy" | "sad" | "anxious" | "angry" | "neutral">("neutral")
  const [weeklyTrend, setWeeklyTrend] = useState("improving")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMoodData()
  }, [])

  const fetchMoodData = async () => {
    try {
      const response = await fetch("/api/mood")
      const data = await response.json()

      // Convert date strings to Date objects
      const entriesWithDates = data.entries.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
      }))

      setMoodEntries(entriesWithDates)
      setWeeklyTrend(data.weeklyTrend)
    } catch (error) {
      console.error("Error fetching mood data:", error)
      // Fallback to default data - dates are already Date objects here
      setMoodEntries([
        {
          id: "1",
          date: new Date("2024-06-10"),
          mood: "anxious",
          intensity: 4,
          notes: "Exam stress hitting hard",
          triggers: ["academic", "future"],
        },
        {
          id: "2",
          date: new Date("2024-06-11"),
          mood: "sad",
          intensity: 3,
          notes: "Friend drama",
          triggers: ["social", "relationships"],
        },
        {
          id: "3",
          date: new Date("2024-06-12"),
          mood: "happy",
          intensity: 4,
          notes: "Aced my presentation!",
          triggers: ["achievement", "confidence"],
        },
        {
          id: "4",
          date: new Date("2024-06-13"),
          mood: "neutral",
          intensity: 3,
          notes: "Just vibing",
          triggers: ["routine"],
        },
        {
          id: "5",
          date: new Date("2024-06-14"),
          mood: "happy",
          intensity: 5,
          notes: "Best day ever! Got accepted to internship",
          triggers: ["achievement", "future"],
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const logMood = async () => {
    try {
      const response = await fetch("/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood: currentMood,
          intensity: 3, // Default intensity
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Mood Logged! 📊",
          description: `Your ${currentMood} mood has been recorded. Keep tracking your journey!`,
        })
        fetchMoodData() // Refresh data
      }
    } catch (error) {
      console.error("Error logging mood:", error)
      toast({
        title: "Error",
        description: "Failed to log mood. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getMoodIcon = (mood: string, size = "w-6 h-6") => {
    switch (mood) {
      case "happy":
        return <Smile className={`${size} text-yellow-500`} />
      case "sad":
        return <Frown className={`${size} text-blue-500`} />
      case "anxious":
        return <Zap className={`${size} text-purple-500`} />
      case "angry":
        return <Angry className={`${size} text-red-500`} />
      default:
        return <Meh className={`${size} text-gray-500`} />
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "happy":
        return "bg-yellow-100 border-yellow-300 text-yellow-800"
      case "sad":
        return "bg-blue-100 border-blue-300 text-blue-800"
      case "anxious":
        return "bg-purple-100 border-purple-300 text-purple-800"
      case "angry":
        return "bg-red-100 border-red-300 text-red-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  const getIntensityDots = (intensity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div key={i} className={`w-2 h-2 rounded-full ${i < intensity ? "bg-current" : "bg-gray-300"}`} />
    ))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your mood data...</p>
        </div>
      </div>
    )
  }

  const moodStats = {
    happy: moodEntries.filter((entry) => entry.mood === "happy").length,
    sad: moodEntries.filter((entry) => entry.mood === "sad").length,
    anxious: moodEntries.filter((entry) => entry.mood === "anxious").length,
    angry: moodEntries.filter((entry) => entry.mood === "angry").length,
    neutral: moodEntries.filter((entry) => entry.mood === "neutral").length,
  }

  const totalEntries = moodEntries.length
  const averageIntensity =
    totalEntries > 0 ? moodEntries.reduce((sum, entry) => sum + entry.intensity, 0) / totalEntries : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Mood Tracker
            </h1>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/chat">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                Vent Your Feelings
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Your Mood Journey 🧠
          </h1>
          <p className="text-xl text-gray-600">Track your emotional patterns and celebrate your mental health wins</p>
        </div>

        {/* Current Mood Check-in */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">How are you feeling right now?</h2>

          <div className="flex justify-center space-x-4 mb-6">
            {(["happy", "sad", "anxious", "angry", "neutral"] as const).map((mood) => (
              <button
                key={mood}
                onClick={() => setCurrentMood(mood)}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                  currentMood === mood ? getMoodColor(mood) : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  {getMoodIcon(mood, "w-8 h-8")}
                  <span className="text-sm font-medium capitalize">{mood}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={logMood}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Heart className="w-5 h-5 mr-2" />
              Log This Mood
            </Button>
          </div>
        </Card>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-green-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <Badge className="bg-green-100 text-green-800">Trending Up</Badge>
            </div>
            <div className="text-2xl font-bold text-gray-800">{weeklyTrend}</div>
            <div className="text-sm text-gray-600">This week's trend</div>
          </Card>

          <Card className="p-6 bg-white/70 backdrop-blur-sm border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-800">Active</Badge>
            </div>
            <div className="text-2xl font-bold text-gray-800">{totalEntries}</div>
            <div className="text-sm text-gray-600">Days tracked</div>
          </Card>

          <Card className="p-6 bg-white/70 backdrop-blur-sm border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-8 h-8 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-800">Balanced</Badge>
            </div>
            <div className="text-2xl font-bold text-gray-800">{averageIntensity.toFixed(1)}/5</div>
            <div className="text-sm text-gray-600">Average intensity</div>
          </Card>

          <Card className="p-6 bg-white/70 backdrop-blur-sm border-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <Smile className="w-8 h-8 text-yellow-600" />
              <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {totalEntries > 0 ? Math.round((moodStats.happy / totalEntries) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Happy days</div>
          </Card>
        </div>

        {/* Mood Distribution */}
        <Card className="p-8 mb-8 bg-white/70 backdrop-blur-sm border-green-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Mood Palette</h2>

          <div className="space-y-4">
            {Object.entries(moodStats).map(([mood, count]) => (
              <div key={mood} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 w-24">
                  {getMoodIcon(mood)}
                  <span className="text-sm font-medium capitalize">{mood}</span>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      mood === "happy"
                        ? "bg-yellow-500"
                        : mood === "sad"
                          ? "bg-blue-500"
                          : mood === "anxious"
                            ? "bg-purple-500"
                            : mood === "angry"
                              ? "bg-red-500"
                              : "bg-gray-500"
                    }`}
                    style={{ width: totalEntries > 0 ? `${(count / totalEntries) * 100}%` : "0%" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Entries */}
        <Card className="p-8 bg-white/70 backdrop-blur-sm border-green-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Mood Entries</h2>

          {moodEntries.length > 0 ? (
            <div className="space-y-4">
              {moodEntries
                .slice()
                .reverse()
                .map((entry) => (
                  <div key={entry.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      {getMoodIcon(entry.mood, "w-8 h-8")}
                      <div>
                        <div className="font-medium text-gray-800">
                          {entry.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </div>
                        <div className="flex space-x-1">{getIntensityDots(entry.intensity)}</div>
                      </div>
                    </div>

                    <div className="flex-1">
                      {entry.notes && <p className="text-gray-700 mb-2">{entry.notes}</p>}
                      {entry.triggers && (
                        <div className="flex flex-wrap gap-1">
                          {entry.triggers.map((trigger, index) => (
                            <Badge key={index} className="bg-gray-200 text-gray-700 text-xs">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No mood entries yet. Start tracking your emotions!</p>
            </div>
          )}
        </Card>

        {/* Insights & Tips */}
        <Card className="mt-8 p-8 bg-gradient-to-r from-green-100 to-blue-100 border-green-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Personal Insights</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/50 p-6 rounded-2xl">
              <h3 className="font-semibold text-gray-800 mb-3">💡 Pattern Alert</h3>
              <p className="text-gray-700">
                You tend to feel more anxious on weekdays. Consider adding a 5-minute morning meditation to your
                routine.
              </p>
            </div>

            <div className="bg-white/50 p-6 rounded-2xl">
              <h3 className="font-semibold text-gray-800 mb-3">🌟 Celebration Time</h3>
              <p className="text-gray-700">
                Your happiness levels have increased 40% this month! Your venting sessions are really helping.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
