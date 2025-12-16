'use client'

import { useState } from 'react'

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
    role: ChatRole
    content: string
}

export default function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        if (!input.trim() || loading) return

        const userMessage: ChatMessage = { role: 'user', content: input }
        const newMessages: ChatMessage[] = [...messages, userMessage]

        setMessages(newMessages)
        setInput('')
        setLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            })

            const data = await res.json()
            if (res.ok && data.reply) {
                const assistantMessage: ChatMessage = {
                    role: 'assistant',
                    content: data.reply as string,
                }
                setMessages([...newMessages, assistantMessage])
            } else {
                const errorMessage: ChatMessage = {
                    role: 'assistant',
                    content: (data.error as string) || 'Something went wrong.',
                }
                setMessages([...newMessages, errorMessage])
            }
        } catch {
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: 'Network error.',
            }
            setMessages([...newMessages, errorMessage])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#3b0b8f] via-[#020617] to-[#3b0b8f] text-slate-100">
            <header className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-[#050816] via-[#0b1120] to-[#050816]">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-[#a855f7] via-[#c4b5fd] to-[#4c1d95] bg-clip-text text-transparent">
                        ChunkChat Assistant
                    </h1>
                    <p className="text-xs md:text-sm text-slate-300 mt-1">
                        Solve all your queries!
                    </p>
                </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col gap-4">
                <div className="flex-1 overflow-y-auto rounded-2xl bg-gradient-to-br from-[#050816] via-black to-[#050816] border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.45)] p-4 space-y-3">
                    {messages.length === 0 && (
                        <div className="text-slate-300 text-sm">
                            Start chatting. Ask anything or reference your uploaded documents. Answers will appear here.
                        </div>
                    )}
                    {messages.map((m, idx) => (
                        <div
                            key={idx}
                            className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                        >
                            <div
                                className={
                                    m.role === 'user'
                                        ? 'inline-block max-w-[80%] bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#210f99] text-white px-4 py-2.5 rounded-2xl rounded-br-sm text-sm shadow-[0_0_25px_rgba(168,85,247,0.6)]'
                                        : 'inline-block max-w-[80%] bg-white/5 text-slate-100 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm border border-white/10'
                                }
                            >
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="text-left text-slate-300 text-sm">
                            Thinking…
                        </div>
                    )}
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-[#050816] via-black to-[#050816] border border-white/10 shadow-[0_0_30px_rgba(15,23,42,0.9)] p-4">
                    <div className="flex gap-2 items-end"> 
                        <textarea
                            className="flex-1 bg-transparent border border-white/15 focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] rounded-xl px-4 py-2 text-sm resize-none h-10 text-slate-100 placeholder:text-slate-500 outline-none"
                            placeholder="Type your message here..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#050003] text-white px-5 py-2 rounded-full text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_28px_rgba(168,85,247,0.7)] hover:shadow-[0_0_40px_rgba(236,72,153,0.9)] transition-shadow h-10"
                        >
                            <span>{loading ? 'Sending…' : 'Send'}</span>
                        </button>
                    </div>
                </div>

            </main>
        </div>
    )
}
