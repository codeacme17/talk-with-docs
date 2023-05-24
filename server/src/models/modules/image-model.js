import { fileURLToPath, URL } from 'url'
import { ConversationalRetrievalQAChain } from 'langchain/chains'

import { openaiModel } from './openai-model.js'
import { fetch_db } from '../../utils/vector-store.js'
import { FILE_CONDENSE_PROMPT, QA_PROMPT } from '../../constants/templates.js'

export const chatFiles = async (ctx) => {
  const { message, history, namespace, text } = ctx

  const vectorStore = await fetch_db({
    text,
    namespace,
  })

  const TOP_K = 4

  const chain = ConversationalRetrievalQAChain.fromLLM(
    openaiModel('3.5'),
    vectorStore.asRetriever(TOP_K),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: FILE_CONDENSE_PROMPT,
      returnSourceDocuments: true,
    }
  )

  const response = await chain.call({
    question: message,
    // chat_history: history || [],
    chat_history: [],
  })

  return response
}
