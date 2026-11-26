import type { QuizStartData } from '@/models/QuizStartData'

import { ref } from 'vue'
import { useQuestionsService } from '@/composables/services/useQuestionsService'
import { useQuizStore } from '@/composables/useQuizStore'
import { mapQuestions } from '@/utils/mappers/QuestionMapper'

export function useQuizStart () {
  const questionsService = useQuestionsService()
  const quiz = useQuizStore()

  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function startQuiz (data: QuizStartData) {
    loading.value = true
    error.value = null

    try {
      const questionsResponse = await questionsService.getQuestions({
        amount: data.amount,
        difficulty: data.difficulty,
        type: data.type,
      })

      quiz.setQuestions(mapQuestions(questionsResponse))
    } catch (error_) {
      error.value = error_ instanceof Error
        ? error_
        : new Error('Failed to retrieve questions.')
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    startQuiz,
  }
}
