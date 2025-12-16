// lib/llm.ts
import { callOpenAIWithTools, getEmbedding } from './openai'
import { searchPinecone } from './pinecone'
import { langfuse } from './langfuse'

type RagAssistantArgs = { message: string }

export async function ragAssistant({ message }: RagAssistantArgs): Promise<string> {
  if (!message.trim()) return 'Please enter a message.'

  const trace = langfuse.trace({
    name: 'rag-assistant',
    input: { message },
  })

  const systemPrompt =
    'You are ChunkChat Assistant. You can have normal conversation. ' +
    'When the user asks about uploaded PDF/DOCX documents, you may use the tool ' +
    '"search_documents" to look up relevant chunks in Pinecone. ' +
    'When you use document information, mention the source file name in square brackets, like [myfile.pdf].'

  // 1) First call: let OpenAI decide whether to call the tool
  const initial = await callOpenAIWithTools({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'search_documents',
          description:
            'Search Pinecone for relevant chunks to answer questions about uploaded PDF/DOCX documents.',
          parameters: {
            type: 'object',
            properties: {
              query: { type: 'string' },
            },
            required: ['query'],
          },
        },
      },
    ],
    tool_choice: 'auto',
  })

  const choice = initial.choices?.[0]
  const msg = choice?.message
  const toolCall = msg?.tool_calls?.[0]

  // 2) If OpenAI calls search_documents, run Pinecone search
  if (toolCall && toolCall.type === 'function' && toolCall.function?.name === 'search_documents') {
    let toolArgs: { query: string } = { query: message }

    try {
      const parsed = JSON.parse(toolCall.function.arguments || '{}')
      if (parsed && typeof parsed.query === 'string') {
        toolArgs = { query: parsed.query }
      }
    } catch {
      toolArgs = { query: message }
    }

    const span = trace.span({
      name: 'search_documents',
      input: toolArgs,
    })

    const embedding = await getEmbedding(toolArgs.query)
    const matches = await searchPinecone(embedding)

    span.update?.({ output: { matchesCount: matches.length } })

    const toolResultText = matches
      .map((m: any) => `File: ${m.filename}\nChunk: ${m.text}`)
      .join('\n\n')

    // ✅ IMPORTANT: get tool_call_id from the first response
    const toolCallId = toolCall.id

    // 3) Second call: give tool result back to OpenAI WITH tool_call_id
    const final = await callOpenAIWithTools({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
        msg, // assistant message that contains tool_calls
        {
          role: 'tool',
          tool_call_id: toolCallId, // ✅ required
          name: 'search_documents',
          content: toolResultText,
        } as any,
      ],
    })

    const finalMsg = final.choices?.[0]?.message
    const reply =
      finalMsg?.content ?? 'No answer generated from retrieved documents.'
    trace.update?.({ output: { reply } })
    return reply
  }

  // 4) No tool call: normal conversation
  const normalReply = msg?.content ?? 'No answer generated.'
  trace.update?.({ output: { reply: normalReply } })
  return normalReply
}
