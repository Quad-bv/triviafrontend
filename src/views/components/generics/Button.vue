
<template>
  <v-btn
      color="primary"
      size="large"
      :min-width="minWidth"
      :disabled="disabled"
      :loading="loading"
      :type="type"
      :block="block"
      @click="$emit('click')"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  type?: 'button' | 'submit' | 'reset';
  minWidth?: string | number;
}>(), {
  disabled: false,
  loading: false,
  block: false,
  type: 'button',
  minWidth: 160,
});

defineEmits<{
  click: [];
}>();
</script>
