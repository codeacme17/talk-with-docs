import { PineconeClient } from '@pinecone-database/pinecone'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { openai } from '../models/index.js'
import 'dotenv/config'

const pinecone = new PineconeClient()
await pinecone.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
})
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX)

export const init_db = async (data) => {
  const { docs, textKey, namespace } = data

  await PineconeStore.fromDocuments(docs, openai.embeddings, {
    pineconeIndex,
    textKey,
    namespace,
  })

  console.log('finish init' + namespace)
}

export const fetch_db = async (data) => {
  const { textKey, namespace } = data

  const vectorStore = await PineconeStore.fromExistingIndex(openai.embeddings, {
    pineconeIndex,
    textKey,
    namespace,
  })

  return vectorStore
}
