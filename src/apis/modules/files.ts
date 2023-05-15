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
}
