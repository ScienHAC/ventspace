import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Hackathon demo stats
    const stats = {
      totalUsers: 1247,
      totalVents: 8934,
      treesPlanted: 893,
      co2Absorbed: 2.1, // tons
      oxygenProduced: 1.6, // tons
      countriesImpacted: 12,
      moodImprovementRate: 73, // percentage
      lastUpdated: new Date().toISOString(),
      topMoods: {
        anxious: 34,
        sad: 28,
        happy: 22,
        neutral: 16,
      },
      environmentalImpact: {
        estimatedCarbonOffset: "2.1 tons CO2",
        biodiversitySupport: "47 wildlife habitats",
        reforestationAreas: [
          "Amazon Basin",
          "Pacific Northwest",
          "Southeast Asia",
        ],
      },
    }

    console.log("📊 HACKATHON DEMO - Stats accessed:", {
      timestamp: new Date().toISOString(),
      treesPlanted: stats.treesPlanted,
      totalUsers: stats.totalUsers,
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "Stats unavailable" }, { status: 500 })
  }
}
