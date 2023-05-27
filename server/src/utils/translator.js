import md5 from 'md5'
import 'dotenv/config'

export default async function translator(text, from = 'auto', to) {
  if (!process.env.BAIDU_APP_ID || !process.env.BAIDU_API_KEY) return text

  const url = `http://api.fanyi.baidu.com/api/trans/vip/translate`
  const salt = '1435660288'
  const BAIDU_APP_ID = process.env.BAIDU_APP_ID
  const BAIDU_API_KEY = process.env.BAIDU_API_KEY
  const mes = BAIDU_APP_ID + text + salt + BAIDU_API_KEY
  const sign = md5(mes)

  const formData = new URLSearchParams()
  formData.append('q', text)
  formData.append('from', from)
  formData.append('to', to)
  formData.append('appid', BAIDU_APP_ID)
  formData.append('salt', salt)
  formData.append('sign', sign)

  const res = await (
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })
  ).json()

  return res.trans_result[0].dst
}
