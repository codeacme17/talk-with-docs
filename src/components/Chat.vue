<template>
  <div class="flex items-center">
    <t-button
      shape="circle"
      variant="text"
      theme="dark"
      class="mr-2"
      @click="handleBack"
    >
      <template #icon> <left-arrow /> </template>
    </t-button>

    <div v-if="chatStore.selection === 'chat'">
      now, you are chatting with <strong>Turbo</strong>
    </div>

    <div v-else>
      now, you are chatting with <strong>{{ chatStore.namespace }}</strong>
    </div>
  </div>

  <t-card
    class="border-none my-3 py-3 overflow-y-scroll"
    style="max-height: calc(100vh - 280px)"
    id="chatContainer"
  >
    <div v-show="!chatList.length">Send message to start 👇</div>

    <div class="">
      <div v-for="item in chatList" class="mb-3">
        <div v-show="item.role === 'robot'" class="flex flex-col pr-32">
          <header class="text-blue-500 flex item-center">
            <div class="text-xl">🤖</div>
            <div class="ml-2">ROBOT</div>
          </header>

          <div class="ml-9 animate-pulse" v-if="item.loading">
            <div class="h-5 bg-slate-700 rounded col-span-2"></div>
          </div>

          <div class="ml-9" v-else v-html="item.content"></div>

          <div
            class="flex flex-wrap w-full mt-3 ml-9"
            v-show="!!item.sources?.length"
          >
            <t-divider align="left" class="mb-1 mt-2 text-gray-500 pr-10">
              参考
            </t-divider>

            <div class="mt-2 flex flex-wrap">
              <div v-for="source of item.sources">
                <t-tooltip
                  theme="success"
                  :delay="500"
                  :content="source.metadata.filename || source.metadata.source"
                >
                  <t-tag
                    max-width="280"
                    theme="success"
                    class="mr-3 mb-2 cursor-pointer"
                    @click="handleClickTag(source)"
                  >
                    {{ source.metadata.filename || source.metadata.source }}
                  </t-tag>
                </t-tooltip>
              </div>
            </div>
          </div>
        </div>

        <div v-show="item.role === 'user'">
          <header class="text-green-500 flex item-center flex-row-reverse">
            <div class="text-xl">🧑</div>
            <div class="mr-2">YOU</div>
          </header>

          <div class="mr-9 ml-32 text-right">
            {{ item.content }}
          </div>
        </div>
      </div>
    </div>
  </t-card>

  <div class="flex items-baseline bottom-0">
    <t-textarea
      placeholder="press 'ctrl' + 'enter' to send"
      autosize
      class="mr-3"
      v-model.trim="inputValue"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
      autofocus
    />

    <t-button
      theme="default"
      size="large"
      style="height: 35px; width: 100px"
      @click="sendMessage"
      :disabled="!inputValue"
    >
      SEND
    </t-button>
  </div>

  <t-dialog
    v-model:visible="visible"
    :closeOnEscKeydown="false"
    :footer="false"
    :destroyOnClose="true"
    width="800px"
    top="100px"
    class="pl-2"
  >
    <template #header>{{ dialogTitle }}</template>
    <div v-html="dialogContent" class="max-h-[600px] pr-3"></div>
  </t-dialog>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { nanoid } from 'nanoid'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import markdownItAttrs from 'markdown-it-attrs'
import { useChatStore } from '@/stores'
import { CHAT_API, WEB_API, FILES_API, IMAGE_API } from '@/apis'

interface ChatItem {
  id: string
  role: 'user' | 'robot'
  content: string
  loading?: boolean
  sources?: any[]
}

const chatStore = useChatStore()

const handleBack = () => {
  chatStore.namespace = ''
  chatStore.selection = ''
}

const ctrlTrigger = ref(false)
const handleKeydown = (value: string, { e }: any) => {
  if (e.code === 'ControlLeft') ctrlTrigger.value = true
  if (ctrlTrigger.value && e.code === 'Enter') sendMessage()
}
const handleKeyup = (value: string, { e }: any) => {
  if (ctrlTrigger.value) ctrlTrigger.value = false
}

const inputValue = ref('')
const chatList = reactive<ChatItem[]>([])

onMounted(() => {
  if (chatStore.selection !== 'chat') {
    chatList.push({
      id: nanoid(),
      role: 'robot',
      content: `很高兴能为您提供帮助，您现在正在与 “${chatStore.namespace}” 沟通，您可以进行询提问，我会尽力为您解答`,
    })
  }
})

let messageHitory: [string, string][] = []
let historyChatMessage = ''

const sendMessage = () => {
  if (!inputValue.value) return

  chatList.push({
    id: nanoid(),
    role: 'user',
    content: inputValue.value,
  })

  historyChatMessage = inputValue.value

  scrollToBottom()
  reciveMessage()

  inputValue.value = ''
}

const reciveMessage = async () => {
  chatList.push({
    id: nanoid(),
    role: 'robot',
    content: '',
    loading: true,
  })

  const res = await fetchRobotMessage()
  const content = res.text.replace(/\。$/, '')
  if (messageHitory.length > 5) messageHitory.shift()
  messageHitory.push([historyChatMessage, content])
  chatList[chatList.length - 1].content = toMarkdown(content)
  chatList[chatList.length - 1].loading = false
  chatList[chatList.length - 1].sources = res.sourceDocuments
  scrollToBottom()
}

const fetchRobotMessage = async () => {
  let res: any

  if (chatStore.selection === 'chat') {
    let temp = (await CHAT_API.chat({
      prompt: inputValue.value,
      history: messageHitory,
    })) as any
    res = temp.data
  }

  if (chatStore.selection === 'web') {
    res = await WEB_API.chatWeb({
      message: inputValue.value,
      history: messageHitory,
      text: 'text',
      namespace: chatStore.namespace!,
    })
    res = res.data
  }

  if (chatStore.selection === 'files') {
    res = await FILES_API.chatFiles({
      message: inputValue.value,
      history: messageHitory,
      text: 'text',
      namespace: chatStore.namespace!,
    })
    res = res.data
  }

  if (chatStore.selection === 'image') {
    res = await IMAGE_API.chatImage({
      message: inputValue.value,
      namespace: chatStore.namespace!,
    })
    res = res.data
  }

  return res
}

const toMarkdown = (text: string) => {
  const md = new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value
        } catch (__) {}
      }
      return ''
    },
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
  })

  md.use(markdownItAttrs, {
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: [], // empty array = all attributes are allowed
  })
  const res = md.render(text)
  return res
}

const scrollToBottom = () => {
  const el = document.getElementById('chatContainer')
  const currentHeight = el!.scrollHeight

  nextTick(() => {
    el!.scrollTo({
      top: currentHeight,
      left: 0,
      behavior: 'smooth',
    })
  })
}

const visible = ref(false)
const dialogContent = ref('')
const dialogTitle = ref('')

const handleClickTag = (source: any) => {
  const md = new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value
        } catch (__) {}
      }
      return ''
    },
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
  })
  const res = md.render(source.pageContent)
  dialogContent.value = res
  dialogTitle.value = source.metadata.filename || source.metadata.source
  visible.value = true
}
</script>
