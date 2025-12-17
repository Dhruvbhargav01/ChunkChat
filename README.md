# ChunkChat – RAG Application

🔗 **Live App**: [https://chunk-chat.vercel.app/](https://chunk-chat.vercel.app/)
🔗 **GitHub Repo**: [https://github.com/Dhruvbhargav01/ChunkChat](https://github.com/Dhruvbhargav01/ChunkChat)

---

## Project Overview

**ChunkChat** is a Retrieval-Augmented Generation (RAG) application that allows users to upload documents (PDF/DOCX), store them in Supabase, convert them into semantic chunks, and query them through an intelligent chatbot powered by **Gemini**. The chatbot supports both normal conversation and document-based question answering using vector search.

---

## Key Features

* Upload PDF / DOCX files
* Store files in **Supabase Storage** (`chunk-chat-bucket`)
* Parse documents into chunks
* Store embeddings in **Pinecone** vector database
* Chatbot with:

  * Normal conversational responses
  * Tool calling for document-based queries
* File name references included in answers
* Full tracing and observability using **Langfuse**

---

## Workflow

1. User uploads a document
2. File is stored in Supabase
3. Content is chunked and embedded
4. Chunks are stored in Pinecone with metadata
5. User chats with the bot
6. Bot decides between normal response or tool call
7. Relevant chunks are retrieved and used to answer
8. All LLM and tool calls are traced in Langfuse

---

## Tech Stack

* **Framework**: Next.js (App Router), TypeScript
* **Storage**: Supabase (Storage Bucket)
* **Vector DB**: Pinecone
* **LLM**: Google Gemini
* **Observability**: Langfuse
* **Deployment**: Vercel

---

## Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Dhruvbhargav01/ChunkChat.git
cd ChunkChat
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name

GEMINI_API_KEY=your_gemini_api_key

LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
LANGFUSE_SECRET_KEY=your_langfuse_secret_key
LANGFUSE_HOST=your_langfuse_host
```

### 4. Supabase Setup

* Create a Supabase project
* Create a storage bucket named: `chunk-chat-bucket`
* Use server-side routes for upload (service role key)
* Authentication is **not required**

### 5. Pinecone Setup

* Create a Pinecone index
* Use the same index name in environment variables
* Store document chunks with metadata (file name, chunk id)

### 6. Langfuse Setup

* Create a Langfuse project
* Configure system prompts in Langfuse
* Enable tracing for:

  * LLM calls
  * Tool calls
  * Decision-making (chat vs retrieval)

---

## Run Locally

```bash
npm run dev
```

Application will be available at:

```
http://localhost:3000
```

---

## Deployment

The application is deployed on **Vercel**:

👉 [https://chunk-chat.vercel.app/](https://chunk-chat.vercel.app/)

Make sure all environment variables are added in Vercel project settings before deployment.

---

## Status

✔ Document upload and storage implemented
✔ Chunking and vector storage working
✔ Chatbot with tool calling completed
✔ Gemini + Langfuse integration done
✔ Deployed on Vercel

---
## Screenshots

1. Home page - <img width="1920" height="1080" alt="Screenshot 2025-12-17 101815" src="https://github.com/user-attachments/assets/f2d56c45-6e07-4613-9c1f-d27b6c9a0a49" />
2. Upload Page - <img width="1920" height="1080" alt="Screenshot 2025-12-17 101837" src="https://github.com/user-attachments/assets/9d7689d9-718b-4e81-95d2-bf979d1bacf9" />
3. Chat Page - <img width="1920" height="1080" alt="Screenshot 2025-12-17 102047" src="https://github.com/user-attachments/assets/f4e8a065-2cdd-46d7-b005-4e49804d4151" />


## Author

**Dhruv Bhargav**
