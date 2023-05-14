import { PlaywrightWebBaseLoader } from 'langchain/document_loaders/web/playwright'

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
