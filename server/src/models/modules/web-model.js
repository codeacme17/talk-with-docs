import { ConversationalRetrievalQAChain } from 'langchain/chains'

import { openaiModel } from '../modules/openai.js'
import { webLoader } from '../../utils/loaders.js'
import { CONDENSE_PROMPT, QA_PROMPT } from '../../constants/templates.js'
import { init_db, fetch_db } from '../../utils/vector-store.js'
import { webSplitter } from '../../utils/splitter.js'
import 'dotenv/config'

export const initWeb = async (ctx) => {
  const { url, namespace, textKey } = ctx
  const rawDocs = await webLoader(url)
  const docs = await webSplitter(rawDocs)

  await init_db({ docs, textKey, namespace })
}

export const chatWeb = async (ctx) => {
  const { message, history, namespace, text } = ctx

  const vectorStore = await fetch_db({
    text,
    namespace,
  })

  const TOP_K = 3

  const chain = ConversationalRetrievalQAChain.fromLLM(
    openaiModel(),
    vectorStore.asRetriever(TOP_K),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: true,
    }
  )

  const response = await chain.call({
    question: message,
    chat_history: history || [],
  })

  return response
}
