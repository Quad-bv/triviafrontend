import { describe, expect, it } from 'vitest'
import { useQuizOptions } from '../../src/composables/useQuizOptions'
import { Difficulty } from '../../src/models/enums/Difficulty'
import { QuestionType } from '../../src/models/enums/QuestionType'

describe('useQuizOptions', () => {
  it('returns the available difficulty options', () => {
    // Arrange
    const expectedOptions = [
      { title: 'Any', value: 'any' },
      { title: 'Easy', value: Difficulty.EASY },
      { title: 'Medium', value: Difficulty.MEDIUM },
      { title: 'Hard', value: Difficulty.HARD },
    ]

    // Act
    const { difficultyOptions } = useQuizOptions()

    // Assert
    expect(difficultyOptions).toEqual(expectedOptions)
  })

  it('returns the available question type options', () => {
    // Arrange
    const expectedOptions = [
      { title: 'Random', value: 'random' },
      { title: 'Multiple choice', value: QuestionType.MULTIPLE },
      { title: 'True / False', value: QuestionType.BOOLEAN },
    ]

    // Act
    const { questionTypeOptions } = useQuizOptions()

    // Assert
    expect(questionTypeOptions).toEqual(expectedOptions)
  })
})
