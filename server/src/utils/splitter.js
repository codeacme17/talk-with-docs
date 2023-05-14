import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const splitter = async (text) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const docs = await splitter.splitDocuments(text)

  return docs
}

export default splitter
