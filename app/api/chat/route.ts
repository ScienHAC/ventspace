import { NextRequest, NextResponse } from 'next/server';

// Enhanced mood detection
function detectMood(text: string | undefined | null): { mood: string; confidence: number; needsHelp: boolean; category: string } {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return { mood: 'neutral', confidence: 0.3, needsHelp: false, category: 'general' };
  }

  const lowerText = text.toLowerCase();
  
  // Crisis detection
  const crisisWords = ['suicide', 'kill myself', 'end it all', 'can\'t go on', 'want to die', 'self harm', 'hurt myself', 'no point living', 'better off dead'];
  const needsHelp = crisisWords.some(word => lowerText.includes(word));
  
  // Enhanced mood categories
  const sadWords = ['sad', 'depressed', 'down', 'hopeless', 'worthless', 'empty', 'lonely', 'hurt', 'pain', 'crying', 'tears', 'disappointed', 'upset', 'rejected', 'failed', 'failure'];
  const anxiousWords = ['anxious', 'worried', 'scared', 'panic', 'stress', 'overwhelmed', 'nervous', 'fear', 'anxiety', 'tension', 'restless', 'uneasy'];
  const angryWords = ['angry', 'mad', 'furious', 'hate', 'annoyed', 'frustrated', 'rage', 'pissed', 'irritated'];
  const happyWords = ['happy', 'good', 'great', 'excited', 'joy', 'love', 'amazing', 'wonderful', 'awesome', 'fantastic', 'glad', 'pleased'];
  
  // Issue categories
  let category = 'general';
  if (lowerText.includes('exam') || lowerText.includes('study') || lowerText.includes('college') || lowerText.includes('iit') || lowerText.includes('career')) category = 'academic';
  if (lowerText.includes('family') || lowerText.includes('parents') || lowerText.includes('mom') || lowerText.includes('dad')) category = 'family';
  if (lowerText.includes('friend') || lowerText.includes('relationship') || lowerText.includes('love') || lowerText.includes('breakup')) category = 'relationships';
  if (lowerText.includes('health') || lowerText.includes('sick') || lowerText.includes('body') || lowerText.includes('sleep')) category = 'health';
  if (lowerText.includes('money') || lowerText.includes('job') || lowerText.includes('work') || lowerText.includes('future')) category = 'life_planning';
  if (lowerText.includes('hobby') || lowerText.includes('hacking') || lowerText.includes('coding') || lowerText.includes('game') || lowerText.includes('music') || lowerText.includes('art')) category = 'interests';
  
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
  
  return { mood, confidence, needsHelp, category };
}

