import type { Question } from '@/models/Question'

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useQuizStore = defineStore('quiz', () => {
  const questions = ref<Question[]>([])
  const currentQuestionIndex = ref(0)

  const currentQuestion = computed(() =>
    questions.value[currentQuestionIndex.value] ?? null,
  )

  const currentQuestionNumber = computed(() =>
    currentQuestionIndex.value + 1,
  )

  function setQuestions (newQuestions: Question[]) {
    questions.value = newQuestions
    currentQuestionIndex.value = 0
  }

  function setQuestionResult (correct: boolean) {
    if (!currentQuestion.value) {
      return
    }

    currentQuestion.value.correct = correct
    currentQuestion.value.answered = true
  }

  function nextQuestion () {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
    }
  }

  return {
    questions,
    currentQuestionIndex,
    currentQuestion,
    currentQuestionNumber,
    setQuestions,
    setQuestionResult,
    nextQuestion,
  }
})
