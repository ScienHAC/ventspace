import { NextRequest, NextResponse } from 'next/server'

// --- NEW: Refined System Prompt for GPT Model ---
const SYSTEM_PROMPT = `
You are VentBot, a Gen Z-friendly AI companion.
You act like a supportive friend and positive life coach, not a therapist.
Always reply in a short, casual, and real way—like a caring buddy texting back.
Directly address the user's specific feelings or problem (job, sadness, stress, motivation, workouts, etc).
If they're struggling, give honest encouragement, practical hope, and suggest simple positive actions (like a walk, a workout, or reaching out to a friend).
If they're happy, celebrate with them.
Never be generic or overly formal. Never ignore their main issue.
Use simple language, emojis, and line breaks for warmth and relatability.
Never give medical or legal advice.
Always end with a supportive question or a positive, motivating nudge.
Keep temperature low for focused, true, and helpful replies.
Keep every reply under 3 sentences.
`

// --- Mood and Issue Detection (unchanged) ---
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

  // Academic
  if (lowerText.includes('jee') || lowerText.includes('iit') || lowerText.includes('neet')) specificIssues.push('competitive_exams')
  if (lowerText.includes('exam') || lowerText.includes('test') || lowerText.includes('study')) specificIssues.push('academic_stress')
  if (lowerText.includes('college') || lowerText.includes('university') || lowerText.includes('admission')) specificIssues.push('college_issues')
  if (lowerText.includes('grade') || lowerText.includes('marks') || lowerText.includes('score')) specificIssues.push('academic_performance')
  // Social
  if (lowerText.includes('racism') || lowerText.includes('racist') || lowerText.includes('discriminat')) specificIssues.push('racism')
  if (lowerText.includes('bully') || lowerText.includes('harassment') || lowerText.includes('teasing')) specificIssues.push('bullying')
  if (lowerText.includes('lonely') || lowerText.includes('alone') || lowerText.includes('isolated')) specificIssues.push('loneliness')
  if (lowerText.includes('friend') && (lowerText.includes('no') || lowerText.includes('lost') || lowerText.includes('fight'))) specificIssues.push('friendship_issues')
  // Career/Job
  if (lowerText.includes('job loss') || lowerText.includes('fired') || lowerText.includes('unemployed')) specificIssues.push('job_loss')
  if (lowerText.includes('interview') || lowerText.includes('job search') || lowerText.includes('career')) specificIssues.push('career_concerns')
  if (lowerText.includes('internship') || lowerText.includes('placement')) specificIssues.push('internship_placement')
  if (lowerText.includes('job') && !specificIssues.includes('job_loss') && !specificIssues.includes('career_concerns')) specificIssues.push('job')
  // Motivation/Workouts
  if (lowerText.includes('motivate') || lowerText.includes('motivation') || lowerText.includes('inspire')) specificIssues.push('motivation')
  if (lowerText.includes('workout') || lowerText.includes('exercise') || lowerText.includes('gym') || lowerText.includes('run') || lowerText.includes('walk')) specificIssues.push('workout')
  // Family
  if (lowerText.includes('parents') && (lowerText.includes('fight') || lowerText.includes('don\'t understand') || lowerText.includes('pressure'))) specificIssues.push('parent_conflict')
  if (lowerText.includes('family') && (lowerText.includes('problem') || lowerText.includes('issue') || lowerText.includes('tension'))) specificIssues.push('family_problems')
  // Health
  if (lowerText.includes('depression') || lowerText.includes('depressed')) specificIssues.push('depression')
  if (lowerText.includes('anxiety') || lowerText.includes('anxious') || lowerText.includes('panic')) specificIssues.push('anxiety')
  if (lowerText.includes('sleep') && (lowerText.includes('can\'t') || lowerText.includes('insomnia') || lowerText.includes('trouble'))) specificIssues.push('sleep_issues')
  // Relationship
  if (lowerText.includes('breakup') || lowerText.includes('broke up') || lowerText.includes('relationship ended')) specificIssues.push('breakup')
  if (lowerText.includes('heartbreak') || lowerText.includes('love') && lowerText.includes('hurt')) specificIssues.push('heartbreak')
  // Financial
  if (lowerText.includes('money') && (lowerText.includes('no') || lowerText.includes('need') || lowerText.includes('problem'))) specificIssues.push('financial_stress')
  // Self-esteem
  if (lowerText.includes('worthless') || lowerText.includes('useless') || lowerText.includes('failure')) specificIssues.push('low_self_esteem')
  if (lowerText.includes('ugly') || lowerText.includes('fat') || lowerText.includes('body')) specificIssues.push('body_image')

  // General emotions
  const sadWords = ['sad', 'depressed', 'down', 'hopeless', 'worthless', 'empty', 'hurt', 'pain', 'crying', 'tears', 'disappointed', 'upset', 'rejected', 'failed', 'disheartened']
  const anxiousWords = ['anxious', 'worried', 'scared', 'panic', 'stress', 'overwhelmed', 'nervous', 'fear', 'tension', 'restless', 'uneasy']
  const angryWords = ['angry', 'mad', 'furious', 'hate', 'annoyed', 'frustrated', 'rage', 'pissed', 'irritated']
  const happyWords = ['happy', 'good', 'great', 'excited', 'joy', 'love', 'amazing', 'wonderful', 'awesome', 'fantastic', 'glad', 'pleased']

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

  let category = 'general'
  if (specificIssues.some(issue => ['competitive_exams', 'academic_stress', 'college_issues', 'academic_performance'].includes(issue))) category = 'academic'
  if (specificIssues.some(issue => ['racism', 'bullying', 'loneliness', 'friendship_issues'].includes(issue))) category = 'social'
  if (specificIssues.some(issue => ['job_loss', 'career_concerns', 'internship_placement', 'job', 'motivation', 'workout'].includes(issue))) category = 'career'
  if (specificIssues.some(issue => ['parent_conflict', 'family_problems'].includes(issue))) category = 'family'
  if (specificIssues.some(issue => ['depression', 'anxiety', 'sleep_issues'].includes(issue))) category = 'mental_health'
  if (specificIssues.some(issue => ['breakup', 'heartbreak'].includes(issue))) category = 'relationships'

  let severity = 1
  if (needsHelp) severity = 5
  else if (specificIssues.length > 2) severity = 4
  else if (specificIssues.length > 1) severity = 3
  else if (specificIssues.length > 0) severity = 2

  return { mood, confidence, needsHelp, category, specificIssues, severity }
}

