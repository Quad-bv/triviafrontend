<template>
  <v-progress-linear
    :color="progressColor"
    height="6"
    :model-value="progress"
    rounded
  />
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
