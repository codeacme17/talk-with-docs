import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import 'dotenv/config'
import { fileURLToPath, URL } from 'url'
import { webModel, chatModel, fileModel } from './src/models/index.js'

const app = express()
const port = 8888

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const staticDir = path.join(__dirname, '/static')

app.use(express.static(staticDir))
app.use(bodyParser.json())

// normal chat model router
app.post('/api/chat', async (req, res) => {
  const data = await chatModel(req.body)

  res.status(200).json({
    data,
  })
})

//
/* 
  init web, when select a web
  params: url
          namespace
          text
*/
app.post('/api/initWeb', async (req, res) => {
  const data = await webModel.initWeb(req.body)

  res.status(200).json({
    data,
  })
})

/* 
  chat with web
  params: message
          history
          text
          namespace
*/
app.post('/api/chatWeb', async (req, res) => {
  const data = await webModel.chatWeb(req.body)

  res.status(200).json({
    data,
  })
})

/* 
  init files
  params: namespace
          files
  header: multipart/form-data
*/
const upload = multer()
app.post('/api/initFiles', upload.array('files'), async (req, res) => {
  await fileModel.initFiles(req.body, req.files)

  res.json({
    message: 'success',
  })
})

app.post('/api/chatFiles', async (req, res) => {
  const data = await fileModel.chatFiles(req.body)

  res.status(200).json({
    data,
  })
})

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
