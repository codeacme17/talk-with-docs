import axios from '@/plugins/axios'
import { fetchEventSource } from '@microsoft/fetch-event-source'

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

  streamChat(data: ChatParams) {
    return fetchEventSource('/api/chat', {
      method: 'POST',
      headers: {
        Accept: 'text/event-stream',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      async onopen(res) {
        console.log(res)
      },
      onmessage(event) {
        console.log(event.data)
        const data = JSON.parse(event.data)
        const text: string = data
        console.log(text)
      },
      onclose() {
        console.log('close')
      },
    })
  },
}
