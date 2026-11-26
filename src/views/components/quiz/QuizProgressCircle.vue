<template>
  <v-progress-circular
    :color="progressColor"
    :model-value="progress"
    reveal
    rounded
    :size="75"
    :width="8"
  >
    {{ questionNumber }}/{{ totalQuestions }}
  </v-progress-circular>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { getProgressColor, getProgressPercentage } from '@/utils/Progress.ts'

  const props = defineProps<{
    questionNumber: number
    totalQuestions: number
  }>()

  const progress = computed(() =>
    getProgressPercentage(props.questionNumber, props.totalQuestions),
  )

  const progressColor = computed(() => getProgressColor(progress.value))
</script>
