import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate fetching mood data
    const moodData = {
      entries: [
        {
          id: "1",
          date: "2024-06-10T00:00:00.000Z",
          mood: "anxious",
          intensity: 4,
          notes: "Exam stress hitting hard",
          triggers: ["academic", "future"],
        },
        {
          id: "2",
          date: "2024-06-11T00:00:00.000Z",
          mood: "sad",
          intensity: 3,
          notes: "Friend drama",
          triggers: ["social", "relationships"],
        },
        {
          id: "3",
          date: "2024-06-12T00:00:00.000Z",
          mood: "happy",
          intensity: 4,
          notes: "Aced my presentation!",
          triggers: ["achievement", "confidence"],
        },
        {
          id: "4",
          date: "2024-06-13T00:00:00.000Z",
          mood: "neutral",
          intensity: 3,
          notes: "Just vibing",
          triggers: ["routine"],
        },
        {
          id: "5",
          date: "2024-06-14T00:00:00.000Z",
          mood: "happy",
          intensity: 5,
          notes: "Best day ever! Got accepted to internship",
          triggers: ["achievement", "future"],
        },
      ],
      weeklyTrend: "improving",
      insights: [
        {
          type: "pattern",
          title: "Pattern Alert",
          description:
            "You tend to feel more anxious on weekdays. Consider adding a 5-minute morning meditation to your routine.",
        },
        {
          type: "celebration",
          title: "Celebration Time",
          description: "Your happiness levels have increased 40% this month! Your venting sessions are really helping.",
        },
      ],
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json(moodData)
  } catch (error) {
    console.error("Mood GET API error:", error)
    return NextResponse.json({ error: "Failed to fetch mood data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { mood, intensity, notes, triggers, timestamp } = await request.json()

    // Simulate saving mood entry
    const newEntry = {
      id: Date.now().toString(),
      date: timestamp || new Date().toISOString(),
      mood,
      intensity: intensity || 3,
      notes: notes || "",
      triggers: triggers || [],
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    return NextResponse.json({
      success: true,
      entry: newEntry,
      message: "Mood logged successfully!",
    })
  } catch (error) {
    console.error("Mood POST API error:", error)
    return NextResponse.json({ error: "Failed to log mood" }, { status: 500 })
  }
}