// --- NEW: Short, Direct, Friendly Replies ---
function generateSpecificResponse(message: string, analysis: any, conversationHistory: any[]): string {
  const { mood, needsHelp, specificIssues } = analysis
  const lowerMessage = message.toLowerCase()

  // CRISIS INTERVENTION
  if (needsHelp) {
    return "I'm really worried about you 💔 Please reach out to someone you trust or text HOME to 741741. You're not alone, and you matter. Can you promise me you'll reach out? 🫂"
  }

  // JOB/CAREER
  if (specificIssues.includes('job_loss') || specificIssues.includes('job') || lowerMessage.includes('job')) {
    if (lowerMessage.includes('motivat')) {
      return "Job hunting is rough, but it doesn't mean you're not awesome. 💪 Every setback is just a setup for a comeback. What's one thing you can try this week? 🚀"
    }
    return "Not getting a job feels so discouraging, but it doesn't define your worth. Keep showing up—your shot is coming. Want to talk about your next step? 🌱"
  }

  // MOTIVATION/WORKOUT
  if (specificIssues.includes('motivation') || specificIssues.includes('workout')) {
    return "Motivation comes and goes, but small actions add up. Even a short walk or a few stretches can boost your mood. Want to try something simple today? 🏃‍♂️"
  }

  // RACISM
  if (specificIssues.includes('racism')) {
    return "Facing racism is so unfair and painful. You deserve respect, always. Want to share what happened, or just how you're feeling? I'm here for you. 🫂"
  }

  // LONELINESS
  if (specificIssues.includes('loneliness')) {
    return "Feeling alone sucks, but you're not invisible to me. Even reaching out here is a big step. Want to talk about what makes you feel most alone? 💙"
  }

  // DEPRESSION/ANXIETY
  if (specificIssues.includes('depression')) {
    return "Depression makes everything feel heavy, but you're stronger than you think. Even small wins count. What's one thing that helped you before? 🌱"
  }
  if (specificIssues.includes('anxiety')) {
    return "Anxiety can be overwhelming, but you're safe right now. Try a deep breath with me? What's worrying you most today? 🌿"
  }

  // BREAKUP/HEARTBREAK
  if (specificIssues.includes('breakup') || specificIssues.includes('heartbreak')) {
    return "Breakups hurt, no sugarcoating it. But your heart will heal, even if it feels impossible now. Want to vent about it? 💔"
  }

  // FAMILY
  if (specificIssues.includes('parent_conflict') || specificIssues.includes('family_problems')) {
    return "Family drama is exhausting, I get it. You're allowed to feel how you feel. Want to share what's been hardest lately? 🫂"
  }

  // GREETING
  if (lowerMessage.match(/^(hi|hello|hey|hii|sup|whatsup)$/)) {
    return "Hey! 😊 What's up? Anything on your mind today?"
  }

  // HAPPY
  if (mood === 'happy') {
    return "Love that energy! What's making you smile today? 🌟"
  }

  // SAD
  if (mood === 'sad') {
    return "Sorry you're feeling down. Want to talk about what's weighing on you? 💙"
  }

  // ANGRY
  if (mood === 'angry') {
    return "Anger is real—sometimes it's just too much. Want to let it out here? 🔥"
  }

  // GENERAL SUPPORT
  return "Thanks for sharing with me. Whatever it is, I'm here for you. Want to talk more about it? 🌱"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message = body.message || body.text || ''
    const conversationHistory = body.conversationHistory || []

    if (!message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // --- GPT-4 API CALL (pseudo, replace with your actual call) ---
    // const gptResponse = await callGptApi({
    //   system: SYSTEM_PROMPT,
    //   user: message,
    //   temperature: 0.4,
    //   top_p: 1,
    //   model: 'gpt-4.1'
    // })
    // const aiResponse = gptResponse.content

    // --- Local Response for Demo ---
    const analysis = analyzeMessage(message)
    const aiResponse = generateSpecificResponse(message, analysis, conversationHistory)

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
      source: 'ventbot_friendly_short'
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({
      response: "I'm having a tech hiccup, but I'm still here for you. Want to tell me more? 💚",
      mood: 'supportive',
      confidence: 0.8,
      needsHelp: false,
      treeContributed: true,
      source: 'emergency_fallback'
    })
  }
}