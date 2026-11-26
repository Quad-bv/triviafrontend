import { computed } from 'vue'
import { useQuizStore } from '@/composables/useQuizStore'
import { calculateScorePercentage } from '@/utils/ScoreCalculator.ts'

export function useQuizResult () {
  const quiz = useQuizStore()

  const totalQuestions = computed(() => quiz.questions.length)

  const correctAnswers = computed(() =>
    quiz.questions.filter(question => question.correct === true).length,
  )

  const incorrectAnswers = computed(() =>
    quiz.questions.filter(question => question.correct === false).length,
  )

  const scorePercentage = computed(() =>
    calculateScorePercentage(correctAnswers.value, totalQuestions.value),
  )

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    scorePercentage,
  }
}
