import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanChatMessage } from 'langchain/schema'

import options from '../../utils/proxy.js'

export const chatModel = async (ctx) => {
  const { prompt } = ctx

  const chat = new ChatOpenAI(
    {
      temperature: 0.9,
      modelName: 'gpt-3.5-turbo',
      streaming: false,
    },
    {
      baseOptions: options,
    }
  )

  const response = await chat.call([new HumanChatMessage(prompt)], undefined, [
    {
      handleLLMNewToken(token) {
        console.log({ token })
      },
    },
  ])

  console.log(response)
  return response
}
