import path from 'path'
import { fileURLToPath, URL } from 'url'
import { PlaywrightWebBaseLoader } from 'langchain/document_loaders/web/playwright'
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured'
import { GithubRepoLoader } from 'langchain/document_loaders/web/github'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { JSONLoader, JSONLinesLoader } from 'langchain/document_loaders/fs/json'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { CSVLoader } from 'langchain/document_loaders/fs/csv'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const webLoader = async (url) => {
  const urlInfo = new URL(url)
  const host = urlInfo.host

  let loader
  if (host === 'github.com') {
    loader = new GithubRepoLoader(url, {
      branch: 'main',
      recursive: true,
      unknown: 'warn',
    })
  } else {
    loader = new PlaywrightWebBaseLoader(url, {
      launchOptions: {
        headless: true,
      },
    })
  }

  const rawDocs = await loader.load()
  return rawDocs
}

export const mdLoader = async (fileName) => {
  const loader = new UnstructuredLoader(
    path.resolve(__dirname, `../../sources/${fileName}.md`)
  )

  const rawDocs = await loader.load()

  return rawDocs
}

export const filesLoader = async (filesPath) => {
  const loader = new DirectoryLoader(filesPath, {
    '.json': (path) => new JSONLoader(path, '/texts'),
    '.jsonl': (path) => new JSONLinesLoader(path, '/html'),
    '.txt': (path) => new TextLoader(path),
    '.csv': (path) => new CSVLoader(path, 'text'),
    '.docx': (path) => new DocxLoader(path),
    '.pdf': (path) => new PDFLoader(path),
  })

  const docs = await loader.load()
  console.log({ docs })

  return docs
}

export const docxLoader = async (file) => {
  const loader = new DocxLoader(file)
  const docs = await loader.load()
  return docs
}
