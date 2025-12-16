'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1b0b3f] via-[#020617] to-[#1b0b3f] text-slate-100">
      <header className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-[#050816] via-[#0b1120] to-[#050816]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-[#a855f7] via-[#e5e7eb] to-[#4c1d95] bg-clip-text text-transparent">
              🕮 ChunkChat
            </span>
          </div>
          <nav className="flex items-center gap-4 text-xs md:text-sm text-slate-300">
            <Link href="/upload" className="hover:text-white transition-colors">
              🗁 Upload
            </Link>
            <Link href="/chat" className="hover:text-white transition-colors">
             🗣 Chat
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-4xl w-full grid gap-10 md:grid-cols-[1.4fr,1fr] items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight bg-gradient-to-r from-[#e5e7eb] via-[#c4b5fd] to-[#6366f1] bg-clip-text text-transparent">
              Simple RAG application for your documents.
            </h1>
            <p className="text-sm md:text-base text-slate-300">
              Upload your PDFs and DOCX files, store them as vector chunks, and chat with an AI assistant that answers using your own data.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#312e81] via-[#4c1d95] to-[#020617] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-[0_0_28px_rgba(55,48,163,0.8)] hover:shadow-[0_0_40px_rgba(15,23,42,0.9)] transition-shadow"
              >
                Upload document
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-[#4c1d95] hover:bg-black/60 transition-colors"
              >
                Open chat
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs md:text-sm text-slate-300">
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#020617] via-[#020617] to-[#111827] px-3 py-2">
                <div className="text-[11px] uppercase tracking-wide text-slate-400">
                  Step 1
                </div>
                <div className="font-medium text-slate-100">
                  Upload PDF / DOCX
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Files are chunked and stored in Supabase and Pinecone.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#020617] via-[#0b1120] to-[#1e1b4b] px-3 py-2">
                <div className="text-[11px] uppercase tracking-wide text-slate-400">
                  Step 2
                </div>
                <div className="font-medium text-slate-100">
                  Ask questions
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  The chatbot retrieves relevant chunks and shows answers with file references.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#111827]/50 via-[#020617] to-[#1e1b4b]/40 blur-3xl opacity-70" />
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#020617] via-[#020617] to-[#111827] p-5 shadow-[0_0_45px_rgba(15,23,42,0.9)] space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Preview</span>
                <span className="text-[10px] border border-white/10 rounded-full px-2 py-0.5">
                  RAG · Next.js · Supabase · Pinecone
                </span>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#020617] via-[#020617] to-[#111827] border border-white/10 p-3 space-y-2">
                <div className="text-[11px] text-slate-400">
                  You
                </div>
                <div className="inline-block max-w-full bg-black/40 text-slate-100 px-3 py-2 rounded-2xl rounded-bl-sm text-xs border border-white/10">
                  Which files are available in my workspace?
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#020617] via-[#050816] to-[#111827] border border-white/10 p-3 space-y-2">
                <div className="text-[11px] text-slate-400">
                  ChunkChat
                </div>
                <div className="inline-block max-w-full bg-gradient-to-r from-[#312e81] via-[#4c1d95] to-[#020617] text-white px-3 py-2 rounded-2xl rounded-br-sm text-xs shadow-[0_0_25px_rgba(55,48,163,0.8)]">
                  Found 3 files: onboarding.pdf, api-spec.docx, meeting-notes.pdf.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
