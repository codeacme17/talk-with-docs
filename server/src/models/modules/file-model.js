import { fileURLToPath, URL } from 'url'
import { OpenAI } from 'langchain/llms/openai'
import { ConversationalRetrievalQAChain } from 'langchain/chains'

import options from '../../utils/agent.js'
import splitter from '../../utils/splitter.js'
import saveFile from '../../utils/save-file.js'
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
  const docs = await splitter(rawDocs)

  await init_db({ docs, textKey: 'text', namespace })
}

export const chatFiles = async (ctx) => {
  const { message, history, namespace, text } = ctx

  const vectorStore = await fetch_db({
    text,
    namespace,
  })

  const model = new OpenAI(
    {
      temperature: 0.9,
      modelName: 'gpt-3.5-turbo',
      maxTokens: 2000,
    },
    {
      baseOptions: options,
    }
  )

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
