import axios from 'axios'

export const IMAGE_API = {
  initImage(data: FormData) {
    return axios({
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
      method: 'POST',
      url: '/api/initImage',
      data,
    })
  },

  chatImage(data: { message: string; namespace: string }) {
    return axios({
      method: 'POST',
      url: '/api/chatImage',
      data,
    })
  },
}
