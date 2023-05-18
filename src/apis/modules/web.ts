import axios from 'axios'

export const WEB_API = {
  initWeb(data: { url: string; namespace: string; text: string }) {
    return axios({
      method: 'POST',
      url: '/api/initWeb',
      data,
    })
  },

  chatWeb(data: {
    message: string
    history: [string, string][] | []
    namespace: string
    text: string
  }) {
    return axios({
      method: 'POST',
      url: '/api/chatWeb',
      data,
    })
  },
}
