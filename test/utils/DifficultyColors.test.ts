import { describe, expect, it } from 'vitest'
import { Difficulty } from '../../src/models/enums/Difficulty'
import { getDifficultyColor } from '../../src/utils/DifficultyColors'

describe('DifficultyColors', () => {
  describe('getDifficultyColor', () => {
    it.each([
      { difficulty: Difficulty.EASY, expected: 'green' },
      { difficulty: Difficulty.MEDIUM, expected: 'yellow' },
      { difficulty: Difficulty.HARD, expected: 'red' },
    ])(
      'returns $expected for $difficulty difficulty',
      ({ difficulty, expected }) => {
        // Act
        const result = getDifficultyColor(difficulty)

        // Assert
        expect(result).toBe(expected)
      },
    )
  })
})
