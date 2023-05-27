import 'dotenv/config'
import md5 from 'md5'

export default async function translator(text, from = 'auto', to) {
  const url = `http://api.fanyi.baidu.com/api/trans/vip/translate`
  const salt = '1435660288'
  const BAIDU_APP_ID = '20230525001689481'
  const BAIDU_API_KEY = 'WIxI9X2a5Vsq93AU2yfg'
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
