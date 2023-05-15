import { PlaywrightWebBaseLoader } from 'langchain/document_loaders/web/playwright'
import { UnstructuredLoader } from 'langchain/document_loaders/fs/unstructured'
import path from 'path'
import { fileURLToPath, URL } from 'url'
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
      return result·
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
