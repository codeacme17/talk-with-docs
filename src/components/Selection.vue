<template>
  <t-card class="border-none" :loading="loading">
    <t-form class="my-7" labelWidth="0">
      <t-form-item>
        <t-select
          v-model="formData.selection"
          placeholder="choose a type"
          @change="handleChange"
        >
          <t-option
            v-for="item in options"
            :label="item.label"
            :value="item.value"
          />
        </t-select>

        <t-button theme="default" class="ml-3 px-7" @click="handleChoose">
          CONFIRM
        </t-button>
      </t-form-item>

      <t-input-adornment
        prepend=" NAMESPACE "
        v-show="formData.selection === 'web' || formData.selection === 'files'"
      >
        <t-input placeholder="" v-model.trim="formData.namespace" />
      </t-input-adornment>

      <div class="my-5"></div>

      <t-input-adornment
        :prepend="protocolSelect"
        v-show="formData.selection === 'web'"
      >
        <t-input placeholder="" v-model.trim="formData.web" />
      </t-input-adornment>

      <t-upload
        v-show="formData.selection === 'files'"
        v-model="formData.files"
        multiple
        :autoUpload="false"
        allowUploadDuplicateFile
        class="mt-5"
      >
        <t-button theme="default"> CHOOSE FILE (allow multiple) </t-button>
      </t-upload>

      <t-upload
        ref="uploadRef1"
        v-show="formData.selection === 'image'"
        v-model="formData.files"
        theme="image"
        accept="image/*"
        :auto-upload="false"
        :locale="{
          triggerUploadText: {
            image: 'choose an image',
          },
        }"
      ></t-upload>
    </t-form>
  </t-card>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { useChatStore, type State } from '@/stores'
import { WEB_API, FILES_API, IMAGE_API } from '@/apis'

const chatStore = useChatStore()
const options = [
  {
    label: '🤖 Turbo',
    value: 'chat',
  },
  {
    label: '🌐 Web',
    value: 'web',
  },
  {
    label: '🗂️ Files',
    value: 'files',
  },
  {
    label: '🖼️ Image',
    value: 'image',
  },
]
const protocolSelect = ref(() => (
  <t-select
    autoWidth
    options={['https://', 'http://'].map((value) => ({
      label: value,
      value,
    }))}
    defaultValue="https://"
  />
))
const formData = reactive<State>({
  selection: '',
  web: '',
  files: [],
  namespace: '',
})

const handleChange = () => {
  formData.web = ''
  formData.files = []
  chatStore.selection = formData.selection
}

const loading = ref(false)
const handleChoose = async () => {
  loading.value = true
  chatStore.web = formData.web
  chatStore.files = formData.files

  await selectLoader()
  chatStore.selection = formData.selection
  chatStore.namespace = formData.namespace
}

const selectLoader = async () => {
  switch (formData.selection) {
    case 'web':
      if (formData.web) {
        await WEB_API.initWeb({
          url: `https://${formData.web}`,
          text: 'text',
          namespace: formData.namespace!,
        })
      }
      break

    case 'files':
      if (formData.files.length) {
        const _formData = new FormData()
        formData.files.forEach((file, index) => {
          const encodedFileName = encodeURIComponent(file.name as string)
          console.log(encodedFileName)
          _formData.append('files', file.raw!, encodedFileName)
        })
        _formData.append('namespace', formData.namespace!)

        await FILES_API.initFiles(_formData)
      }
      break

    case 'image':
      if (formData.files.length) {
        const _formData = new FormData()

        formData.files.forEach((file) => {
          formData.namespace = file.name
          const encodedFileName = encodeURIComponent(file.name as string)
          _formData.append('files', file.raw!, encodedFileName)
        })

        await IMAGE_API.initImage(_formData)
      }
      break

    default:
      break
  }
}
</script>
