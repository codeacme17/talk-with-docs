import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

export const fileSplitter = async (rawDocs) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 0,
  })

  const docs = await splitter.splitDocuments(rawDocs)
  console.log(docs.length, 'splitted')
  return docs
}

export const webSplitter = async (rawDocs) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 5000,
    chunkOverlap: 0,
  })

  const docs = await splitter.splitDocuments(rawDocs)
  console.log(docs.length, 'splitted')
  return docs
}
