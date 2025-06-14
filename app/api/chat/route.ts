import { type NextRequest, NextResponse } from "next/server"

interface ChatRequest {
  message: string
  mood: string
  ventCount: number
}

export async function POST(request: NextRequest) {
  try {
    const { message, mood, ventCount }: ChatRequest = await request.json()

    // Simulate AI response generation based on mood
    const generateAIResponse = (userMessage: string, mood: string): string => {
      const responses = {
        happy: [
          "That's amazing! 🌟 Your positive energy is contagious. What's bringing you joy today?",
          "Love to hear this! ✨ Happiness looks good on you. Tell me more about what's going well!",
          "Your vibe is immaculate right now! 💫 What's your secret to feeling this good?",
        ],
        sad: [
          "I hear you, and that sounds really tough. 💙 Your feelings are totally valid. Want to talk about what's making you feel this way?",
          "That's rough, buddy. 😔 Sometimes life just hits different. I'm here to listen - no judgment, just support.",
          "Sending you virtual hugs. 🫂 It's okay to not be okay. What would help you feel even a little bit better right now?",
        ],
        anxious: [
          "Anxiety is the worst, but you're not alone in this. 🌸 Let's try a quick breathing exercise - in for 4, hold for 4, out for 4. You've got this!",
          "I can feel that nervous energy through the screen. 💨 What's your brain spiraling about? Sometimes talking it out helps untangle the mess.",
          "Anxiety brain is so annoying! 🌀 Remember: you've survived 100% of your worst days so far. What's one small thing that might help right now?",
        ],
        angry: [
          "That sounds incredibly frustrating! 🔥 Your anger is valid - want to rage-type about it? Sometimes getting it all out helps.",
          "Ugh, that would make me mad too! 😤 What happened? I'm here for the full rant if you need it.",
          "Big mad energy detected! 💢 Channel that fire - what's got you heated? Let's work through this together.",
        ],
        neutral: [
          "I'm listening! 👂 What's on your mind today? Even the ordinary stuff matters.",
          "Thanks for sharing with me. 🤗 How are you really feeling underneath it all?",
          "I'm here for whatever you need to get off your chest. 💬 What's your vibe today?",
        ],
      }

      const moodResponses = responses[mood as keyof typeof responses] || responses.neutral
      return moodResponses[Math.floor(Math.random() * moodResponses.length)]
    }

    const response = generateAIResponse(message, mood)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    return NextResponse.json({
      response,
      mood: "neutral",
      timestamp: new Date().toISOString(),
      ventCount,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
