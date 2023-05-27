import { PineconeClient } from '@pinecone-database/pinecone'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import 'dotenv/config'
import { openai } from '../models/index.js'

const pinecone = new PineconeClient()

await pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
})

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX)

const init_db = async (data) => {
  const { docs, textKey, namespace } = data

  await PineconeStore.fromDocuments(docs, openai.embeddings, {
    pineconeIndex,
    textKey,
    namespace,
  })

  console.log('finish init' + namespace)
}

const fetch_db = async (data) => {
  const { textKey, namespace } = data

  const vectorStore = await PineconeStore.fromExistingIndex(openai.embeddings, {
    pineconeIndex,
    textKey,
    namespace,
  })

  return vectorStore
}

export { init_db, fetch_db }
