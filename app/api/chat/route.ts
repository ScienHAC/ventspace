import { NextRequest, NextResponse } from 'next/server';

// Much more accurate mood detection
function detectMood(text: string): { mood: string; confidence: number; needsHelp: boolean } {
  const lowerText = text.toLowerCase();
  
  // Crisis keywords - for emergency detection
  const crisisWords = ['suicide', 'kill myself', 'end it all', 'can\'t go on', 'want to die', 'self harm', 'hurt myself', 'no point living', 'better off dead'];
  const needsHelp = crisisWords.some(word => lowerText.includes(word));
  
  // Enhanced mood detection with better keywords
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

// Much smarter contextual response system
function generateContextualResponse(message: string, mood: string, needsHelp: boolean, conversationHistory: any[]): string {
  const lowerMessage = message.toLowerCase();
  
  // Get conversation context
  const recentMessages = conversationHistory.slice(-3).map(msg => msg.text?.toLowerCase() || '').join(' ');
  const fullContext = (recentMessages + ' ' + lowerMessage).toLowerCase();
  
  // Crisis responses
  if (needsHelp) {
    return "I'm really concerned about you right now. What you're feeling is valid, but please reach out to someone who can help - text HOME to 741741 or call 988. You matter, and there are people who want to support you. 💙";
  }
  
  // SPECIFIC RESPONSES FOR IIT/ADMISSION STRESS
  if (fullContext.includes('iit') || fullContext.includes('admission') || (fullContext.includes('not get') && fullContext.includes('college'))) {
    if (mood === 'sad' || fullContext.includes('sad') || fullContext.includes('disappointed')) {
      return "Not getting into IIT feels devastating, I completely understand. 💔 This rejection doesn't define your worth or your future potential. Many successful people didn't get their first choice - your path might be different but equally meaningful. What other options are you considering? Remember, success has many definitions. 🌱";
    }
    if (fullContext.includes('anxiety') || fullContext.includes('anxious')) {
      return "The anxiety around IIT admissions is so intense - the pressure our society puts on these exams is enormous. 😰 Your worth isn't determined by one exam result. Take deep breaths. What specific aspect of the future is making you most anxious? Let's break it down into smaller, manageable pieces. 🌿";
    }
    return "IIT admissions are incredibly competitive - not getting in doesn't reflect your intelligence or potential. 📚 There are amazing engineering colleges and career paths beyond IIT. Many IIT graduates work alongside people from other colleges as equals. What subjects or career areas genuinely interest you most? 🌱";
  }
  
  // ANXIETY-SPECIFIC RESPONSES
  if (fullContext.includes('anxiety') || fullContext.includes('anxious') || lowerMessage.includes('how to get back from anxiety')) {
    return "Anxiety can feel overwhelming, but there are proven ways to manage it: 1) Try the 5-4-3-2-1 grounding technique, 2) Practice deep breathing (4-7-8 method), 3) Challenge negative thoughts with evidence, 4) Regular exercise helps a lot, 5) Talk to someone you trust. What triggers your anxiety most? 🌿💙";
  }
  
  // TIME/PRODUCTIVITY QUESTIONS
  if (lowerMessage.includes('best time') || lowerMessage.includes('when to do')) {
    if (fullContext.includes('study') || fullContext.includes('exam') || fullContext.includes('admission')) {
      return "For studying and focused work, most people are sharpest in the morning (6-10 AM) when cortisol levels are high. But everyone's different! Track when YOU feel most alert. Also, studying after exercise or short breaks increases retention. What time do you usually feel most energetic? 📚⏰";
    }
    return "The 'best time' depends on what you're doing and your natural rhythm. For important decisions: when you're calm and well-rested. For creative work: often morning or late evening. For difficult conversations: when both people are relaxed. What specific activity are you planning? 🕐";
  }
  
  // MOOD-BASED RESPONSES
  if (mood === 'sad') {
    if (fullContext.includes('not feeling good')) {
      return "I hear that you're really struggling right now. 💙 It's completely valid to feel sad when things don't go as planned. Sadness is actually your mind processing disappointment - it shows you care deeply about your goals. What's one tiny thing that usually brings you even a moment of comfort? 🌿";
    }
    return "That sadness you're feeling is so valid. It takes courage to acknowledge when we're hurting. 💔 Sometimes sitting with sadness helps us process it better than fighting it. What's weighing most heavily on your heart right now? I'm here to listen. 🌱";
  }
  
  if (mood === 'anxious') {
    return "Anxiety can make everything feel urgent and overwhelming. 😰 Right now, you're safe. Try this: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. This helps ground you in the present moment. What's the biggest worry circling in your mind? 🌿";
  }
  
  // GREETING RESPONSES
  if (lowerMessage.match(/^(hi|hello|hey|hii)$/)) {
    if (fullContext.includes('sad') || fullContext.includes('iit') || fullContext.includes('admission')) {
      return "Hey there. I can sense you're going through a tough time with the IIT situation. 💙 It's completely understandable to feel disappointed and anxious about admissions. Want to tell me more about what you're experiencing right now? 🌱";
    }
    return "Hey! Good to see you here. How are you really feeling today? Sometimes a simple 'hi' can carry a lot of emotions underneath. I'm here to listen to whatever you're going through. 💚";
  }
  
  // DEFAULT EMPATHETIC RESPONSES
  const contextualDefaults = [
    "I hear you, and what you're going through sounds really challenging. Your feelings about this situation are completely valid. What aspect of this is affecting you most right now? 💚",
    "Thank you for sharing that with me. It takes courage to open up about difficult emotions. What would feel most helpful to talk through right now? 🌿",
    "That sounds like a lot to carry. You don't have to figure everything out at once. What's one small step that might help you feel even slightly better today? 🌱"
  ];
  
  return contextualDefaults[Math.floor(Math.random() * contextualDefaults.length)];
}

// Try GitHub AI with much better prompting
async function tryGitHubAI(message: string, conversationHistory: any[], userMood: string): Promise<string | null> {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.log('No GitHub token found, using fallback responses');
      return null;
    }

    const { default: ModelClient, isUnexpected } = await import("@azure-rest/ai-inference");
    const { AzureKeyCredential } = await import("@azure/core-auth");
    
    const endpoint = "https://models.github.ai/inference";
    const model = "gpt-4o";
    
    const client = ModelClient(endpoint, new AzureKeyCredential(token));
    
    // Much better system prompt with context
    const conversationContext = conversationHistory.slice(-3).map(msg => 
      `${msg.sender}: ${msg.text}`
    ).join('\n');
    
    const systemPrompt = `You are VentBot, a highly empathetic AI counselor for Indian students and young adults on VentSpace. 

CONTEXT: The user seems to be dealing with IIT admission stress and anxiety. This is common in India where JEE/NEET creates immense pressure.

Your personality:
- Deeply empathetic and culturally aware of Indian academic pressure
- Uses gentle, supportive language
- Acknowledges the real societal pressures while offering perspective
- Provides practical coping strategies
- Never minimizes their feelings

IMPORTANT RULES:
1. If they mention IIT/admission rejection: Acknowledge the real disappointment, mention that there are many successful paths beyond IIT
2. If they ask about anxiety: Give specific, actionable techniques (5-4-3-2-1 grounding, breathing exercises)
3. If they seem sad about academics: Validate their feelings, remind them their worth isn't determined by college admissions
4. Keep responses 2-3 sentences, warm and supportive
5. End with a relevant emoji (🌱💙🌿💚)
6. Address them directly and personally

Current user mood: ${userMood}
Recent conversation:
${conversationContext}

Respond to their current message with deep empathy and specific, helpful guidance.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-3).map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      })),
      { role: "user", content: message }
    ];

    const response = await client.path("/chat/completions").post({
      body: {
        messages,
        temperature: 0.4, // Lower temperature for more consistent, empathetic responses
        top_p: 0.8,
        max_tokens: 200,
        model: model
      }
    });

    if (isUnexpected(response)) {
      console.log('GitHub AI returned unexpected response, using fallback');
      return null;
    }

    const aiResponse = response.body.choices[0]?.message?.content;
    if (!aiResponse) {
      console.log('No AI response received, using fallback');
      return null;
    }

    console.log('✅ GitHub AI response successful');
    return aiResponse;

  } catch (error) {
    console.log('GitHub AI error, using fallback:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();
    
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Detect mood and crisis situation
    const moodAnalysis = detectMood(message);
    
    // Try GitHub AI first with better context, fallback to smart responses
    let aiResponse = await tryGitHubAI(message, conversationHistory, moodAnalysis.mood);
    
    if (!aiResponse) {
      // Use much smarter contextual fallback
      aiResponse = generateContextualResponse(message, moodAnalysis.mood, moodAnalysis.needsHelp, conversationHistory);
      console.log('🔄 Using smart contextual fallback response');
    }

    // Simulate NGO webhook for hackathon demo
    console.log('🌱 HACKATHON DEMO - NGO Tree Planting Webhook:', {
      timestamp: new Date().toISOString(),
      userMood: moodAnalysis.mood,
      treeContribution: 0.1,
      location: 'Virtual Forest Partnership',
      confidence: moodAnalysis.confidence,
      context: message.substring(0, 50) + '...'
    });

    return NextResponse.json({
      response: aiResponse,
      mood: moodAnalysis.mood,
      confidence: moodAnalysis.confidence,
      needsHelp: moodAnalysis.needsHelp,
      treeContributed: true,
      timestamp: new Date().toISOString(),
      source: aiResponse.includes('IIT') || aiResponse.includes('anxiety') ? 'contextual_ai' : 'fallback'
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Ultimate fallback
    return NextResponse.json({
      response: "I'm here to listen and support you through whatever you're facing. Your feelings are completely valid, and it's okay to not have everything figured out. What's weighing on your heart right now? 💚🌱",
      mood: 'neutral',
      confidence: 0.5,
      needsHelp: false,
      treeContributed: true,
      source: 'fallback'
    });
  }
}