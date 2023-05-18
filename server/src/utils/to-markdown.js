import TurndownService from 'turndown'
import fs from 'fs'
import path from 'path'
import * as url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const toMarkdown = (docs, namespace) => {
  const turndownService = new TurndownService()
  const mdDocs = turndownService.turndown(docs[0].pageContent)
  saveFile(namespace, mdDocs)
}

const saveFile = (fileName, content) => {
  const filePath = path.resolve(__dirname, `../../sources/${fileName}.md`)

  fs.writeFileSync(filePath, content)
}

export default toMarkdown
