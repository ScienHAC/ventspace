import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { type, userMood, location } = await request.json()

    // Enhanced emergency response for hackathon
    const emergencyResponse = {
      id: `emergency_${Date.now()}`,
      type: type || "mental_health_crisis",
      timestamp: new Date().toISOString(),
      status: "ACTIVATED",
      userMood,
      location,
      resources: [
        {
          name: "Crisis Text Line",
          contact: "Text HOME to 741741",
          available: "24/7",
          type: "text",
        },
        {
          name: "National Suicide Prevention Lifeline",
          contact: "988",
          available: "24/7",
          type: "call",
        },
        {
          name: "SAMHSA National Helpline",
          contact: "1-800-662-4357",
          available: "24/7",
          type: "call",
        },
        {
          name: "Crisis Chat (Online)",
          contact: "https://suicidepreventionlifeline.org/chat/",
          available: "24/7",
          type: "chat",
        },
      ],
      immediateActions: [
        "Take 3 deep breaths - in for 4, hold for 4, out for 4",
        "Find a safe, comfortable space",
        "Reach out to a trusted friend or family member",
        "Call emergency services (911) if in immediate physical danger",
        "Remember: This feeling will pass, you matter, and help is available",
      ],
      followUpSupport: [
        "Continue using VentSpace to track your mood",
        "Consider professional counseling",
        "Build a support network",
        "Practice daily self-care routines",
      ],
    }

    // Log for hackathon demo
    console.log("🚨 HACKATHON DEMO - Emergency Support Activated:", {
      timestamp: emergencyResponse.timestamp,
      userMood,
      resourcesProvided: emergencyResponse.resources.length,
    })

    return NextResponse.json({
      success: true,
      emergency: emergencyResponse,
      message: "Emergency support resources activated. Help is available 24/7.",
    })
  } catch (error) {
    console.error("Emergency API error:", error)
    return NextResponse.json(
      {
        error: "Emergency system temporarily unavailable",
        fallback: {
          crisis_line: "988",
          text_line: "Text HOME to 741741",
          message: "Please contact these numbers immediately if you need help.",
        },
      },
      { status: 200 } // Still return 200 for emergency fallback
    )
  }
}
