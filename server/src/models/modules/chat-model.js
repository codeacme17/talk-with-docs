import { HumanChatMessage } from 'langchain/schema'
import { openaiModel } from './openai-model.js'

export const chatModel = async (ctx) => {
  const { prompt, history } = ctx
  const model = openaiModel('chat-3.5', 0.9)
  const response = await model.call([new HumanChatMessage(prompt)])

  return response
}
