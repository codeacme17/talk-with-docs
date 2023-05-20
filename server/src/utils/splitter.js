import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MarkdownTextSplitter } from 'langchain/text_splitter'

export const fileSplitter = async (rawDocs) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  })

  const docs = await splitter.splitDocuments(rawDocs)
  return docs
}

export const mdSpitter = async (rawDocs, filename) => {
  const splitter = new MarkdownTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  })

  const docs = await splitter.createDocuments(
    [rawDocs],
    [
      {
        filename: decodeURIComponent(filename),
      },
    ]
  )

  return docs
}

export const webSplitter = async (rawDocs) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 0,
  })

  const docs = await splitter.splitDocuments(rawDocs)
  return docs
}
