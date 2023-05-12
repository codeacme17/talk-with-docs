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
    ref="chatRef"
  >
    <div v-show="!chatList.length">Send message to start 👇</div>

    <div class="">
      <div v-for="item in chatList" class="mb-4">
        <div
          v-show="item.role === 'robot'"
          class="mb-4 flex flex-col"
        >
          <header class="text-blue-500 flex item-center">
            <div class="text-xl">🤖</div>
            <div class="ml-2">ROBOT</div>
          </header>

          <div class="ml-9">{{ item.content }}</div>
        </div>

        <div v-show="item.role === 'user'">
          <header
            class="text-green-500 flex item-center flex-row-reverse"
          >
            <div class="text-xl">🧑</div>
            <div class="mr-2">YOU</div>
          </header>

          <div class="mr-9 text-right">
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

interface chatItem {
  id: string
  role: 'user' | 'robot'
  content: string
}

const chatStore = useChatStore()

const inputValue = ref('')
const chatList = reactive<chatItem[]>([])

const ctrlTrigger = ref(false)

const handleKeydown = (value: string, { e }: any) => {
  if (e.code === 'ControlLeft') ctrlTrigger.value = true

  if (ctrlTrigger.value && e.code === 'Enter') sendMessage()
}

const handleKeyup = (value: string, { e }: any) => {
  if (ctrlTrigger.value) ctrlTrigger.value = false
}

const sendMessage = () => {
  if (!inputValue.value) return
  chatList.push({
    id: nanoid(),
    role: 'user',
    content: inputValue.value,
  })
  inputValue.value = ''
  scrollToBottom()
}

const chatRef = ref<Element | null>(null)
const scrollToBottom = () => {
  const currentHeight = chatRef.value!.clientHeight

  nextTick(() => {
    chatRef.value?.scrollTo({
      top: currentHeight,
      behavior: 'smooth',
    })
  })
}
</script>
