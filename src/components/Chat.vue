<template>
  <t-card class="border-none pb-5 pt-3">
    <div class="mb-10">
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

    <div class="mt-3 flex items-baseline">
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
      >
        SEND
      </t-button>
    </div>
  </t-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { nanoid } from 'nanoid'

const inputValue = ref('')

const chatList = reactive([
  {
    id: nanoid(),
    role: 'user',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit quam delectus maxime deleniti harum distinctio amet officia ipsum deserunt, ab in et quaerat animi. Sunt, modi. Quae aliquid delectus explicabo.',
  },
  {
    id: nanoid(),
    role: 'robot',
    content:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo fugiat explicabo rerum vero non maiores eum ut nobis, unde quaerat repellat cupiditate voluptatibus reprehenderit corrupti tenetur enim. Adipisci, iure doloremque.',
  },
  {
    id: nanoid(),
    role: 'user',
    content:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit quam delectus maxime deleniti harum distinctio amet officia ipsum deserunt, ab in et quaerat animi. Sunt, modi. Quae aliquid delectus explicabo.',
  },
])

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
}
</script>
