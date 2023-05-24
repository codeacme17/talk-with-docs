import fs from 'fs'
import fsPromise from 'fs/promises'
import path from 'path'
import cheerio from 'cheerio'
import { execa } from 'execa'
import { fileURLToPath, URL } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const SOURCES_DIR_PATH = path.resolve(__dirname, '../../sources')

let dirPath
let rawFilename
let fileBuffer

const saveFile = async (namespace, fileInfo) => {
  dirPath = path.resolve(SOURCES_DIR_PATH, namespace)
  namespace = namespace
  createDiv()
  await save(fileInfo, namespace)
}

const save = async (fileInfo, namespace) => {
  const { originalname } = fileInfo
  const fileType = path.extname(originalname)
  rawFilename = path.basename(originalname, fileType)
  fileBuffer = fileInfo.buffer

  switch (fileType) {
    case '.docx':
      await parseDocx(dirPath, namespace)
      break

    default:
      await fsPromise.writeFile(
        `${dirPath}/${decodeURIComponent(rawFilename)}${fileType}`,
        fileBuffer,
        'utf-8'
      )
      break
  }
}

const parseDocx = async (dirPath, namespace) => {
  const source = path.join(dirPath, `${decodeURIComponent(rawFilename)}.docx`)
  const target = path.join(dirPath, `${decodeURIComponent(rawFilename)}.html`)

  await fsPromise.writeFile(source, fileBuffer, 'utf-8')
  await execa('pandoc', [
    '-s',
    source,
    '-o',
    target,
    `--extract-media=./static/images/${namespace}`,
  ])

  await parseHTML(target)
  fs.rmSync(source)
}

const parseHTML = async (target) => {
  const html = fs.readFileSync(target, 'utf8')
  const $ = cheerio.load(html)

  const images = $('img')

  images.each((index, element) => {
    const img = $(element)
    let originalSrc = img.attr('src')

    originalSrc = originalSrc.replace('./static', '')

    const newSrc = 'http://localhost:8888' + originalSrc

    img.attr('src', newSrc)
  })

  await fsPromise.writeFile(target, $.html(), 'utf8')
}

const createDiv = async () => {
  if (fs.existsSync(dirPath)) return
  else fs.mkdirSync(dirPath)
}

export default saveFile
