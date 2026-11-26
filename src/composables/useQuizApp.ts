import { ref } from 'vue'
import { QuizState } from '@/models/enums/QuizState'

export function useQuizApp () {
  const state = ref<QuizState>(QuizState.Start)

  function startQuiz () {
    state.value = QuizState.Quiz
  }

  function showResults () {
    state.value = QuizState.Results
  }

  function resetQuiz () {
    state.value = QuizState.Start
  }

  return {
    state,
    startQuiz,
    showResults,
    resetQuiz,
  }
}
