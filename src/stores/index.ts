import { defineStore } from 'pinia'
import type { UploadFile } from 'tdesign-vue-next'

interface State {
  selection: 'chat' | 'web' | 'files' | ''
  web: string
  files: UploadFile[]
}

export const useChatStore = defineStore('chat', {
  state: (): State => ({
    selection: '',
    web: '',
    files: [],
  }),

  getters: {
    getSelection: (state) => state.selection,
    getWeb: (state) => state.web,
    getFiles: (state) => state.files,
  },
})
