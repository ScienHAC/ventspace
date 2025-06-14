"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Mic, MicOff, Leaf, Heart, AlertTriangle, Phone } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
  mood?: "happy" | "sad" | "anxious" | "angry" | "neutral"
  plantProgress?: number
  needsHelp?: boolean
  category?: string
  isTyping?: boolean
}

// Fix hydration issue with consistent time formatting
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: "2-digit", 
    minute: "2-digit",
    hour12: false // Use 24-hour format to avoid AM/PM differences
  })
}

// Helper function to simulate typing delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function ChatPage() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey there! 👋 I'm your AI companion - part therapist, part friend, part life coach. I'm here to listen, support, and help you through anything you're facing. Every message you send helps plant a real tree! 🌱 What's on your mind today?",
      sender: "ai",
      timestamp: new Date(),
      mood: "happy",
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [ventCount, setVentCount] = useState(7)
  const [treesPlanted, setTreesPlanted] = useState(2)
  const [isLoading, setIsLoading] = useState(false)
  const [showEmergencyHelp, setShowEmergencyHelp] = useState(false)
  const [isClient, setIsClient] = useState(false) // Fix hydration
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null) // Add input ref
  const requestInProgress = useRef(false) // Prevent double requests
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fix hydration by ensuring client-side rendering for timestamps
  useEffect(() => {
    setIsClient(true)
  }, [])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Keep focus on input after sending message
  const keepInputFocus = useCallback(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }, [])

  const detectMood = (text: string): "happy" | "sad" | "anxious" | "angry" | "neutral" => {
    const lowerText = text.toLowerCase()
    if (lowerText.includes("happy") || lowerText.includes("great") || lowerText.includes("awesome") || lowerText.includes("good") || lowerText.includes("love") || lowerText.includes("excited"))
      return "happy"
    if (lowerText.includes("sad") || lowerText.includes("depressed") || lowerText.includes("down") || lowerText.includes("hurt") || lowerText.includes("cry"))
      return "sad"
    if (lowerText.includes("anxious") || lowerText.includes("worried") || lowerText.includes("nervous") || lowerText.includes("stress") || lowerText.includes("scared"))
      return "anxious"
    if (lowerText.includes("angry") || lowerText.includes("mad") || lowerText.includes("frustrated") || lowerText.includes("annoyed") || lowerText.includes("hate"))
      return "angry"
    return "neutral"
  }

  // Word-by-word typing simulation
  const simulateTyping = async (fullText: string, messageId: string) => {
  const words = fullText.split(' ')
  let currentText = ''
  
  setTypingMessageId(messageId)

  for (let i = 0; i < words.length; i++) {
    currentText += (i > 0 ? ' ' : '') + words[i]

    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, text: currentText, isTyping: true }
          : msg
      )
    )

    const delay = words[i].length < 3 ? 10 :
                  words[i].length < 6 ? 30 :
                  45

    const extraDelay = /[.!?]/.test(words[i]) ? 150 : 0

    await sleep(delay + extraDelay)
    scrollToBottom()
  }

  // End of message
  setMessages(prev =>
    prev.map(msg =>
      msg.id === messageId
        ? { ...msg, isTyping: false }
        : msg
    )
  )
  setTypingMessageId(null)
}


  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading || requestInProgress.current) return

    requestInProgress.current = true // Prevent double requests
    const userMood = detectMood(inputText)
    const newVentCount = ventCount + 1
    let newTreesPlanted = treesPlanted
    let plantProgress = (newVentCount % 10) * 10

    // Plant a tree every 10 vents
    if (newVentCount % 10 === 0) {
      newTreesPlanted += 1
      plantProgress = 0
      toast({
        title: "🌱 Tree Planted!",
        description: `Amazing! Your venting just planted tree #${newTreesPlanted}. You're healing yourself AND the planet!`,
      })
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      mood: userMood,
      plantProgress,
    }

    const currentInputText = inputText
    
    // Update UI immediately
    setMessages((prev) => [...prev, userMessage])
    setVentCount(newVentCount)
    setTreesPlanted(newTreesPlanted)
    setInputText("") // Clear input
    setIsLoading(true)
    
    // Keep focus on input field
    keepInputFocus()

    try {
      // Call the CHAT API, not mood API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInputText,
          conversationHistory: messages.slice(-6)
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Show emergency help if needed
      if (data.needsHelp) {
        setShowEmergencyHelp(true)
        toast({
          title: "🚨 Emergency Support Available",
          description: "I'm concerned about you. Please consider reaching out for help.",
          variant: "destructive",
        })
      }

      // Create AI message with empty text initially
      const aiMessageId = `ai-${Date.now()}`
      const aiResponse: Message = {
        id: aiMessageId,
        text: "", // Start empty
        sender: "ai",
        timestamp: new Date(),
        mood: "neutral",
        category: data.category,
        isTyping: true,
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
      
      // Start word-by-word typing simulation
      await simulateTyping(data.response, aiMessageId)
      
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Connection Issue",
        description: "I'm still here for you! Let me try to respond...",
      })
      
      const fallbackMessageId = `fallback-${Date.now()}`
      const fallbackResponse: Message = {
        id: fallbackMessageId,
        text: "",
        sender: "ai",
        timestamp: new Date(),
        mood: "neutral",
        isTyping: true,
      }
      
      setMessages((prev) => [...prev, fallbackResponse])
      setIsLoading(false)
      
      // Simulate typing for fallback
      await simulateTyping(
        "I'm having some technical difficulties, but I want you to know - I'm here for you. Your feelings are valid, and you're not alone. What you're going through matters. 💚", 
        fallbackMessageId
      )
    } finally {
      requestInProgress.current = false // Reset request lock
      keepInputFocus() // Ensure focus returns to input
    }
  }

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      toast({
        title: "🎤 Voice Recording",
        description: "Voice feature coming soon! For now, type your thoughts.",
      })
    }
  }

  const handleSOS = async () => {
    try {
      await fetch("/api/emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "sos",
          timestamp: new Date().toISOString(),
        }),
      })

      toast({
        title: "🚨 Emergency Support Activated",
        description: "Connecting you to crisis support resources...",
        variant: "destructive",
      })
    } catch (error) {
      console.error("Error triggering SOS:", error)
    }
  }

  const handleEmergencyHelp = () => {
    window.open('tel:988', '_blank') // US Crisis Lifeline
  }

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case "happy": return "bg-yellow-100 border-yellow-300"
      case "sad": return "bg-blue-100 border-blue-300"
      case "anxious": return "bg-purple-100 border-purple-300"
      case "angry": return "bg-red-100 border-red-300"
      default: return "bg-gray-100 border-gray-300"
    }
  }

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case "happy": return "😊"
      case "sad": return "😢"
      case "anxious": return "😰"
      case "angry": return "😠"
      default: return "😐"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              VentSpace
            </h1>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-sm font-semibold text-green-600">{ventCount}/10 vents</div>
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(ventCount % 10) * 10}%` }}
                ></div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Leaf className="w-3 h-3 mr-1" />
              {treesPlanted} trees planted
            </Badge>
            
            {showEmergencyHelp && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleEmergencyHelp} 
                className="bg-red-500 hover:bg-red-600 animate-pulse"
              >
                <Phone className="w-4 h-4 mr-1" />
                Crisis Help
              </Button>
            )}
            
            <Button variant="destructive" size="sm" onClick={handleSOS} className="bg-red-500 hover:bg-red-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              SOS
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 overflow-hidden">
          {/* Messages */}
          <div className="h-[60vh] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
                  <Card
                    className={`p-4 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === "ai" && (
                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Heart className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className={`${message.sender === "user" ? "text-white" : "text-gray-800"}`}>
                          {/* Preserve line breaks in AI messages */}
                          {message.sender === "ai" ? (
                            <div className="whitespace-pre-line">
                              {message.text}
                              {message.isTyping && (
                                <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse" />
                              )}
                            </div>
                          ) : (
                            <p>{message.text}</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${message.sender === "user" ? "text-white/70" : "text-gray-500"}`}>
                            {isClient ? formatTime(message.timestamp) : '--:--'}
                          </span>
                          {message.mood && message.sender === "user" && (
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white/90">
                              {getMoodEmoji(message.mood)} {message.mood}
                            </span>
                          )}
                        </div>
                        {message.plantProgress !== undefined && message.plantProgress > 0 && (
                          <div className="mt-2 bg-white/20 rounded-lg p-2">
                            <div className="text-xs text-white/90 mb-1">Tree Progress: {message.plantProgress}%</div>
                            <div className="w-full bg-white/30 rounded-full h-1">
                              <div
                                className="bg-white h-1 rounded-full transition-all duration-300"
                                style={{ width: `${message.plantProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[70%]">
                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Heart className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">VentBot is thinking deeply...</span>
                    </div>
                  </Card>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-green-100 p-6 bg-white/50">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef} // Add ref for focus management
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Share anything - stress, dreams, fears, joy, hobbies... I'm here for it all! 🌱"
                  className="pr-12 py-6 text-lg rounded-full border-green-200 focus:border-green-400"
                  onKeyDown={handleKeyPress} // Use onKeyDown instead of onKeyPress
                  disabled={isLoading || typingMessageId !== null}
                  autoFocus // Auto focus on page load
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
                  onClick={toggleRecording}
                >
                  {isRecording ? (
                    <MicOff className="w-5 h-5 text-red-500" />
                  ) : (
                    <Mic className="w-5 h-5 text-gray-500" />
                  )}
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading || typingMessageId !== null}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-full px-8 py-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
              <span>🧠 VentBot Typing...</span>
              <span>🌱 {10 - (ventCount % 10)} vents until next tree</span>
              <span>🔒 100% Anonymous & Safe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
