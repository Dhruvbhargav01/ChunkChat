// 'use client'

// import { useState } from 'react'

// export default function UploadPage() {
//   const [file, setFile] = useState<File | null>(null)
//   const [uploading, setUploading] = useState(false)
//   const [message, setMessage] = useState('')
//   const [error, setError] = useState('')

//   const handleUpload = async () => {
//     if (!file || uploading) return

//     setUploading(true)
//     setMessage('')
//     setError('')

//     const formData = new FormData()
//     formData.append('file', file)

//     try {
//       const res = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//       })
//       const data = await res.json()
//       if (!res.ok) {
//         setError(data.error || 'Upload failed')
//       } else {
//         setMessage(data.message || 'Upload success')
//       }
//     } catch {
//       setError('Unexpected error')
//     } finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3b0b8f] via-[#020617] to-[#3b0b8f] text-slate-100">
//       <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-gradient-to-br from-[#050816] via-black to-[#050816] shadow-[0_0_45px_rgba(139,92,246,0.45)] p-8 space-y-5">
//         <div className="space-y-1">
//           <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-[#a855f7] via-[#c4b5fd] to-[#4c1d95] bg-clip-text text-transparent">
//             Upload document
//           </h1>
//           <p className="text-xs md:text-sm text-slate-300">
//             Upload a single PDF or DOCX file. The content will be stored in chunks in the vector database.
//           </p>
//         </div>

//         <div className="space-y-2">
//           <label
//             className="block text-sm font-medium bg-gradient-to-r from-[#c4b5fd] via-[#e5e7eb] to-[#a855f7] bg-clip-text text-transparent"
//             htmlFor="file-input"
//           >
//             Select a PDF or DOCX file
//           </label>
//           <div className="relative">
//             <input
//               id="file-input"
//               type="file"
//               accept=".pdf,.docx"
//               onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//               className="block w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/60 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]"
//             />
//           </div>
//         </div>

//         <button
//           onClick={handleUpload}
//           disabled={!file || uploading}
//           className="w-full inline-flex items-center justify-center bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#1c0f1700] text-white px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_28px_rgba(168,85,247,0.7)] hover:shadow-[0_0_40px_rgba(236,72,153,0.9)] transition-shadow"
//         >
//           {uploading ? 'Uploading…' : 'Upload and process'}
//         </button>

//         {message && (
//           <div className="text-sm bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 rounded-xl px-3 py-2">
//             {message}
//           </div>
//         )}
//         {error && (
//           <div className="text-sm bg-rose-500/10 border border-rose-400/40 text-rose-300 rounded-xl px-3 py-2">
//             {error}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

'use client'

import { useState } from 'react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleUpload = async () => {
    if (!file || uploading) return

    setUploading(true)
    setMessage('')
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log('Frontend upload started:', file.name)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      console.log('Upload response:', data)
      if (!res.ok) {
        setError(data.error || 'Upload failed')
      } else {
        setMessage(data.message || 'Upload success')
      }
    } catch (err) {
      console.error('Frontend upload error:', err)
      setError('Unexpected error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3b0b8f] via-[#020617] to-[#3b0b8f] text-slate-100">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-gradient-to-br from-[#050816] via-black to-[#050816] shadow-[0_0_45px_rgba(139,92,246,0.45)] p-8 space-y-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-[#a855f7] via-[#c4b5fd] to-[#4c1d95] bg-clip-text text-transparent">
            Upload document
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            Upload a single PDF or DOCX file. The content will be stored in chunks in the vector database.
          </p>
        </div>

        <div className="space-y-2">
          <label
            className="block text-sm font-medium bg-gradient-to-r from-[#c4b5fd] via-[#e5e7eb] to-[#a855f7] bg-clip-text text-transparent"
            htmlFor="file-input"
          >
            Select a PDF or DOCX file
          </label>
          <div className="relative">
            <input
              id="file-input"
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/60 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6]"
            />
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full inline-flex items-center justify-center bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#1c0f1700] text-white px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_28px_rgba(168,85,247,0.7)] hover:shadow-[0_0_40px_rgba(236,72,153,0.9)] transition-shadow"
        >
          {uploading ? 'Uploading…' : 'Upload and process'}
        </button>

        {message && (
          <div className="text-sm bg-emerald-500/10 border border-emerald-400/40 text-emerald-300 rounded-xl px-3 py-2">
            {message}
          </div>
        )}
        {error && (
          <div className="text-sm bg-rose-500/10 border border-rose-400/40 text-rose-300 rounded-xl px-3 py-2">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
