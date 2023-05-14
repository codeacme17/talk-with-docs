import { webLoader } from '../../loaders/modules/index.js'
import splitter from '../../utils/splitter.js'

export const webModel = async (ctx) => {
  let data = await webLoader(ctx.url)
  data = await splitter(data)
  return data
}
