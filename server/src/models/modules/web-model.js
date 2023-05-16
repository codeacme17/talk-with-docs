import { openaiModel } from '../modules/openai.js'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { webLoader } from '../../utils/loaders.js'
import { CONDENSE_PROMPT, QA_PROMPT } from '../../constants/templates.js'
import { init_db, fetch_db } from '../../utils/vector-store.js'
import splitter from '../../utils/splitter.js'
import 'dotenv/config'

export const initWeb = async (ctx) => {
  const { url, namespace, textKey } = ctx
  const rawDocs = await webLoader(url)
  // console.log(rawDocs)
  // toMarkdown(rawDocs, namespace)
  // const mdDocs = await mdLoader(namespace)
  const docs = await splitter(rawDocs)

  await init_db({ docs, textKey, namespace })
}

export const chatWeb = async (ctx) => {
  const { message, history, namespace, text } = ctx

  const vectorStore = await fetch_db({
    text,
    namespace,
  })

  const chain = ConversationalRetrievalQAChain.fromLLM(
    openaiModel(),
    vectorStore.asRetriever(),
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
