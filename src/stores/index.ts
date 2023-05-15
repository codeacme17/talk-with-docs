import { defineStore } from 'pinia'
import type { UploadFile } from 'tdesign-vue-next'

export interface State {
  selection: 'chat' | 'web' | 'files' | ''
  web: string
  files: UploadFile[]
  namespace?: string
}

export const useChatStore = defineStore('chat', {
  state: (): State => ({
    selection: '',
    web: '',
    files: [],
    namespace: '',
  }),

  getters: {
    getSelection: (state) => state.selection,
    getWeb: (state) => state.web,
    getFiles: (state) => state.files,
    getCurrentNamespace: (state) => state.namespace,
  },
})
