import { PlaywrightWebBaseLoader } from 'langchain/document_loaders/web/playwright'
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured'
import { fileURLToPath, URL } from 'url'
import path from 'path'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { JSONLoader, JSONLinesLoader } from 'langchain/document_loaders/fs/json'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { CSVLoader } from 'langchain/document_loaders/fs/csv'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const webLoader = async (url) => {
  const urlInfo = new URL(url)
  const origin = urlInfo.origin
  const path = urlInfo.pathname

  const loader = new PlaywrightWebBaseLoader(origin, {
    launchOptions: {
      headless: true,
    },
    async evaluate(page, browser) {
      let result = ''

      async function crawlPage(page, visitedUrls, baseUrl) {
        const currentUrl = page.url()
        if (visitedUrls.has(currentUrl)) return
        visitedUrls.add(currentUrl)

        const title = await page.title()
        result += title

        const hanlders = await page.$$('a')

        const links = await Promise.all(
          hanlders.map((hanlder) => hanlder.getAttribute('href'))
        )

        for (const link of links) {
          const parsedUrl = new URL(link, baseUrl)
          console.log(parsedUrl)
          if (parsedUrl.hostname === baseUrl.hostname) {
            const newPage = await browser.newPage()
            await newPage.goto(baseUrl + '/' + link)
            await crawlPage(newPage, visitedUrls, baseUrl)
            await newPage.close()
          }
        }
      }

      const visitedUrls = new Set()
      await page.goto(url)
      await crawlPage(page, visitedUrls, urlInfo)
      return result
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
