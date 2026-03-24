import { useState, useRef, useEffect } from 'react'
import { Send, Bot, Loader2, Mic, MicOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSpeechText } from '../hooks/useSpeechText'
import './Chatbot.css'

interface Message {
    id: string
    text: string
    sender: 'user' | 'ai'
    timestamp: Date
}

export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I am Aura, your AI mental health physical wellness assistant. How are you feeling today?',
            sender: 'ai',
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    const { transcript, isListening, startListening, stopListening, hasSupport } = useSpeechText()

  
    useEffect(() => {
        if (transcript) {
            setInput(prev => prev + ' ' + transcript)
        }
    }, [transcript])

    // Scroll to bottom when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsLoading(true)

        try {
            // Connect to the Python FastAPI backend
            const res = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.text })
            })

            const data = await res.json()

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.reply || "I am currently disconnected from the backend. Please ensure the Python server is running.",
                sender: 'ai',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiMsg])
        } catch (e) {
            console.error(e)
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: "Connection error. Make sure `python backend/main.py` is running on port 8000.",
                sender: 'ai',
                timestamp: new Date()
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend()
    }

    return (
        <div className="chatbot-container glass-card">
            <div className="chat-header">
                <div className="flex-align gap-2">
                    <div className="ai-avatar pulse-glow"><Bot size={24} color="var(--primary)" /></div>
                    <div>
                        <h3 style={{ margin: 0 }}>Aura Health AI</h3>
                        <p className="status text-sm text-accent">Online</p>
                    </div>
                </div>
            </div>

            <div className="chat-history">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'user-wrapper' : 'ai-wrapper'}`}
                        >
                            {msg.sender === 'ai' && <div className="chat-avatar"><Bot size={16} /></div>}
                            <div className={`chat-bubble ${msg.sender}`}>
                                <p>{msg.text}</p>
                                <span className="timestamp">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="chat-bubble-wrapper ai-wrapper"
                        >
                            <div className="chat-avatar"><Bot size={16} /></div>
                            <div className="chat-bubble ai typing">
                                <Loader2 size={16} className="spin" />
                                <span>Analyzing health data...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>

            <div className="chat-input-area">
                {hasSupport && (
                    <button
                        className={`icon-btn voice-btn ${isListening ? 'listening' : ''}`}
                        title="Voice Assistant"
                        onClick={isListening ? stopListening : startListening}
                    >
                        {isListening ? <MicOff size={20} color="var(--danger)" /> : <Mic size={20} />}
                    </button>
                )}
                <input
                    type="text"
                    placeholder="Ask Aura about your stress, sleep, or wellness..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button className="btn-primary send-btn" onClick={handleSend} disabled={!input.trim() || isLoading}>
                    <Send size={18} />
                </button>
            </div>
        </div>
    )
}
