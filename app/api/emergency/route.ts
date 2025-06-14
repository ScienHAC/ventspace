import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { type, timestamp, location } = await request.json()

    // Simulate emergency response system
    const emergencyResponse = {
      id: Date.now().toString(),
      type,
      timestamp: timestamp || new Date().toISOString(),
      status: "activated",
      resources: [
        {
          name: "Crisis Text Line",
          contact: "Text HOME to 741741",
          available: "24/7",
        },
        {
          name: "National Suicide Prevention Lifeline",
          contact: "988",
          available: "24/7",
        },
        {
          name: "SAMHSA National Helpline",
          contact: "1-800-662-4357",
          available: "24/7",
        },
      ],
      immediateActions: [
        "Take deep breaths",
        "Find a safe space",
        "Reach out to a trusted person",
        "Contact emergency services if in immediate danger",
      ],
    }

    // Log emergency event (in real app, this would go to monitoring system)
    console.log("EMERGENCY ALERT:", {
      type,
      timestamp,
      location: location || "unknown",
    })

    return NextResponse.json({
      success: true,
      emergency: emergencyResponse,
      message: "Emergency support activated",
    })
  } catch (error) {
    console.error("Emergency API error:", error)
    return NextResponse.json({ error: "Failed to activate emergency support" }, { status: 500 })
  }
}
