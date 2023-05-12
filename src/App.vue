<template>
  <section class="w-[60%] min-w-[600px] mx-auto pt-7">
    <header class="flex items-center mb-7">
      <logo />
      <div class="ml-5">
        <div class="text-xl">CHAT WITH FILE & WEB</div>
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

    <Selection />

    <Chat class="my-5" />
  </section>
</template>

<script setup lang="ts">
document.documentElement.setAttribute('theme-mode', 'dark')
</script>
