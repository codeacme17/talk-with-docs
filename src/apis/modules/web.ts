import axios from 'axios'

export const WEB_API = {
  web(data: string[]) {
    return axios({
      method: 'GET',
      url: '/api/test',
    })
  },
}
