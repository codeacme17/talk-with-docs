import fs from 'fs'

export const recall = async (func, maxRetries = 3) => {
  let retries = 0

  while (retries < maxRetries) {
    try {
      return await func()
    } catch (error) {
      console.error('An error occurred:', error)
      retries++
      console.log(`Retrying (${retries}/${maxRetries})...`)
    }
  }
  throw new Error(`Failed after ${maxRetries} retries.`)
}

export const createDir = (DIR_PATH) => {
  if (fs.existsSync(DIR_PATH)) return
  else fs.mkdirSync(DIR_PATH)
}
