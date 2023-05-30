import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { openaiModel } from './openai-model.js'
import { webLoader } from '../../utils/loaders.js'
import { WEB_CONDENSE_PROMPT, QA_PROMPT } from '../../constants/templates.js'
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
  const TOP_K = 4

  const vectorStore = await fetch_db({
    text,
    namespace,
  })

  const chain = ConversationalRetrievalQAChain.fromLLM(
    openaiModel('3.5'),
    vectorStore.asRetriever(TOP_K),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: WEB_CONDENSE_PROMPT,
      returnSourceDocuments: true,
    }
  )

  const response = await chain.call({
    question: message,
    chat_history: [],
  })

  return response
}
