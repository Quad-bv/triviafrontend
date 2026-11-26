import type { Question } from '../../src/models/Question'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useQuizFlow } from '../../src/composables/useQuizFlow'
import { useQuizStore } from '../../src/composables/useQuizStore'

describe('useQuizFlow', () => {
  beforeEach(() => {
    setActivePinia(createTestingPinia({
      createSpy: vi.fn,
    }))
  })

  it('records the result and advances when the quiz is not over', () => {
    // Arrange
    const quiz = useQuizStore()
    quiz.questions = [
      { answered: false, correct: null },
      { answered: false, correct: null },
      { answered: false, correct: null },
    ] as Question[]

    quiz.currentQuestionIndex = 0

    const { completeQuestion } = useQuizFlow()

    // Act
    const result = completeQuestion(true)

    // Assert
    expect(quiz.setQuestionResult).toHaveBeenCalledWith(true)
    expect(quiz.nextQuestion).toHaveBeenCalledOnce()
    expect(result).toBe(false)
  })

  it('records the result without advancing when the last question is completed', () => {
    // Arrange
    const quiz = useQuizStore()
    quiz.questions = [
      { answered: false, correct: null },
      { answered: false, correct: null },
      { answered: false, correct: null },
    ] as Question[]

    quiz.currentQuestionIndex = 2

    const { completeQuestion } = useQuizFlow()

    // Act
    const result = completeQuestion(false)

    // Assert
    expect(quiz.setQuestionResult).toHaveBeenCalledWith(false)
    expect(quiz.nextQuestion).not.toHaveBeenCalled()
    expect(result).toBe(true)
  })
})
