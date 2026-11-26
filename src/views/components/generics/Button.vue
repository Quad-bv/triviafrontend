<template>
  <v-btn
    :block="block"
    color="primary"
    :disabled="disabled"
    :loading="loading"
    :min-width="minWidth"
    size="large"
    :type="type"
    @click="$emit('click')"
  >
    <slot />
  </v-btn>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    disabled?: boolean
    loading?: boolean
    block?: boolean
    type?: 'button' | 'submit' | 'reset'
    minWidth?: string | number
  }>(), {
    disabled: false,
    loading: false,
    block: false,
    type: 'button',
    minWidth: 160,
  })

  defineEmits<{
    click: []
  }>()
</script>
