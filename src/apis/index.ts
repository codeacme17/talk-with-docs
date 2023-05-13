import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema'

const chat = new ChatOpenAI({ temperature: 0, streaming: true })

export async function HumanChat(prompt: string): Promise<string> {
  const response = await chat.call([
    new SystemChatMessage(
      'You are a helpful assistant that translates English to French.'
    ),
    new HumanChatMessage(prompt),
  ])
  return response.text
}
