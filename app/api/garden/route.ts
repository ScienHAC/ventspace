import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate fetching garden data
    const gardenData = {
      trees: [
        {
          id: "1",
          type: "mature",
          plantedDate: "2024-05-15T00:00:00.000Z",
          ventCount: 10,
          location: "Amazon Rainforest, Brazil",
        },
        {
          id: "2",
          type: "young",
          plantedDate: "2024-05-25T00:00:00.000Z",
          ventCount: 10,
          location: "Pacific Northwest, USA",
        },
        {
          id: "3",
          type: "sapling",
          plantedDate: "2024-06-05T00:00:00.000Z",
          ventCount: 7,
          location: "Growing...",
        },
      ],
      impact: {
        co2Absorbed: 156.7,
        oxygenProduced: 234.5,
        biodiversitySupported: 47,
      },
      achievements: [
        {
          id: "forest_guardian",
          name: "Forest Guardian",
          description: "Planted your first tree",
          unlocked: true,
          unlockedAt: "2024-05-15T00:00:00.000Z",
        },
        {
          id: "eco_warrior",
          name: "Eco Warrior",
          description: "3 trees and counting",
          unlocked: true,
          unlockedAt: "2024-06-05T00:00:00.000Z",
        },
        {
          id: "climate_champion",
          name: "Climate Champion",
          description: "Plant 10 trees",
          unlocked: false,
          progress: 3,
          target: 10,
        },
      ],
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(gardenData)
  } catch (error) {
    console.error("Garden API error:", error)
    return NextResponse.json({ error: "Failed to fetch garden data" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { action, treeData } = await request.json()

    if (action === "plant_tree") {
      // Simulate planting a new tree
      const newTree = {
        id: Date.now().toString(),
        type: "sapling",
        plantedDate: new Date().toISOString(),
        ventCount: treeData.ventCount || 10,
        location: "Growing...",
      }

      return NextResponse.json({
        success: true,
        tree: newTree,
        message: "Tree planted successfully!",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Garden POST API error:", error)
    return NextResponse.json({ error: "Failed to process garden action" }, { status: 500 })
  }
}