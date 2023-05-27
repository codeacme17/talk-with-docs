import { OpenAI } from 'langchain/llms/openai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

import options from '../../utils/proxy.js'

export const openaiModel = (type, temperature = 0) => {
  switch (type) {
    case '3.5':
      return new OpenAI(
        {
          temperature,
          verbose: true,
          modelName: 'gpt-3.5-turbo',
        },
        {
          baseOptions: options,
        }
      )

    case 'chat-3.5':
      return new ChatOpenAI(
        {
          temperature,
          verbose: true,
          modelName: 'gpt-3.5-turbo',
        },
        {
          baseOptions: options,
        }
      )

    default:
      break
  }
}

export const embeddings = new OpenAIEmbeddings(
  {
    modelName: 'text-embedding-ada-002',
  },
  {
    baseOptions: options,
  }
)
