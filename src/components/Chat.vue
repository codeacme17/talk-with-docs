<template>
  <div v-if="!!chatStore.web">
    now, you are chatting with <strong>{{ chatStore.web }}</strong>
  </div>
  <div v-if="chatStore.files.length" class="">
    now, you are chatting with <strong>file</strong>
  </div>

  <t-card
    class="border-none my-3 py-3 overflow-y-scroll"
    style="max-height: calc(100vh - 280px)"
    id="chatContainer"
  >
    <div v-show="!chatList.length">Send message to start 👇</div>

    <div class="">
      <div v-for="item in chatList" class="mb-3">
        <div v-show="item.role === 'robot'" class="flex flex-col">
          <header class="text-blue-500 flex item-center">
            <div class="text-xl">🤖</div>
            <div class="ml-2">ROBOT</div>
          </header>

          <div class="ml-9 mr-32 animate-pulse" v-if="item.loading">
            <div class="h-5 bg-slate-700 rounded col-span-2"></div>
          </div>
          <div class="ml-9 mr-32" v-else>{{ item.content }}</div>
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
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { nanoid } from 'nanoid'
import { useChatStore } from '@/stores'
import { HumanChat } from '@/apis'

interface chatItem {
  id: string
  role: 'user' | 'robot'
  content: string
  loading?: boolean
}

const chatStore = useChatStore()
const inputValue = ref('')
const chatList = reactive<chatItem[]>([])
const sendMessage = () => {
  if (!inputValue.value) return
  chatList.push({
    id: nanoid(),
    role: 'user',
    content: inputValue.value,
  })
  inputValue.value = ''
  scrollToBottom()
  reciveMessage()
}

const reciveMessage = async () => {
  chatList.push({
    id: nanoid(),
    role: 'robot',
    content: '',
    loading: true,
  })
  const res = await fetchRobotMessage()
  chatList[chatList.length - 1].content = res
  chatList[chatList.length - 1].loading = false
  scrollToBottom()
}

// DUMMY
const fetchRobotMessage = async () => {
  const res = await HumanChat(inputValue.value)
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

const ctrlTrigger = ref(false)
const handleKeydown = (value: string, { e }: any) => {
  if (e.code === 'ControlLeft') ctrlTrigger.value = true
  if (ctrlTrigger.value && e.code === 'Enter') sendMessage()
}
const handleKeyup = (value: string, { e }: any) => {
  if (ctrlTrigger.value) ctrlTrigger.value = false
}
</script>
