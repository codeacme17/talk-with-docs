<template>
  <t-card class="border-none" :loading="loading">
    <t-form class="my-7" labelWidth="0">
      <t-form-item>
        <t-select
          v-model="formData.selection"
          placeholder=""
          @change="handleChange"
        >
          <t-option
            v-for="item in options"
            :label="item.label"
            :value="item.value"
          />
        </t-select>

        <t-button
          theme="default"
          class="ml-3 px-7"
          :disabled="!formData.files.length && !formData.web"
          @click="handleChoose"
        >
          FEED TO LANGCHAIN
        </t-button>
      </t-form-item>

      <t-input-adornment
        :prepend="protocolSelect"
        v-show="formData.selection === 'web'"
      >
        <t-input placeholder="" v-model.trim="formData.web" />
      </t-input-adornment>

      <t-upload
        action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        v-show="formData.selection === 'files'"
        v-model="formData.files"
        multiple
        :autoUpload="false"
        allowUploadDuplicateFile
      >
        <t-button theme="default">
          CHOOSE FILE (allow multiple)
        </t-button>
      </t-upload>
    </t-form>
  </t-card>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { useChatStore } from '@/stores'

const chatStore = useChatStore()

const options = [
  {
    label: 'web',
    value: 'web',
  },
  {
    label: 'files',
    value: 'files',
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

const formData = reactive({
  selection: '',
  web: '',
  files: [],
})

const handleChange = () => {
  formData.web = ''
  formData.files = []
}

const loading = ref(false)
const handleChoose = () => {
  if (formData.web) chatStore.setWeb(formData.web)
  if (!!formData.files.length) chatStore.files = formData.files
  loading.value = true

  console.log(chatStore.web)
}
</script>
