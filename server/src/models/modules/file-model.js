import { fileURLToPath, URL } from 'url'
import { ConversationalRetrievalQAChain } from 'langchain/chains'

import saveFile from '../../utils/save-file.js'
import { openaiModel } from './openai-model.js'
import { filesLoader } from '../../utils/loaders.js'
import { init_db, fetch_db } from '../../utils/vector-store.js'
import { FILE_CONDENSE_PROMPT, QA_PROMPT } from '../../constants/templates.js'

export const initFiles = async (ctx, files) => {
  const { namespace } = ctx
  const dirPath = `../../../sources/${namespace}`

  await Promise.all(files.map((file) => saveFile(namespace, file)))

  const dirPathUrl = fileURLToPath(new URL(dirPath, import.meta.url))
  const docs = await filesLoader(dirPathUrl)

  await init_db({ docs, textKey: 'text', namespace })
}

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
