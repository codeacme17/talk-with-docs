import express from 'express'
import bodyParser from 'body-parser'
import webModel from './src/models/web.js'
import chatModel from './src/models/chat.js'
import 'dotenv/config'

const app = express()
const port = 1818

app.use(bodyParser.json())

app.post('/api/chat', async (req, res) => {
  const data = await chatModel(req.body)

  res.status(200).json({
    data: data,
  })
})

app.post('/api/chooseWeb', async (req, res) => {
  const data = await webModel(req.body)

  res.status(200).json({
    data: data,
  })
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
