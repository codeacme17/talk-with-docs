import { Document } from 'langchain/document'
import { CharacterTextSplitter } from 'langchain/text_splitter'

const text = 'foo bar baz 123'
const splitter = new CharacterTextSplitter({
  separator: ' ',
  chunkSize: 7,
  chunkOverlap: 3,
})
const output = await splitter.createDocuments([text])
