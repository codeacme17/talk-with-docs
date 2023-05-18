import { OpenAI } from 'langchain/llms/openai'
import options from '../../utils/proxy.js'

export const openaiModel = () => {
  return new OpenAI(
    {
      temperature: 0.5,
      modelName: 'gpt-3.5-turbo',
    },
    {
      baseOptions: options,
    }
  )
}
