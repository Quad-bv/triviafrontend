import { useQuizStore } from '@/composables/useQuizStore'
import { isLastQuestion } from '@/utils/QuizRules.ts'

export function useQuizFlow () {
  const quiz = useQuizStore()

  function completeQuestion (correct: boolean): boolean {
    quiz.setQuestionResult(correct)

    const isQuizOver = isLastQuestion(
      quiz.currentQuestionNumber,
      quiz.questions.length,
    )

    if (!isQuizOver) {
      quiz.nextQuestion()
    }

    return isQuizOver
  }

  return {
    completeQuestion,
  }
}
