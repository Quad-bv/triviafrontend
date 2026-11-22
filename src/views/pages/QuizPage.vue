
<template>
  <QuizQuestionCard
      v-if="currentQuestion"
      color="transparent"
      variant="flat"
      class="w-[60%] min-h-[40vh] mx-auto my-auto p-8"
      :question="currentQuestion.question"
      :category="currentQuestion.category"
      :difficulty="currentQuestion.difficulty"
      :question-number="currentQuestionNumber"
      :total-questions="questions.length"
  >
    <MultipleChoiceQuestion
        :key="currentQuestionNumber"
        :question="currentQuestion.question"
        :answers="currentQuestion.answers"
        :verification-token="currentQuestion.verificationToken"
        :max-attempts="1"
        @answered="onQuestionAnswered"
    />
  </QuizQuestionCard>
</template>

<script setup lang="ts">
import MultipleChoiceQuestion from '@/views/components/quiz/MultipleChoiceQuestion.vue';
import QuizQuestionCard from '@/views/components/quiz/QuizQuestionCard.vue';

import { useQuizStore } from '@/composables/useQuizStore';
import {useQuizFlow} from "@/composables/useQuizFlow.ts";

const {
  questions,
  currentQuestion,
  currentQuestionNumber,
} = useQuizStore();

const emit = defineEmits<{
  finished: [];
}>();

const { submitQuestionResult } = useQuizFlow();

async function onQuestionAnswered(correct: boolean) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const isQuizOver = submitQuestionResult(correct);

  if (isQuizOver) {
    emit('finished');
  }
}
</script>
