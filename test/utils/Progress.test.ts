import { describe, expect, it } from 'vitest'
import {
  getProgressColor,
  getProgressPercentage,
} from '../../src/utils/Progress'

describe('Progress', () => {
  describe('getProgressPercentage', () => {
    it.each([
      { questionNumber: 1, totalQuestions: 10, expected: 10 },
      { questionNumber: 5, totalQuestions: 10, expected: 50 },
      { questionNumber: 10, totalQuestions: 10, expected: 100 },
      { questionNumber: 0, totalQuestions: 10, expected: 0 },
      { questionNumber: 3, totalQuestions: 4, expected: 75 },
      { questionNumber: 1, totalQuestions: 3, expected: 100 / 3 },
    ])(
      'returns $expected for question $questionNumber of $totalQuestions',
      ({ questionNumber, totalQuestions, expected }) => {
        // Arrange

        // Act
        const result = getProgressPercentage(questionNumber, totalQuestions)

        // Assert
        expect(result).toBeCloseTo(expected, 2)
      },
    )
  })

  describe('getProgressColor', () => {
    it.each([
      { progress: 0, expected: 'green' },
      { progress: 33, expected: 'green' },
      { progress: 33.1, expected: 'yellow' },
      { progress: 66, expected: 'yellow' },
      { progress: 66.1, expected: 'orange' },
      { progress: 99, expected: 'orange' },
      { progress: 100, expected: 'red' },
      { progress: 125, expected: 'red' },
    ])(
      'returns $expected for progress $progress',
      ({ progress, expected }) => {
        // Arrange

        // Act
        const result = getProgressColor(progress)

        // Assert
        expect(result).toBe(expected)
      },
    )
  })
})
