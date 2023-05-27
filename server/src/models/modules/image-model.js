import fs from 'fs'
import path from 'path'
import 'dotenv/config'

import translator from '../../utils/translator.js'
import { HfInference } from '@huggingface/inference'
import { fileURLToPath, URL } from 'url'
import { createDir } from '../../utils/share.js'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY, {
  use_gpu: true,
})
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const STATIC_DIR_PATH = path.resolve(__dirname, '../../../static')
const STATIC_IMAGE_DIR_PATH = path.resolve(__dirname, '../../../static/images')

export const initImage = async (files) => {
  const file = files[0]
  const filename = path.join(STATIC_IMAGE_DIR_PATH, file.originalname)
  createDir(STATIC_IMAGE_DIR_PATH)
  await fs.promises.writeFile(filename, file.buffer, 'utf-8')
}

export const chatImage = async (ctx) => {
  const { message, namespace } = ctx
  const FILE_PATH = path.join(STATIC_IMAGE_DIR_PATH, namespace)
  const question = await translator(message, 'zh', 'en')
  const buffer = await fs.promises.readFile(FILE_PATH)

  try {
    const response = await hf.visualQuestionAnswering({
      model: 'dandelin/vilt-b32-finetuned-vqa',
      inputs: {
        question: 'How many cats are lying down?',
        image: await (await fetch('https://placekitten.com/300/300')).blob(),
      },
    })

    console.log(response)
  } catch (err) {
    console.log(err)
  }

  const answer = await translator(response.answer, 'en', 'zh')
  return {
    text: answer,
  }
}

export const explainImage = async (file) => {
  const FILE_PATH = path.join(STATIC_DIR_PATH, file)
  const response = await hf.imageToText({
    model: 'nlpconnect/vit-gpt2-image-captioning',
    data: fs.readFileSync(FILE_PATH),
  })
  const answer = await translator(response.generated_text, 'en', 'zh')
  return {
    text: answer,
  }
}
