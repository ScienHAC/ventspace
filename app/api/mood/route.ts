import { NextRequest, NextResponse } from 'next/server';
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "gpt-4o";

// Safe mood detection function with proper error handling
function detectMood(text: string | undefined | null): { mood: string; confidence: number; needsHelp: boolean } {
  // Handle undefined/null/empty text
  if (!text || typeof text !== 'string' || !text.trim()) {
    return { mood: 'neutral', confidence: 0.3, needsHelp: false };
  }

  const lowerText = text.toLowerCase();
  
  // Crisis keywords - for emergency detection
  const crisisWords = ['suicide', 'kill myself', 'end it all', 'can\'t go on', 'want to die', 'self harm', 'hurt myself', 'no point living', 'better off dead'];
  const needsHelp = crisisWords.some(word => lowerText.includes(word));
  
  // Enhanced mood detection
  const sadWords = ['sad', 'depressed', 'down', 'hopeless', 'worthless', 'empty', 'lonely', 'hurt', 'pain', 'crying', 'tears', 'disappointed', 'upset', 'rejected', 'failed', 'failure'];
  const anxiousWords = ['anxious', 'worried', 'scared', 'panic', 'stress', 'overwhelmed', 'nervous', 'fear', 'anxiety', 'tension', 'restless', 'uneasy'];
  const angryWords = ['angry', 'mad', 'furious', 'hate', 'annoyed', 'frustrated', 'rage', 'pissed', 'irritated'];
  const happyWords = ['happy', 'good', 'great', 'excited', 'joy', 'love', 'amazing', 'wonderful', 'awesome', 'fantastic', 'glad', 'pleased'];
  
  let mood = 'neutral';
  let confidence = 0.5;
  
  const sadCount = sadWords.filter(word => lowerText.includes(word)).length;
  const anxiousCount = anxiousWords.filter(word => lowerText.includes(word)).length;
  const angryCount = angryWords.filter(word => lowerText.includes(word)).length;
  const happyCount = happyWords.filter(word => lowerText.includes(word)).length;
  
  const maxCount = Math.max(sadCount, anxiousCount, angryCount, happyCount);
  
  if (maxCount > 0) {
    confidence = Math.min(0.95, 0.6 + (maxCount * 0.2));
    if (sadCount === maxCount) mood = 'sad';
    else if (anxiousCount === maxCount) mood = 'anxious';
    else if (angryCount === maxCount) mood = 'angry';
    else if (happyCount === maxCount) mood = 'happy';
  }
  
  return { mood, confidence, needsHelp };
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
    }

    // Detect mood and crisis situation
    const moodAnalysis = detectMood(message);
    
    const client = ModelClient(endpoint, new AzureKeyCredential(token));
    
    // Create system prompt for mental health support
    const systemPrompt = `You are a compassionate AI mental health companion for VentSpace, a platform where young people can safely express their feelings. Your role is to:

1. Listen with empathy and validate their emotions
2. Provide gentle, supportive responses
3. Never diagnose or replace professional help
4. Encourage healthy coping strategies
5. Be warm, understanding, and non-judgmental
6. Keep responses concise but meaningful
7. If someone seems in crisis, gently suggest professional help

Remember: Every time someone vents here, a real tree gets planted. This creates a positive connection between personal healing and environmental healing.

Current user mood detected: ${moodAnalysis.mood}
${moodAnalysis.needsHelp ? 'ALERT: User may need crisis support - be extra gentle and suggest professional help.' : ''}`;

    // Prepare conversation messages
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    const response = await client.path("/chat/completions").post({
      body: {
        messages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 150,
        model: model
      }
    });

    if (isUnexpected(response)) {
      throw new Error(response.body.error?.message || 'API request failed');
    }

    const aiResponse = response.body.choices[0].message.content;

    // Simulate NGO webhook for tree planting
    if (Math.random() > 0.3) { // 70% chance to log tree progress
      console.log('🌱 NGO Webhook: Tree planting progress logged', {
        timestamp: new Date().toISOString(),
        userMood: moodAnalysis.mood,
        treeContribution: 0.1,
        location: 'Virtual Forest'
      });
    }

    return NextResponse.json({
      response: aiResponse,
      mood: moodAnalysis.mood,
      confidence: moodAnalysis.confidence,
      needsHelp: moodAnalysis.needsHelp,
      treeContributed: true
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return mock mood data for now
    const mockMoodData = [
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
        mood: "happy", 
        intensity: 4,
        notes: "Found alternative college options!",
        triggers: ["hope", "new_opportunities"],
      }
    ];
    
    return NextResponse.json({
      success: true,
      data: mockMoodData
    });
  } catch (error) {
    console.error('Mood GET API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mood data' },
      { status: 500 }
    );
  }
}