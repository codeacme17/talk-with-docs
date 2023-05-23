import { defineStore } from 'pinia'
import type { UploadFile } from 'tdesign-vue-next'

export interface State {
  selection: 'chat' | 'web' | 'files' | 'image' | ''
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
    getSelection(state) {
      console.log(state.selection)
      return state.selection
    },
    getWeb: (state) => state.web,
    getFiles: (state) => state.files,
    getNamespace: (state) => state.namespace,
  },
})
