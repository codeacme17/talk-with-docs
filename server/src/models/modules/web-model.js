import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { webLoader } from '../../loaders/index.js'
import splitter from '../../utils/splitter.js'
import { CONDENSE_PROMPT, QA_PROMPT } from '../../constants/index.js'
import { init_db, fetch_db } from '../../utils/index-database.js'

export const initWeb = async (ctx) => {
  const { url, namespace } = ctx
  const rawDocs = await webLoader(url)
  const docs = await splitter(rawDocs)

  await init_db({ docs, textKey: 'text', namespace })
}

export const chatWeb = async (ctx) => {
  const { message, history } = ctx

  const vectorStore = fetch_db()

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
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
