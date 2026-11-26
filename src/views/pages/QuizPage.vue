<template>
  <QuizQuestionCard
    v-if="currentQuestion"
    :category="currentQuestion.category"
    class="w-[60%] min-h-[40vh] mx-auto my-auto p-8"
    color="transparent"
    :difficulty="currentQuestion.difficulty"
    :question="currentQuestion.question"
    :question-number="currentQuestionNumber"
    :total-questions="questions.length"
    variant="flat"
  >
    <MultipleChoiceQuestion
      :key="currentQuestionNumber"
      :answers="currentQuestion.answers"
      :max-attempts="1"
      :question="currentQuestion.question"
      :verification-token="currentQuestion.verificationToken"
      @answered="onQuestionAnswered"
    />
  </QuizQuestionCard>
</template>

<script lang="ts" setup>
  import { useQuizFlow } from '@/composables/useQuizFlow.ts'
  import { useQuizStore } from '@/composables/useQuizStore'
  import MultipleChoiceQuestion from '@/views/components/quiz/MultipleChoiceQuestion.vue'
  import QuizQuestionCard from '@/views/components/quiz/QuizQuestionCard.vue'

  const {
    questions,
    currentQuestion,
    currentQuestionNumber,
  } = useQuizStore()

  const emit = defineEmits<{
    finished: []
  }>()

  const { completeQuestion } = useQuizFlow()

  async function onQuestionAnswered (correct: boolean) {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const isQuizOver = completeQuestion(correct)

    if (isQuizOver) {
      emit('finished')
    }
  }
</script>
