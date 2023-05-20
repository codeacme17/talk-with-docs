import fsPromise from 'fs/promises'
import path from 'path'
import { URL } from 'url'
import { PlaywrightWebBaseLoader } from 'langchain/document_loaders/web/playwright'
import { GithubRepoLoader } from 'langchain/document_loaders/web/github'
import { mdSpitter } from './splitter.js'
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured'

export const webLoader = async (url) => {
  const urlInfo = new URL(url)
  const host = urlInfo.host

  let loader
  switch (host) {
    case 'github.com':
      loader = new GithubRepoLoader(url, {
        branch: 'main',
        recursive: true,
        unknown: 'warn',
      })
      break

    default:
      loader = new PlaywrightWebBaseLoader(url, {
        launchOptions: {
          headless: true,
        },
      })
      break
  }

  const rawDocs = await loader.load()

  console.log(rawDocs.length, 'raw docs')
  return rawDocs
}

export const filesLoader = async (filesPath) => {
  const files = await fsPromise.readdir(filesPath)
  const docs = []

  await Promise.all(
    files.map(async (file) => {
      const fileType = path.extname(file)
      let rawDocs
      switch (fileType) {
        case '.docx':
          rawDocs = await markdownLoader(filesPath, file)
          break

        case '.md':
          rawDocs = await markdownLoader(filesPath, file)
          break

        default:
          const filePath = path.join(filesPath, '/', file)
          const loader = new UnstructuredLoader(filePath)
          rawDocs = await loader.load()
          break
      }

      docs.push(...rawDocs)
    })
  )

  console.log(docs.length)

  return docs
}

const markdownLoader = async (filesPath, file) => {
  const filePath = path.join(filesPath, file)
  const fileContentBuffer = await fsPromise.readFile(filePath)
  const fileContent = fileContentBuffer.toString('utf-8')
  const rawDocs = await mdSpitter(fileContent, file)

  return rawDocs
}
