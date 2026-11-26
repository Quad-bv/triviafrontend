import { describe, expect, it } from 'vitest'
import { calculateScorePercentage } from '../../src/utils/ScoreCalculator'

describe('ScoreCalculator', () => {
  describe('calculateScorePercentage', () => {
    it.each([
      { correctAnswers: 0, totalQuestions: 10, expected: 0 },
      { correctAnswers: 5, totalQuestions: 10, expected: 50 },
      { correctAnswers: 10, totalQuestions: 10, expected: 100 },
      { correctAnswers: 1, totalQuestions: 3, expected: 33 },
      { correctAnswers: 2, totalQuestions: 3, expected: 67 },
      { correctAnswers: 0, totalQuestions: 0, expected: 0 },
      { correctAnswers: 4, totalQuestions: 2, expected: 200 },
      { correctAnswers: -1, totalQuestions: 10, expected: -10 },
      { correctAnswers: 5, totalQuestions: -2, expected: -250 },
    ])(
      'calculates $expected% for $correctAnswers correct answers out of $totalQuestions',
      ({ correctAnswers, totalQuestions, expected }) => {
        // Arrange

        // Act
        const result = calculateScorePercentage(
          correctAnswers,
          totalQuestions,
        )

        // Assert
        expect(result).toBe(expected)
      },
    )
  })
})
