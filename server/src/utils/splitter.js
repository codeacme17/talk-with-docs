import { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const splitter = async (text) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const docOutput = await splitter.splitDocuments([
    new Document({ pageContent: text }),
  ])

  return docOutput
}

export default splitter
