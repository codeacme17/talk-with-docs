import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanChatMessage } from 'langchain/schema'
import options from '../../utils/agent.js'

export const chatModel = async (ctx) => {
  const { prompt } = ctx
  const chat = new ChatOpenAI(
    { temperature: 0 },
    {
      baseOptions: options,
    }
  )
  const response = await chat.call([new HumanChatMessage(prompt)])
  return response
}
