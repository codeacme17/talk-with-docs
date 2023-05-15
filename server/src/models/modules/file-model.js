import { filesLoader } from '../../utils/loaders.js'
import splitter from '../../utils/splitter.js'

export const initFiles = async (ctx) => {
  const { files } = ctx

  const rawDocs = await filesLoader(files)
  const docs = await splitter(rawDocs)

  console.log(docs)
}
