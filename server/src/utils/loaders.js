import { PlaywrightWebBaseLoader } from 'langchain/document_loaders/web/playwright'
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured'
import path from 'path'
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export const webLoader = async (url) => {
  const loader = new PlaywrightWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: 'domcontentloaded',
    },
  })

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
