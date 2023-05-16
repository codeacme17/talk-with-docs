import { OpenAI } from 'langchain/llms/openai'
import options from '../../utils/agent.js'

export const openaiModel = () => {
  return new OpenAI(
    {
      temperature: 0,
      modelName: 'gpt-3.5-turbo',
    },
    {
      baseOptions: options,
    }
  )
}
