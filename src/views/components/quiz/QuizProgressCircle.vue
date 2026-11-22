<template>
  <v-progress-circular
      :model-value="(questionNumber / totalQuestions) * 100"
      :size="75"
      :width="8"
      :color="progressColor"
      reveal
      rounded
  >
    {{ questionNumber }}/{{ totalQuestions }}
  </v-progress-circular>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  questionNumber: number;
  totalQuestions: number;
}>();

const progressColor = computed(() => {
  const progress =
      (props.questionNumber / props.totalQuestions) * 100;

  if (progress <= 33) return 'green';
  if (progress <= 66) return 'yellow';
  if (progress < 100) return 'orange';

  return 'red';
});
</script>
