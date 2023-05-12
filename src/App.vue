<template>
  <section
    class="w-[60%] min-w-[600px] mx-auto pt-7 flex flex-col min-h-screen"
  >
    <header class="flex items-center mb-7">
      <logo />
      <div class="ml-5">
        <div class="text-xl">TALK WITH FILE & WEB</div>
        <div>
          powered by
          <t-link
            class="font-black"
            href="https://js.langchain.com/docs/"
            target="_blank"
          >
            langchain
          </t-link>
        </div>
      </div>
    </header>

    <Selection v-if="!chatStore.web && !chatStore.files.length" />

    <Chat class="my-5" />
  </section>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores'

const chatStore = useChatStore()

document.documentElement.setAttribute('theme-mode', 'dark')
</script>
