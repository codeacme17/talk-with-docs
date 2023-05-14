import axios from '@/plugins/axios'

interface ChatParams {
  prompt: string
}

export const CHAT_API = {
  chat(data: ChatParams) {
    return axios({
      method: 'POST',
      url: '/api/chat',
      data,
    })
  },
}
