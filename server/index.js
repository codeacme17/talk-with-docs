import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'

import { webModel, chatModel } from './src/models/index.js'

const app = express()
const port = 1818

app.use(bodyParser.json())

// normal chat model router
app.post('/api/chat', async (req, res) => {
  const data = await chatModel(req.body)

  res.status(200).json({
    data: data,
  })
})

// init web, when select a web
app.post('/api/initWeb', async (req, res) => {
  const data = await webModel.initWeb(req.body)

  res.status(200).json({
    data: data,
  })
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
