import fs from 'fs'
import path from 'path'
import { nanoid } from 'nanoid'

const saveFile = (namespace, fileInfo) => {
  const dirPath = `./sources/${namespace}`

  createDiv(dirPath)

  const { originalname } = fileInfo
  const fileExtension = path.extname(originalname)
  const id = nanoid()

  const filename = `${id}.${fileExtension}`

  fs.writeFileSync(`${dirPath}/${filename}`, fileInfo.buffer)
}

const createDiv = (dirPath) => {
  if (fs.existsSync(dirPath)) return

  fs.mkdirSync(dirPath)
}

export default saveFile
