import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate fetching platform statistics
    const stats = {
      totalTrees: 2847 + Math.floor(Math.random() * 100),
      totalVents: 12543 + Math.floor(Math.random() * 500),
      activeUsers: 1234 + Math.floor(Math.random() * 50),
      co2Offset: 45.6 + Math.random() * 10,
      countriesServed: 23,
      averageSessionTime: "12.5 minutes",
      moodImprovementRate: 78.5,
      emergencyResponseTime: "< 2 minutes",
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
