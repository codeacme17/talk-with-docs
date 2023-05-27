import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

export const fileSplitter = async (rawDocs, chunkSize) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: chunkSize,
    chunkOverlap: 0,
  })
  const docs = await splitter.splitDocuments(rawDocs)
  return docs
}

export const webSplitter = async (rawDocs) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  })
  const docs = await splitter.splitDocuments(rawDocs)
  return docs
}
