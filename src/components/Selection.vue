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

        <t-button
          theme="default"
          class="ml-3 px-7"
          :disabled="
            !formData.files.length &&
            !formData.web &&
            formData.selection !== 'chat'
          "
          @click="handleChoose"
        >
          CONFIRM
        </t-button>
      </t-form-item>

      <t-input-adornment
        :prepend="protocolSelect"
        v-show="formData.selection === 'web'"
      >
        <t-input placeholder="" v-model.trim="formData.web" />
      </t-input-adornment>

      <div class="my-5"></div>

      <t-input-adornment
        prepend=" NAMESPACE "
        v-show="formData.selection === 'web'"
      >
        <t-input placeholder="" v-model.trim="formData.namespace" />
      </t-input-adornment>

      <t-upload
        action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        v-show="formData.selection === 'files'"
        v-model="formData.files"
        multiple
        :autoUpload="false"
        allowUploadDuplicateFile
      >
        <t-button theme="default"> CHOOSE FILE (allow multiple) </t-button>
      </t-upload>
    </t-form>
  </t-card>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue'
import { useChatStore, type State } from '@/stores'
import { WEB_API } from '@/apis'

const chatStore = useChatStore()

const options = [
  {
    label: 'just chat',
    value: 'chat',
  },
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

const formData = reactive<State>({
  selection: '',
  web: '',
  files: [],
  namespace: '',
})

const handleChange = () => {
  formData.web = ''
  formData.files = []
}

const loading = ref(false)
const handleChoose = async () => {
  loading.value = true
  await selectLoader()
  if (formData.web) chatStore.web = formData.web
  if (!!formData.files.length) chatStore.files = formData.files
  chatStore.selection = formData.selection
}

const selectLoader = async () => {
  switch (formData.selection) {
    case 'web':
      await WEB_API.initWeb({
        url: `https://${formData.web}`,
        text: 'text',
        namespace: formData.namespace!,
      })
      chatStore.namespace = formData.namespace
      break

    default:
      break
  }
}
</script>
