import axios from 'axios'

export const FILES_API = {
  initFiles(data: FormData) {
    return axios({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      url: '/api/initFiles',
      data,
    })
  },

  chatFiles(data: {
    message: string
    history: string[]
    namespace: string
    text: string
  }) {
    return axios({
      method: 'POST',
      url: '/api/chatFiles',
      data,
    })
  },
}
