'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Send, Bot, Loader2, RotateCcw, ChevronDown,
  Zap, Brain, Cpu, ArrowLeft, WifiOff, Sparkles, Copy, Check,
} from 'lucide-react'

const OLLAMA_BASE = 'http://10.228.44.149:11434'

const MODELS = [
  { id: 'qwen3.5-27b-fast', label: 'Qwen Fast', description: 'Q4 · 14 tok/s · quick tasks', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'qwen3.5-27b-smart', label: 'Qwen Smart', description: 'Q8 · deep reasoning · slower', icon: Brain, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
  { id: 'gemma4-31b', label: 'Gemma 4', description: '31B · Google · thinking', icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
]

type Message = { role: 'user' | 'assistant'; content: string; thinking?: string }

function ThinkingBlock({ content }: { content: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-2">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <Sparkles className="w-3 h-3" /><span>Thinking</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-2 p-3 rounded-lg bg-muted/40 border border-primary/10 text-xs text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
          {content}
        </div>
      )}
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
    </button>
  )
}

export function ChatInterface({ userName }: { userName: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id)
  const [streaming, setStreaming] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const model = MODELS.find((m) => m.id === selectedModel) ?? MODELS[0]

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, streaming])
  useEffect(() => {
    const ta = textareaRef.current; if (!ta) return
    ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [input])

  const sendMessage = useCallback(async () => {
    const text = input.trim(); if (!text || streaming) return
    setInput(''); setNetworkError(false)
    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    const assistantIndex = newMessages.length
    setMessages((m) => [...m, { role: 'assistant', content: '', thinking: '' }])
    setStreaming(true)
    const ctrl = new AbortController(); abortRef.current = ctrl
    try {
      const res = await fetch(`${OLLAMA_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({
          model: selectedModel,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          stream: true,
        }),
      })
      if (!res.ok || !res.body) throw new Error('failed')
      const reader = res.body.getReader(); const decoder = new TextDecoder()
      let thinkBuf = '', contentBuf = '', inThink = false
      while (true) {
        const { done, value } = await reader.read(); if (done) break
        const lines = decoder.decode(value, { stream: true }).split('\n')
        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const json = JSON.parse(line)
            const token: string = json.message?.content ?? ''
            if (!token) continue
            let rest = token
            while (rest.length > 0) {
              if (inThink) {
                const end = rest.indexOf('</think>')
                if (end !== -1) { thinkBuf += rest.slice(0, end); rest = rest.slice(end + 8); inThink = false }
                else { thinkBuf += rest; rest = '' }
              } else {
                const start = rest.indexOf('<think>')
                if (start !== -1) { contentBuf += rest.slice(0, start); rest = rest.slice(start + 7); inThink = true }
                else { contentBuf += rest; rest = '' }
              }
            }
            setMessages((m) => {
              const u = [...m]
              u[assistantIndex] = { role: 'assistant', content: contentBuf, thinking: thinkBuf }
              return u
            })
          } catch { /* ignore */ }
        }
      }
    } catch (err: unknown) {
      if (!(err instanceof Error && err.name === 'AbortError')) {
        setNetworkError(true)
        setMessages((m) => m.slice(0, -1))
      }
    } finally { setStreaming(false); abortRef.current = null }
  }, [input, messages, selectedModel, streaming])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }
  const stopGeneration = () => abortRef.current?.abort()
  const clearChat = () => { abortRef.current?.abort(); setMessages([]); setNetworkError(false) }
  const initials = userName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm shrink-0">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/dashboard" className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link href="/" className="hover:opacity-80 transition-opacity mr-2">
            <h1 className="font-display text-xl font-bold">
              <span className="text-primary">SMICR</span><span className="text-foreground"> AI</span>
            </h1>
          </Link>
          <div className="relative ml-auto">
            <button
              onClick={() => setModelDropdownOpen((o) => !o)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${model.bg} ${model.border} ${model.color} hover:opacity-80`}
            >
              <model.icon className="w-3.5 h-3.5" />{model.label}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${modelDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {modelDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-primary/10 rounded-xl shadow-lg z-20 overflow-hidden">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m.id); setModelDropdownOpen(false) }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${selectedModel === m.id ? 'bg-muted/40' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <m.icon className={`w-4 h-4 ${m.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.description}</p>
                    </div>
                    {selectedModel === m.id && <Check className="w-4 h-4 text-primary ml-auto mt-1 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="New chat">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center max-w-sm">
              <h2 className="font-display text-xl font-bold mb-1">SMICR Lab AI</h2>
              <p className="text-sm text-muted-foreground">Running on IITD servers. Ask anything — research, code, brainstorming.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {['Explain Pacejka tire model', 'Help me debug a Python script', 'Summarize my research topic', 'Write a literature review outline'].map((prompt) => (
                <button key={prompt} onClick={() => setInput(prompt)} className="text-left px-4 py-3 rounded-xl bg-card border border-primary/10 hover:border-primary/30 text-sm text-muted-foreground hover:text-foreground transition-all hover:shadow-sm">
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.role === 'user' ? 'bg-gradient-to-br from-primary to-secondary text-white' : 'bg-card border border-primary/20 text-primary'}`}>
                  {msg.role === 'user' ? initials : <Bot className="w-4 h-4" />}
                </div>
                <div className={`flex-1 min-w-0 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                  {msg.role === 'assistant' && msg.thinking && <ThinkingBlock content={msg.thinking} />}
                  <div className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap max-w-full ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card border border-primary/10 rounded-tl-sm'}`}>
                    {msg.content || (streaming && i === messages.length - 1 ? (
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        {msg.thinking ? 'Responding…' : 'Thinking…'}
                      </span>
                    ) : null)}
                    {msg.role === 'assistant' && msg.content && (
                      <div className="absolute -right-8 top-2"><CopyButton text={msg.content} /></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {networkError && (
              <div className="flex items-center gap-2 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                <WifiOff className="w-4 h-4 shrink-0" />
                <span>Could not reach the IITD server. Make sure you&apos;re connected to IITD network (or VPN).</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-primary/10 bg-card/50 backdrop-blur-sm shrink-0">
        <div className="container mx-auto px-4 py-3 max-w-3xl">
          <div className="flex items-end gap-2 bg-background border border-primary/20 rounded-2xl px-4 py-2 focus-within:border-primary/40 transition-colors">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${model.label}…`}
              disabled={streaming}
              className="flex-1 bg-transparent resize-none outline-none text-sm placeholder:text-muted-foreground leading-relaxed py-1 max-h-40 disabled:opacity-50"
            />
            {streaming ? (
              <button onClick={stopGeneration} className="p-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors shrink-0" title="Stop">
                <span className="w-3.5 h-3.5 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 bg-destructive rounded-sm" />
                </span>
              </button>
            ) : (
              <button onClick={sendMessage} disabled={!input.trim()} className="p-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed" title="Send (Enter)">
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            Models run locally on IITD servers · Only accessible on IITD network
          </p>
        </div>
      </div>
    </div>
  )
}
