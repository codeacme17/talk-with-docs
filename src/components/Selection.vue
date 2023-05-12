<template>
  <t-card class="border-none py-7">
    <template #header> Chose Chat Type </template>

    <t-form class="" labelWidth="0">
      <t-form-item>
        <t-select v-model="formData.selection" placeholder="">
          <t-option
            v-for="item in options"
            :label="item.label"
            :value="item.value"
          />
        </t-select>
      </t-form-item>

      <t-input-adornment
        prepend="http://"
        v-show="formData.selection === 'web'"
      >
        <t-input placeholder="" />
      </t-input-adornment>

      <t-upload
        v-model="formData.files"
        v-show="formData.selection === 'files'"
        placeholder=""
        theme="file-flow"
        multiple
        :disabled="disabled"
        :auto-upload="autoUpload"
        :max="10"
        :allow-upload-duplicate-file="allowUploadDuplicateFile"
        :is-batch-upload="isBatchUpload"
        :upload-all-files-in-one-request="uploadAllFilesInOneRequest"
      />
    </t-form>
  </t-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

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

const formData = reactive({
  selection: '',
  web: '',
  files: '',
})

const disabled = ref(false)
const autoUpload = ref(false)
const allowUploadDuplicateFile = ref(false)
const isBatchUpload = ref(false)
const uploadAllFilesInOneRequest = ref(false)
</script>
