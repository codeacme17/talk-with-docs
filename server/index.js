import express from 'express'
import bodyParser from 'body-parser'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanChatMessage } from 'langchain/schema'
import { SocksProxyAgent } from 'socks-proxy-agent'
import 'dotenv/config'

import { webLoader } from './src/loaders/index.js'

const agent = new SocksProxyAgent('socks5://127.0.0.1:1086')
const app = express()
const port = 1818
const options = {
  httpsAgent: agent,
  httpAgent: agent,
}

app.use(bodyParser.json())

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body
  const chat = new ChatOpenAI(
    { temperature: 0 },
    {
      baseOptions: options,
    }
  )
  const response = await chat.call([new HumanChatMessage(prompt)])

  res.status(200).json({
    content: response.text,
  })
})

app.post('/api/chooseWeb', async (req, res) => {
  const { url } = req.body

  const data = await webLoader(url)

  console.log(data)

  res.status(200).json({
    content: data,
  })
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
