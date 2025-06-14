import { NextRequest, NextResponse } from 'next/server'
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference"
import { AzureKeyCredential } from "@azure/core-auth"

// GitHub AI configuration - exactly like your documentation
const token = process.env.GITHUB_TOKEN
const endpoint = "https://models.github.ai/inference"
const model = "openai/gpt-4.1"

interface ChatRequest {
  message: string
  mood?: string
  ventCount?: number
  conversationHistory?: any[]
}

// VentBot system prompt
const SYSTEM_PROMPT = `You are VentBot, a Gen Z buddy who gives short, friendly support.

RULES:
- Keep replies VERY short (1-2 sentences max)
- Talk like texting a close friend
- Be super encouraging and positive
- Use emojis but not too many
- Address their specific problem directly
- End with a short question or supportive statement

EXAMPLES:
User: "I can't get a job"
You: "Job hunting sucks but you're not giving up, right? What kind of work are you looking for? 💪"

User: "I'm sad"
You: "Sorry you're feeling down. Want to talk about what's bothering you? 💙"

User: "I'm happy"
You: "Love that energy! What's making you smile today? 😊"

Keep it short, real, and caring like a best friend would text back.`

// Mood and Issue Detection
function analyzeMessage(text: string | undefined | null): { 
  mood: string; 
  confidence: number; 
  needsHelp: boolean; 
  category: string;
  specificIssues: string[];
  severity: number;
} {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return { mood: 'neutral', confidence: 0.3, needsHelp: false, category: 'general', specificIssues: [], severity: 1 }
  }

  const lowerText = text.toLowerCase()
  const crisisWords = ['suicide', 'kill myself', 'end it all', 'can\'t go on', 'want to die', 'self harm', 'hurt myself', 'no point living', 'better off dead']
  const needsHelp = crisisWords.some(word => lowerText.includes(word))
  const specificIssues = []

  // Issue detection
  if (lowerText.includes('job') || lowerText.includes('work') || lowerText.includes('career')) specificIssues.push('job')
  if (lowerText.includes('motivat') || lowerText.includes('encourage')) specificIssues.push('motivation')
  if (lowerText.includes('workout') || lowerText.includes('exercise') || lowerText.includes('gym')) specificIssues.push('workout')
  if (lowerText.includes('sad') || lowerText.includes('depress') || lowerText.includes('down')) specificIssues.push('sadness')
  if (lowerText.includes('anxi') || lowerText.includes('stress') || lowerText.includes('worry')) specificIssues.push('anxiety')
  if (lowerText.includes('lonely') || lowerText.includes('alone')) specificIssues.push('loneliness')

  // Mood detection
  const sadWords = ['sad', 'depressed', 'down', 'hopeless', 'hurt', 'pain', 'upset']
  const anxiousWords = ['anxious', 'worried', 'scared', 'stress', 'overwhelmed', 'nervous']
  const angryWords = ['angry', 'mad', 'furious', 'hate', 'annoyed', 'frustrated']
  const happyWords = ['happy', 'good', 'great', 'excited', 'joy', 'love', 'awesome']

  let mood = 'neutral'
  let confidence = 0.5

  const sadCount = sadWords.filter(word => lowerText.includes(word)).length
  const anxiousCount = anxiousWords.filter(word => lowerText.includes(word)).length
  const angryCount = angryWords.filter(word => lowerText.includes(word)).length
  const happyCount = happyWords.filter(word => lowerText.includes(word)).length

  const maxCount = Math.max(sadCount, anxiousCount, angryCount, happyCount)
  
  if (maxCount > 0) {
    confidence = Math.min(0.95, 0.6 + (maxCount * 0.2))
    if (sadCount === maxCount) mood = 'sad'
    else if (anxiousCount === maxCount) mood = 'anxious'
    else if (angryCount === maxCount) mood = 'angry'
    else if (happyCount === maxCount) mood = 'happy'
  }

  return { mood, confidence, needsHelp, category: 'general', specificIssues, severity: needsHelp ? 5 : specificIssues.length }
}

// Local fallback responses
function generateLocalResponse(message: string, mood: string): string {
  const lowerMessage = message.toLowerCase()

  // Job/Career
  if (lowerMessage.includes('job') || lowerMessage.includes('work')) {
    return "Job hunting is tough but you're tougher! What kind of work are you looking for? 💪"
  }

  // Motivation
  if (lowerMessage.includes('motivat')) {
    return "You're already winning by showing up! What's one small goal for today? ✨"
  }

  // Mood-based responses
  if (mood === 'sad') {
    return "Sorry you're feeling down. Want to talk about what's bothering you? 💙"
  }
  if (mood === 'anxious') {
    return "Anxiety is tough. Take a deep breath with me? What's worrying you most? 🌿"
  }
  if (mood === 'happy') {
    return "Love that energy! What's making you smile today? 🌟"
  }

  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|hii)$/)) {
    return "Hey! What's up? Anything on your mind today? 😊"
  }

  return "I'm here for whatever you want to talk about! What's on your mind? 💚"
}

export async function POST(request: NextRequest) {
  try {
    const { message, mood, ventCount, conversationHistory = [] }: ChatRequest = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    console.log('🤖 User said:', message)

    // Analyze the message
    const analysis = analyzeMessage(message)
    let aiResponse: string

    // Try GitHub AI first
    if (token) {
      try {
        console.log('📨 Calling GitHub AI with gpt-4.1...')

        // Initialize client exactly like your documentation
        const client = ModelClient(
          endpoint,
          new AzureKeyCredential(token),
        )

        // Build messages with conversation history
        const messages = [
          { role: "system", content: SYSTEM_PROMPT },
          // Add last 4 conversation messages for context
          ...conversationHistory.slice(-4).map((msg: any) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text || msg.message
          })),
          { role: "user", content: message }
        ]

        // API call exactly like your documentation
        const response = await client.path("/chat/completions").post({
          body: {
            messages,
            temperature: 0.3, // Lower for consistent responses
            top_p: 1,
            model: model
          }
        })

        console.log('🔄 API Response status:', response.status)

        // Error handling exactly like your documentation
        if (isUnexpected(response)) {
          console.error('❌ GitHub AI error:', response.body)
          throw response.body.error
        }

        // Get response exactly like your documentation
        aiResponse = response.body.choices[0].message.content || generateLocalResponse(message, analysis.mood)
        console.log('✅ GitHub AI success:', aiResponse)

      } catch (error) {
        console.error('GitHub AI failed, using local fallback:', error)
        aiResponse = generateLocalResponse(message, analysis.mood)
      }
    } else {
      console.log('No GitHub token, using local response')
      aiResponse = generateLocalResponse(message, analysis.mood)
    }

    // Simulate API delay like your base code
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500))

    return NextResponse.json({
      response: aiResponse,
      mood: analysis.mood,
      confidence: analysis.confidence,
      needsHelp: analysis.needsHelp,
      category: analysis.category,
      specificIssues: analysis.specificIssues,
      severity: analysis.severity,
      treeContributed: true,
      timestamp: new Date().toISOString(),
      ventCount: ventCount || 0,
      source: token ? 'github_ai' : 'local_fallback'
    })

  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({
      response: "I'm having a tech hiccup, but I'm still here for you. Want to tell me more? 💚",
      mood: 'neutral',
      confidence: 0.8,
      needsHelp: false,
      treeContributed: true,
      source: 'emergency_fallback'
    }, { status: 500 })
  }
}