import { describe, expect, it } from 'vitest'
import { useQuizApp } from '../../src/composables/useQuizApp'
import { QuizState } from '../../src/models/enums/QuizState'

describe('useQuizApp', () => {
  it('initializes with start state', () => {
    // Act
    const { state } = useQuizApp()

    // Assert
    expect(state.value).toBe(QuizState.Start)
  })

  it('starts quiz', () => {
    // Arrange
    const { state, startQuiz } = useQuizApp()

    // Act
    startQuiz()

    // Assert
    expect(state.value).toBe(QuizState.Quiz)
  })

  it('shows results', () => {
    // Arrange
    const { state, showResults } = useQuizApp()

    // Act
    showResults()

    // Assert
    expect(state.value).toBe(QuizState.Results)
  })

  it('resets to start state', () => {
    // Arrange
    const { state, startQuiz, resetQuiz } = useQuizApp()
    startQuiz()

    // Act
    resetQuiz()

    // Assert
    expect(state.value).toBe(QuizState.Start)
  })

  it('creates independent state for each instance', () => {
    // Arrange
    const first = useQuizApp()
    const second = useQuizApp()

    // Act
    first.startQuiz()

    // Assert
    expect(first.state.value).toBe(QuizState.Quiz)
    expect(second.state.value).toBe(QuizState.Start)
  })
})
