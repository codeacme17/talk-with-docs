import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const splitter = async (rawDocs) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const docs = await splitter.splitDocuments(rawDocs)

  return docs
}

export default splitter
