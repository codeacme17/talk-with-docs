import fsPromise from 'fs/promises'
import path from 'path'
import fs from 'fs'
import { URL } from 'url'
import { Document } from 'langchain/document'
import { PlaywrightWebBaseLoader } from 'langchain/document_loaders/web/playwright'
import { GithubRepoLoader } from 'langchain/document_loaders/web/github'
import { mdSpitter } from './splitter.js'
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured'
import { fileSplitter } from './splitter.js'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

import 'dotenv/config.js'

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
        ignoreFiles: [
          '.eslintrc.js',
          '.eslintignore',
          '.prettierrc',
          'LICENSE',
          'pnpm-lock.yaml',
          'tsconfig.json',
          'tsconfig.node.json',
          'vite.config.ts',
          '.editorconfig',
          'example/*',
          'docs/*',
          'lib/*',
          '.husky/*',
          '.github/*',
        ],
        accessToken: process.env.GITHUB_ACCESS_TOKEN,
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
      const filePath = path.join(filesPath, '/', file)
      const filename = path.basename(filePath)

      let rawDocs

      switch (fileType) {
        case '.docx':
          rawDocs = await markdownLoader(filesPath, file)
          break

        case '.md':
          rawDocs = await markdownLoader(filesPath, file)
          break

        case '.html':
          rawDocs = await htmlLoader(filePath, filename)
          break

        default:
          rawDocs = await defaultLoader(filePath, filename)
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

const htmlLoader = async (filePath, filename) => {
  const rawText = fs.readFileSync(filePath, 'utf-8')

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  })

  console.log(filename)

  const rawDocs = await splitter.createDocuments(
    [rawText],
    [
      {
        filename: filename,
      },
    ]
  )

  return rawDocs
}

const defaultLoader = async (filePath, filename) => {
  const loader = new UnstructuredLoader(filePath)

  let rawDocs = await loader.load()

  let temp
  rawDocs.forEach((doc) => {
    temp += doc.pageContent
  })

  const fallDoc = new Document({
    pageContent: temp,
    metadata: { filename: filename },
  })

  rawDocs = await fileSplitter([fallDoc])

  return rawDocs
}
