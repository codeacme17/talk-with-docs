import fs from 'fs'
import fsPromise from 'fs/promises'
import path from 'path'
import { execa } from 'execa'
import { fileURLToPath, URL } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const SOURCES_DIR_PATH = path.resolve(__dirname, '../../sources')

const saveFile = async (namespace, fileInfo) => {
  const dirPath = path.resolve(SOURCES_DIR_PATH, namespace)
  createDiv(dirPath)
  await save(fileInfo, dirPath)
}

const save = async (fileInfo, dirPath) => {
  const { originalname } = fileInfo
  const fileType = path.extname(originalname)
  const rawFilename = path.basename(originalname, fileType)
  const fileBuffer = fileInfo.buffer

  switch (fileType) {
    case '.docx':
      await parseDocx(dirPath, rawFilename, fileBuffer)
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

const parseDocx = async (dirPath, rawFilename, fileBuffer) => {
  const target = path.join(dirPath, `${decodeURIComponent(rawFilename)}.docx`)
  const mdPath = path.join(dirPath, `${decodeURIComponent(rawFilename)}.md`)

  await fsPromise.writeFile(target, fileBuffer, 'utf-8')
  await execa('pandoc', ['-f', 'docx', '-t', 'markdown', target, '-o', mdPath])
  fs.rmSync(target)
}

const createDiv = async (dirPath) => {
  if (fs.existsSync(dirPath)) return
  else fs.mkdirSync(dirPath)
}

export default saveFile
