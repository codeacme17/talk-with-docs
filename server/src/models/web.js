import { webLoader } from '../loaders/index.js'
import splitter from '../utils/splitter.js'

const webModel = async (ctx) => {
  let data = await webLoader(ctx.url)
  data = await splitter(data)
  return data
}

export default webModel
