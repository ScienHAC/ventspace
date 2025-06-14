import { NextRequest, NextResponse } from 'next/server';

// Safe mood detection function
function detectMood(text: string | undefined | null): { mood: string; confidence: number; needsHelp: boolean } {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return { mood: 'neutral', confidence: 0.3, needsHelp: false };
  }

  const lowerText = text.toLowerCase();
  
  const crisisWords = ['suicide', 'kill myself', 'end it all', 'can\'t go on', 'want to die', 'self harm', 'hurt myself', 'no point living', 'better off dead'];
  const needsHelp = crisisWords.some(word => lowerText.includes(word));
  
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
    const body = await request.json();
    const text = body.message || body.text || body.content || '';
    const mood = body.mood || '';
    const intensity = body.intensity || 0;
    const timestamp = body.timestamp || new Date().toISOString();
    
    let detectedMood = { mood: 'neutral', confidence: 0.5, needsHelp: false };
    if (text) {
      detectedMood = detectMood(text);
    }
    
    const finalMood = mood || detectedMood.mood;
    
    return NextResponse.json({
      success: true,
      message: 'Mood logged successfully',
      data: {
        mood: finalMood,
        confidence: detectedMood.confidence,
        intensity,
        timestamp,
        needsHelp: detectedMood.needsHelp,
        originalText: text.substring(0, 100)
      }
    });
    
  } catch (error) {
    console.error('Mood API error:', error);
    return NextResponse.json(
      { error: 'Failed to log mood', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [
      { id: "1", date: new Date("2024-06-10"), mood: "anxious", intensity: 4, notes: "Exam stress" },
      { id: "2", date: new Date("2024-06-11"), mood: "sad", intensity: 3, notes: "College rejection" },
      { id: "3", date: new Date("2024-06-12"), mood: "hopeful", intensity: 4, notes: "New opportunities" }
    ]
  });
}