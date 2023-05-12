import { defineStore } from 'pinia'
import type { UploadFile } from 'tdesign-vue-next'

interface State {
  web: string
  files: UploadFile[]
}

export const useChatStore = defineStore('chat', {
  state: (): State => ({
    web: '',
    files: [],
  }),

  getters: {
    getWeb: (state) => state.web,
    getFiles: (state) => state.files,
  },
})
