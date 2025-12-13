export default async function Home() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">ChunkChat RAG ✅</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-green-800">Supabase Ready</h2>
          <p>Tables: files, chunks</p>
          <p> RLS disabled</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Pinecone Ready</h2>
          <p> Index: rag-index (1536 dims)</p>
          <p> Metric: cosine</p>
          <p> Vectors: 0/1M free</p>
        </div>
      </div>
      <div className="mt-12 p-6 bg-gray-900 text-white rounded-lg">
        <h3 className="text-xl font-bold mb-2">Next: Upload Page</h3>
        <p>git checkout -b feat/upload-page</p>
      </div>
    </div>
  )
}
