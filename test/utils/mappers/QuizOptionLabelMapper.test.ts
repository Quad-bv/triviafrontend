import { describe, expect, it } from 'vitest'
import { Difficulty } from '../../../src/models/enums/Difficulty'
import { QuestionType } from '../../../src/models/enums/QuestionType'
import { difficultyLabels, questionTypeLabels } from '../../../src/utils/mappers/QuizOptionLabelsMapper'

describe('QuizOptionLabelMapper', () => {
  describe('difficultyLabels', () => {
    it.each([
      { difficulty: Difficulty.EASY, expected: 'Easy' },
      { difficulty: Difficulty.MEDIUM, expected: 'Medium' },
      { difficulty: Difficulty.HARD, expected: 'Hard' },
    ])(
      'maps $difficulty to $expected',
      ({ difficulty, expected }) => {
        // Arrange

        // Act
        const result = difficultyLabels[difficulty]

        // Assert
        expect(result).toBe(expected)
      },
    )
  })

  describe('questionTypeLabels', () => {
    it.each([
      { type: QuestionType.MULTIPLE, expected: 'Multiple choice' },
      { type: QuestionType.BOOLEAN, expected: 'True / False' },
    ])(
      'maps $type to $expected',
      ({ type, expected }) => {
        // Arrange

        // Act
        const result = questionTypeLabels[type]

        // Assert
        expect(result).toBe(expected)
      },
    )
  })
})