// VentBot with Gen Z personality
function generateVentBotResponse(message: string, mood: string, needsHelp: boolean, category: string, conversationHistory: any[]): string {
  const lowerMessage = message.toLowerCase();
  const recentMessages = conversationHistory.slice(-3).map(msg => msg.text?.toLowerCase() || '').join(' ');
  const fullContext = (recentMessages + ' ' + lowerMessage).toLowerCase();
  
  // CRISIS INTERVENTION
  if (needsHelp) {
    return "Hey... I'm really worried about you right now 💔\n\nYour pain is so real, but you don't have to go through this alone.\n\nPlease reach out to someone who can help:\n• Text HOME to 741741 (Crisis Text Line)\n• Call 988 (Suicide Prevention Lifeline)\n\nYou matter so much more than you know... can you promise me you'll reach out? 🫂💙";
  }

  // GREETING RESPONSES
  if (lowerMessage.match(/^(hi|hello|hey|hii|sup|whatsup)$/)) {
    const greetings = [
      "Hey there! 👋 \n\nSo good to see you here... how's your heart feeling today?\n\nI'm genuinely here for whatever you want to share - big, small, weird, deep... anything! 💚",
      
      "Hi! 🌟\n\nYou know what? Just showing up here takes courage...\n\nWhether you want to vent, celebrate, or just chat about random stuff, I'm totally here for it.\n\nWhat's going on in your world? 😊",
      
      "Hey! 💙\n\nI'm so glad you reached out...\n\nSeriously, this space is yours - for your dreams, frustrations, achievements, random thoughts... all of it!\n\nWhat's on your mind today? 🌱"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // INTERESTS & HOBBIES
  if (category === 'interests') {
    if (lowerMessage.includes('hacking') || lowerMessage.includes('hack')) {
      return "Yooo, hacking! 🔐✨\n\nThat's honestly so cool... like being a digital detective and problem-solver rolled into one!\n\nAre you more into cybersecurity, web stuff, or penetration testing?\n\nThe hacking community is incredible - so creative and innovative... what got you into it? And what's your favorite type of challenge? 💻🚀";
    }
    if (lowerMessage.includes('coding') || lowerMessage.includes('programming')) {
      return "Coding is literally like having superpowers! 👨‍💻✨\n\nYou can create anything you imagine...\n\nWhat languages are you vibing with? Building anything exciting right now?\n\nI love how every bug is just a puzzle waiting to be solved... what's the coolest project you've worked on? 🚀";
    }
    if (lowerMessage.includes('music')) {
      return "Music is pure magic! 🎵✨\n\nDo you play, produce, or just love getting lost in it?\n\nThere's something about music that just... hits different, you know? It can heal, energize, transport you...\n\nWhat genre speaks to your soul right now? 🎶💫";
    }
    return "I love that you're passionate about something! 🌟\n\nHobbies are what make life colorful... they're like little pockets of joy and stress relief.\n\nWhat draws you to this? How does it make you feel when you're doing it? 💫";
  }

  // FAMILY STRUGGLES
  if (category === 'family') {
    if (fullContext.includes('parents') && fullContext.includes('understand')) {
      return "Ugh, the whole 'parents don't understand me' thing hits so hard... 💔\n\nIt's like you're speaking completely different languages sometimes, right?\n\nThey love you, but that love can feel like pressure or judgment...\n\nHave you tried sharing your perspective when things are calm? Sometimes they don't realize how their words land.\n\nWhat's the main thing you wish they got about you? You're definitely not alone in this struggle 🫂";
    }
    return "Family stuff is... complicated 😅\n\nThere's so much love and history, but also expectations and misunderstandings...\n\nEveryone's trying their best with what they know, but that doesn't always make it easier.\n\nWhat's weighing on you about your family situation? 💙";
  }

  // ACADEMIC PRESSURE
  if (category === 'academic') {
    if (fullContext.includes('iit') || fullContext.includes('jee')) {
      return "Oh man, IIT/JEE stress is next level... 😰\n\nYou're carrying dreams, family expectations, and societal pressure all at once. That's SO much.\n\nBut here's the thing - IIT is one amazing path, but definitely not the only one to success!\n\nBrilliant minds are everywhere... what's stressing you most right now? The prep, results, or just the uncertainty?\n\nLet's break it down together... your worth isn't defined by any exam 🌱✨";
    }
    return "Academic pressure is so real... 📚\n\nYour brain is working overtime and that mental exhaustion is totally normal.\n\nRemember - you've survived 100% of your difficult days so far!\n\nWhat's the biggest thing stressing you out right now? Let's tackle it together 💪";
  }

  // MOOD-BASED RESPONSES
  if (mood === 'sad') {
    return "I can feel the heaviness in your words... 💔\n\nSadness is such a valid emotion - it shows you care deeply about things.\n\nYou don't have to push through this alone or pretend to be strong all the time...\n\nWhat's making your heart feel heavy right now? Sometimes sharing the weight makes it a little lighter 🫂💙";
  }

  if (mood === 'anxious') {
    return "Anxiety can make everything feel so urgent and overwhelming... 😰\n\nBut right now, in this moment, you're safe...\n\nLet's breathe together - in for 4, hold for 4, out for 4...\n\nYour mind is trying to protect you by preparing for every scenario, but that's exhausting!\n\nWhat's the biggest worry spinning in your head? 🌿💚";
  }

  if (mood === 'angry') {
    return "That anger is telling you something important... 😠\n\nMaybe a boundary got crossed, or you're feeling unheard?\n\nAnger is often hurt wearing a protective mask... and it's completely okay to feel this!\n\nTake some breaths with me... what's really at the core of this frustration? What do you need to feel heard right now? 🔥➡️💙";
  }

  if (mood === 'happy') {
    return "YES! 🌟✨\n\nI absolutely LOVE seeing you in this energy! Your happiness is literally contagious - it made me smile just reading this!\n\nWhat's bringing you this joy today? Hold onto this feeling...\n\nYou deserve all the good things coming your way! 😊💫";
  }

  // GENERAL SUPPORTIVE RESPONSES
  const responses = [
    "Thank you for sharing that with me... 💚\n\nWhatever you're going through, your feelings are completely valid and important.\n\nI'm genuinely here to listen and support you through anything...\n\nWhat would feel most helpful to talk about right now? 🌱",
    
    "You know what I love about our conversation? 💙\n\nYou're being real and authentic, and that takes so much courage...\n\nWhether you're celebrating, struggling, or just processing life, I'm here for all of it.\n\nWhat's really on your heart today? 🫂",
    
    "Every time you share here, you're not just working on your healing... 🌟\n\nYou're literally helping plant trees and heal the planet too!\n\nYour mental health journey matters so much...\n\nWhat support do you need most right now? 🌍💚"
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message || body.text || '';
    const conversationHistory = body.conversationHistory || [];
    
    if (!message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Enhanced analysis
    const analysis = detectMood(message);
    
    // Generate VentBot response
    const aiResponse = generateVentBotResponse(
      message, 
      analysis.mood, 
      analysis.needsHelp, 
      analysis.category, 
      conversationHistory
    );
    
    console.log('🧠 VentBot Response:', {
      timestamp: new Date().toISOString(),
      mood: analysis.mood,
      category: analysis.category,
      needsHelp: analysis.needsHelp,
      responseLength: aiResponse.length
    });

    return NextResponse.json({
      response: aiResponse,
      mood: analysis.mood,
      confidence: analysis.confidence,
      needsHelp: analysis.needsHelp,
      category: analysis.category,
      treeContributed: true,
      timestamp: new Date().toISOString(),
      source: 'ventbot_human_like'
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json({
      response: "Hey... I'm having a small technical moment, but I'm still here for you! 💚\n\nWhatever you're going through right now, your feelings are completely valid...\n\nYou matter, and I'm here to listen.\n\nWhat's on your heart? 🌱✨",
      mood: 'supportive',
      confidence: 0.8,
      needsHelp: false,
      treeContributed: true,
      source: 'emergency_fallback'
    });
  }
}