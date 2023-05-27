import fs from 'fs'

export const createDir = (DIR_PATH) => {
  if (fs.existsSync(DIR_PATH)) return
  else fs.mkdirSync(DIR_PATH)
}
