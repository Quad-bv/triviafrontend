import type { Answer, AnswerInput } from '@/models/Answer'

import { computed, ref } from 'vue'
import { useAnswerService } from '@/composables/services/useAnswerService'
import { useAnswerReveal } from '@/composables/useAnswerReveal'
import { hasReachedAttemptLimit } from '@/utils/QuizRules.ts'

interface QuizAnswerOptions {
  question: string
  answers: AnswerInput[]
  verificationToken: string
  maxAttempts?: number
}

export function useQuizQuestion (options: QuizAnswerOptions) {
  const answerService = useAnswerService()

  // Initialize local answer state
  const answers = ref<Answer[]>(
    options.answers.map(answer => ({
      ...answer,
      guessed: false,
      correct: null,
    })),
  )

  const selectedAnswer = ref<string | null>(null)
  const isChecking = ref(false)
  const attempts = ref(0)
  const error = ref<Error | null>(null)

  // Calculate quiz state
  const attemptLimit = computed(() =>
    options.maxAttempts ?? options.answers.length - 1,
  )

  const isFinished = computed(() =>
    answers.value.some(answer => answer.correct === true)
    || hasReachedAttemptLimit(attempts.value, attemptLimit.value),
  )

  // Handle errors
  function setError (err: unknown, message: string) {
    console.error(message, err)

    error.value = err instanceof Error
      ? err
      : new Error(message)
  }

  // Send an answer to the backend for verification
  function checkAnswer (answer: string) {
    return answerService.checkAnswer({
      question: options.question,
      selectedAnswer: answer,
      verificationToken: options.verificationToken,
    })
  }

  // Handle correct-answer reveal
  const { revealCorrectAnswer } = useAnswerReveal({
    checkAnswer,
    onError: error_ => setError(error_, 'Failed to check answer.'),
  })

  // Submit and process answers
  async function submitAnswer (answer: string | null): Promise<boolean | null> {
    error.value = null

    if (answer === null || isChecking.value || isFinished.value) {
      return null
    }

    const selected = answers.value.find(a => a.text === answer)

    if (!selected || selected.guessed) {
      selectedAnswer.value = null
      return null
    }

    isChecking.value = true

    try {
      const response = await checkAnswer(answer)

      selected.correct = response.correct
      selected.guessed = true
      attempts.value++

      if (
        !response.correct
        && hasReachedAttemptLimit(attempts.value, attemptLimit.value)
      ) {
        await revealCorrectAnswer(answers.value)
      }

      return response.correct
    } catch (error_) {
      setError(error_, 'Failed to check answer.')
      return null
    } finally {
      selectedAnswer.value = null
      isChecking.value = false
    }
  }

  return {
    selectedAnswer,
    isChecking,
    attempts,
    attemptLimit,
    answers,
    isFinished,
    error,
    submitAnswer,
  }
}
