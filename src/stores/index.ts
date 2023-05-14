import { defineStore } from 'pinia'
import type { UploadFile } from 'tdesign-vue-next'
import type { Document } from 'langchain/document'

export interface State {
  selection: 'chat' | 'web' | 'files' | ''
  web: string
  files: UploadFile[]
  docs?: Document<Record<string, any>>[]
}

export const useChatStore = defineStore('chat', {
  state: (): State => ({
    selection: '',
    web: '',
    files: [],
    docs: [],
  }),

  getters: {
    getSelection: (state) => state.selection,
    getWeb: (state) => state.web,
    getFiles: (state) => state.files,
    getDocs: (state) => state.docs,
  },
})
