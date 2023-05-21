import { OpenAI } from 'langchain/llms/openai'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

import options from '../../utils/proxy.js'

export const openaiModel = (type) => {
  switch (type) {
    case '3.5':
      return new OpenAI(
        {
          temperature: 0,
          modelName: 'gpt-3.5-turbo',
          verbose: true,
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
  {},
  {
    baseOptions: options,
  }
)
