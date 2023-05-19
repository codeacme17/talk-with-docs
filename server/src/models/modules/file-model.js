import { fileURLToPath, URL } from 'url'
import {
  ConversationalRetrievalQAChain,
  loadSummarizationChain,
} from 'langchain/chains'

import saveFile from '../../utils/save-file.js'
import { openaiModel } from './openai-model.js'
import { fileSplitter } from '../../utils/splitter.js'
import { filesLoader } from '../../utils/loaders.js'
import { init_db, fetch_db } from '../../utils/vector-store.js'
import { CONDENSE_PROMPT, QA_PROMPT } from '../../constants/templates.js'

export const initFiles = async (ctx, files) => {
  const { namespace } = ctx
  const dirPath = `../../../sources/${namespace}`

  const dirPathUrl = fileURLToPath(new URL(dirPath, import.meta.url))

  files.forEach((file) => {
    saveFile(namespace, file)
  })

  const rawDocs = await filesLoader(dirPathUrl)
  const docs = await fileSplitter(rawDocs)

  await init_db({ docs, textKey: 'text', namespace })
}

export const chatFiles = async (ctx) => {
  const { message, history, namespace, text } = ctx

  const vectorStore = await fetch_db({
    text,
    namespace,
  })

  const TOP_K = 5

  const chain = ConversationalRetrievalQAChain.fromLLM(
    openaiModel('3.5'),
    vectorStore.asRetriever(TOP_K),
    {
      qaTemplate: QA_PROMPT,
      questionGeneratorTemplate: CONDENSE_PROMPT,
      returnSourceDocuments: true,
    }
  )

  const Sum_Chain = loadSummarizationChain(openaiModel('3.5'), {
    type: 'map_reduce',
  })

  const response = await chain.call({
    question: message,
    chat_history: history || [],
  })

  return response
}
