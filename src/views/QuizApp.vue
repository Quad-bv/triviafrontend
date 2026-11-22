<template>
  <QuizStart
      v-if="state === QuizState.Start"
      @started="startQuiz"
  />

  <QuizPage
      v-else-if="state === QuizState.Quiz"
      @finished="showResults"
  />

  <QuizResults
      v-else-if="state === QuizState.Results"
      @restart="resetQuiz"
  />
</template>

<script setup lang="ts">
import QuizStart from '@/views/pages/QuizStart.vue';
import QuizPage from '@/views/pages/QuizPage.vue';
import QuizResults from '@/views/pages/QuizResults.vue';

import { useQuizApp } from '@/composables/useQuizApp';
import { QuizState } from '@/models/enums/QuizState';

const {
  state,
  startQuiz,
  showResults,
  resetQuiz,
} = useQuizApp();
</script>
