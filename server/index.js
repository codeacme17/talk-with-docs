import express from 'express'
import bodyParser from 'body-parser'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanChatMessage } from 'langchain/schema'
import { SocksProxyAgent } from 'socks-proxy-agent'
import 'dotenv/config'

const agent = new SocksProxyAgent('socks5://127.0.0.1:1086')
const app = express()
const port = 1818
const options = {
  httpsAgent: agent,
  httpAgent: agent,
}
const chat = new ChatOpenAI(
  { temperature: 0 },
  {
    baseOptions: options,
  }
)

app.use(bodyParser.json())

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body
  const response = await chat.call([new HumanChatMessage(prompt)])

  res.status(200).json({
    content: response.text,
  })
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
