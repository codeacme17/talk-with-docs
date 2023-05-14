import axios from 'axios'

axios.interceptors.response.use(
  (res) => {
    if (res.status === 200) return res.data
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default axios
