import { describe, expect, it } from 'vitest'
import { Difficulty } from '../../../src/models/enums/Difficulty'
import { QuestionType } from '../../../src/models/enums/QuestionType'
import { mapDifficultyOptions, mapQuestionTypeOptions } from '../../../src/utils/mappers/QuizOptionsMapper'

describe('QuizOptionsMapper', () => {
  describe('mapDifficultyOptions', () => {
    it('maps difficulty options correctly', () => {
      // Arrange
      const expected = [
        { title: 'Any', value: 'any' },
        { title: 'Easy', value: Difficulty.EASY },
        { title: 'Medium', value: Difficulty.MEDIUM },
        { title: 'Hard', value: Difficulty.HARD },
      ]

      // Act
      const result = mapDifficultyOptions()

      // Assert
      expect(result).toEqual(expected)
    })
  })

  describe('mapQuestionTypeOptions', () => {
    it('maps question type options correctly', () => {
      // Arrange
      const expected = [
        { title: 'Random', value: 'random' },
        { title: 'Multiple choice', value: QuestionType.MULTIPLE },
        { title: 'True / False', value: QuestionType.BOOLEAN },
      ]

      // Act
      const result = mapQuestionTypeOptions()

      // Assert
      expect(result).toEqual(expected)
    })
  })
})
