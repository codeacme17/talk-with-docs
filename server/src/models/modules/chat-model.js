import { ChatOpenAI } from 'langchain/chat_models/openai'
import { LLMChain } from 'langchain/chains'
import {
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
  AIMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts'

import options from '../../utils/proxy.js'
import {
  CHAT_AI_PROMPT,
  CHAT_SYSTEM_PROMPT,
} from '../../constants/templates.js'

export const chatModel = async (ctx) => {
  const { prompt, history } = ctx

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

  const translationPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(CHAT_SYSTEM_PROMPT),
    HumanMessagePromptTemplate.fromTemplate('{question}'),
    AIMessagePromptTemplate.fromTemplate(CHAT_AI_PROMPT),
  ])

  const chain = new LLMChain({
    prompt: translationPrompt,
    llm: chat,
    verbose: true,
  })

  const response = await chain.call({
    chat_history: history,
    question: prompt,
  })

  console.log(response)
  return response
}
