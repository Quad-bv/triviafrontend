<template>
  <v-progress-linear
      :model-value="progress"
      :color="progressColor"
      height="6"
      rounded
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  questionNumber: number;
  totalQuestions: number;
}>();

const progress = computed(
    () => (props.questionNumber / props.totalQuestions) * 100
);

const progressColor = computed(() => {
  if (progress.value <= 33) return 'green';
  if (progress.value <= 66) return 'yellow';
  if (progress.value < 100) return 'orange';

  return 'red';
});
</script>
