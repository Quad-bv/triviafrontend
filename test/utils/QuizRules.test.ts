import { describe, expect, it } from 'vitest'
import { hasReachedAttemptLimit, isLastQuestion } from '../../src/utils/QuizRules'

describe('QuizRules', () => {
  describe('hasReachedAttemptLimit', () => {
    it.each([
      { attempts: 0, attemptLimit: 3, expected: false },
      { attempts: 1, attemptLimit: 3, expected: false },
      { attempts: 2, attemptLimit: 3, expected: false },
      { attempts: 3, attemptLimit: 3, expected: true },
      { attempts: 4, attemptLimit: 3, expected: true },
      { attempts: 5, attemptLimit: 0, expected: false },
      { attempts: 5, attemptLimit: -1, expected: false },
    ])(
      'returns $expected for $attempts attempts with a limit of $attemptLimit',
      ({ attempts, attemptLimit, expected }) => {
        // Arrange

        // Act
        const result = hasReachedAttemptLimit(attempts, attemptLimit)

        // Assert
        expect(result).toBe(expected)
      },
    )
  })

  describe('isLastQuestion', () => {
    it.each([
      { currentQuestionNumber: 1, totalQuestions: 10, expected: false },
      { currentQuestionNumber: 9, totalQuestions: 10, expected: false },
      { currentQuestionNumber: 10, totalQuestions: 10, expected: true },
      { currentQuestionNumber: 11, totalQuestions: 10, expected: false },
    ])(
      'returns $expected for question $currentQuestionNumber of $totalQuestions',
      ({ currentQuestionNumber, totalQuestions, expected }) => {
        // Arrange

        // Act
        const result = isLastQuestion(
          currentQuestionNumber,
          totalQuestions,
        )

        // Assert
        expect(result).toBe(expected)
      },
    )
  })
})
