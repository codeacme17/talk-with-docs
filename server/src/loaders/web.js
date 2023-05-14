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

  const docs = await loader.load()

  return docs
}
