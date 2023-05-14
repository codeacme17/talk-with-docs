import { PineconeClient } from '@pinecone-database/pinecone'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import 'dotenv/config'
import options from '../utils/agent.js'

const init_db = async (data) => {
  const { docs, textKey, namespace } = data

  const pinecone = new PineconeClient()

  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  })

  const embeddings = new OpenAIEmbeddings(
    {},
    {
      baseOptions: options,
    }
  )

  try {
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: pinecone.Index(process.env.PINECONE_INDEX),
      textKey,
      namespace,
    })
  } catch (error) {
    console.log(error)
  }

  console.log('finish init')
}

const fetch_db = async (data) => {
  const { textKey, namespace } = data

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    {
      pineconeIndex,
      textKey,
      namespace,
    }
  )

  return vectorStore
}

export { init_db, fetch_db }
