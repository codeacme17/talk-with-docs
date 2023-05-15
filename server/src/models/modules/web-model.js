import { OpenAI } from 'langchain/llms/openai'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { webLoader, mdLoader } from '../../utils/loaders.js'
import { CONDENSE_PROMPT, QA_PROMPT } from '../../constants/templates.js'
import { init_db, fetch_db } from '../../utils/index-database.js'
import splitter from '../../utils/splitter.js'
import options from '../../utils/agent.js'
import toMarkdown from '../../utils/to-markdown.js'
import 'dotenv/config'

export const initWeb = async (ctx) => {
  const { url, namespace, textKey } = ctx
  const rawDocs = await webLoader(url)
  // console.log(rawDocs)
  return
  // toMarkdown(rawDocs, namespace)
  // const mdDocs = await mdLoader(namespace)
  const docs = await splitter(rawDocs)

  await init_db({ docs, textKey, namespace })
}

export const chatWeb = async (ctx) => {
  const { message, history, namespace, text } = ctx

  console.log(namespace)

  const vectorStore = await fetch_db({
    text,
    namespace,
  })

  const model = new OpenAI(
    {
      temperature: 0.9,
      modelName: 'gpt-3.5-turbo',
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
