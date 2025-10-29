"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, Fragment } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createPortal } from "react-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Bot, User, Send, Loader2, Target, GitBranch, AlertTriangle, Clock } from "lucide-react"
import Draggable from "react-draggable"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  error?: boolean
}

export function ChatWidget() {
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorToast, setErrorToast] = useState("")
  const params = useParams()
  const nodeRef = useRef(null)
  const projectId = params?.id as string

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const submitMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return
    
    const userMessage: Message = {
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          projectId: projectId || null,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.message) {
        throw new Error("Invalid response format")
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      setErrorToast("Connection error. Please try again later.")
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
        error: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, projectId])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitMessage(input)
  }

function formatTimestamp(date: Date) {
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  return isToday
    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
  const sendQuickMessage = async (message: string) => {
    await submitMessage(message)
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const messagesContainer = document.getElementById("chat-messages")
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }, [messages])

  const handleToggle = () => {
    const nextIsOpen = !isOpen
    setIsOpen(nextIsOpen)
    // Reset chat when closing
    if (!nextIsOpen) {
      setMessages([])
      setInput("")
    }
  }

  return (
    <Fragment>
      {errorToast && (
        <div role="alert" aria-live="assertive" className="fixed bottom-24 right-4 z-[1001] bg-red-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {errorToast}
          <button className="ml-2 text-xs underline" onClick={() => setErrorToast("")}>Dismiss</button>
        </div>
      )}
      <Button
  onClick={handleToggle}
  className="w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition-all"
  style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 1000 }}
  aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {isMounted && isOpen && createPortal(
        <Draggable nodeRef={nodeRef} handle=".drag-handle" defaultPosition={{x: Math.max(window.innerWidth - 416, 16), y: Math.max(window.innerHeight - 528, 16)}}>
          <Card ref={nodeRef} className="w-full max-w-sm h-[28rem] shadow-xl border rounded-xl bg-white flex flex-col" style={{ zIndex: 999 }} role="dialog" aria-modal="true" aria-label="Cognisync AI Assistant Chat">
            <CardHeader className="pb-3 drag-handle cursor-move">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <span>Cognisync AI Assistant</span>
                {projectId && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Project Context</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:bg-gray-100"
                onClick={() => setMessages([])}
              >Clear</Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 flex flex-col flex-grow">
            <div id="chat-messages" className="flex-1 p-4 overflow-y-auto" aria-live="polite" role="log">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-4 px-2">
                  <Bot className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                  <p className="text-sm mb-4">
                    Hi! I'm your AI project assistant powered by Gemini. Ask me about project management, task
                    optimization, or any questions about Cognisync.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button onClick={() => sendQuickMessage("Analyze my project for goal alignment.")} className="p-2 border rounded-lg text-left hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <h4 className="font-semibold text-xs text-gray-800">AlignBot</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Ensures team stays aligned with project objectives.</p>
                    </button>

                    <button onClick={() => sendQuickMessage("Analyze my task dependencies.")} className="p-2 border rounded-lg text-left hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <GitBranch className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <h4 className="font-semibold text-xs text-gray-800">DepGraph AI</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Maps and optimizes task dependencies to prevent bottlenecks.</p>
                    </button>

                    <button onClick={() => sendQuickMessage("Identify potential risks in my project.")} className="p-2 border rounded-lg text-left hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        <h4 className="font-semibold text-xs text-gray-800">RiskSeeker AI</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Proactively identifies potential risks and suggests mitigations.</p>
                    </button>

                    <button onClick={() => sendQuickMessage("Suggest timeline optimizations for my project.")} className="p-2 border rounded-lg text-left hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <h4 className="font-semibold text-xs text-gray-800">TimeShift AI</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Optimizes project timelines and resource allocation.</p>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`w-fit max-w-[80%] rounded-lg p-3 ${
                          message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100"
                        }`}
                        aria-label={message.role === "user" ? "User message" : "Assistant message"}
                      >
                        <div className="flex items-start space-x-3">
                          {message.role === "user" ? (
                            <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Bot className="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" />
                          )}
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            message.role === "user" ? "text-gray-300 text-right" : "text-gray-400 text-right"
                          }`}
                        >{formatTimestamp(message.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-blue-600" />
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          <div className="text-sm">AI is thinking...</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <form id="chat-form" onSubmit={sendMessage} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your project..."
                  disabled={isLoading}
                  className="flex-1"
                  aria-label="Chat input"
                />
                <Button type="submit" size="sm" disabled={isLoading || !input.trim()} aria-label="Send message">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            </div>
          </CardContent>
          </Card>
        </Draggable>,
        document.body
      )}
    </Fragment>
  )
}
