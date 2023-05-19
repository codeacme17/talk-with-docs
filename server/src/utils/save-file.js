import fs from 'fs'

const saveFile = (namespace, fileInfo) => {
  console.log(fileInfo)
  const dirPath = `./sources/${namespace}`
  createDiv(dirPath)

  const { originalname } = fileInfo
  const filename = decodeURIComponent(originalname)

  fs.writeFileSync(`${dirPath}/${filename}`, fileInfo.buffer)
}

const createDiv = (dirPath) => {
  if (fs.existsSync(dirPath)) return

  fs.mkdirSync(dirPath)
}

export default saveFile
