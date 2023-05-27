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
import { openaiModel } from './openai-model.js'

export const chatModel = async (ctx) => {
  const { prompt, history } = ctx

  const chat = openaiModel(3.5)

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
