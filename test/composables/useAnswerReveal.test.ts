import type { Answer } from '../../src/models/Answer'
import { describe, expect, it, vi } from 'vitest'
import { useAnswerReveal } from '../../src/composables/useAnswerReveal'

describe('useAnswerReveal', () => {
  it('skips answers that have already been guessed', async () => {
    // Arrange
    const answers: Answer[] = [
      { text: 'Paris', guessed: true, correct: null },
      { text: 'London', guessed: false, correct: null },
    ]

    const checkAnswer = vi.fn().mockResolvedValue({ correct: false })
    const onError = vi.fn()

    const { revealCorrectAnswer } = useAnswerReveal({
      checkAnswer,
      onError,
    })

    // Act
    await revealCorrectAnswer(answers)

    // Assert
    expect(checkAnswer).toHaveBeenCalledTimes(1)
    expect(checkAnswer).toHaveBeenCalledWith('London')
  })

  it('stops checking answers when the correct answer is found', async () => {
    // Arrange
    const answers: Answer[] = [
      { text: 'London', guessed: false, correct: null },
      { text: 'Paris', guessed: false, correct: null },
      { text: 'Berlin', guessed: false, correct: null },
    ]

    const checkAnswer = vi.fn()
      .mockResolvedValueOnce({ correct: false })
      .mockResolvedValueOnce({ correct: true })

    const onError = vi.fn()

    const { revealCorrectAnswer } = useAnswerReveal({
      checkAnswer,
      onError,
    })

    // Act
    await revealCorrectAnswer(answers)

    // Assert
    expect(checkAnswer).toHaveBeenCalledTimes(2)
    expect(checkAnswer).toHaveBeenNthCalledWith(1, 'London')
    expect(checkAnswer).toHaveBeenNthCalledWith(2, 'Paris')
    expect(answers[1].correct).toBe(true)
    expect(answers[2].correct).toBeNull()
  })

  it('checks all remaining answers when no correct answer is found', async () => {
    // Arrange
    const answers: Answer[] = [
      { text: 'London', guessed: false, correct: null },
      { text: 'Berlin', guessed: false, correct: null },
      { text: 'Madrid', guessed: false, correct: null },
    ]

    const checkAnswer = vi.fn().mockResolvedValue({ correct: false })
    const onError = vi.fn()

    const { revealCorrectAnswer } = useAnswerReveal({
      checkAnswer,
      onError,
    })

    // Act
    await revealCorrectAnswer(answers)

    // Assert
    expect(checkAnswer).toHaveBeenCalledTimes(3)
    expect(answers.every(answer => answer.correct === null)).toBe(true)
    expect(onError).not.toHaveBeenCalled()
  })

  it('does not check any answers when all answers have already been guessed', async () => {
    // Arrange
    const answers: Answer[] = [
      { text: 'London', guessed: true, correct: null },
      { text: 'Paris', guessed: true, correct: null },
    ]

    const checkAnswer = vi.fn()
    const onError = vi.fn()

    const { revealCorrectAnswer } = useAnswerReveal({
      checkAnswer,
      onError,
    })

    // Act
    await revealCorrectAnswer(answers)

    // Assert
    expect(checkAnswer).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it('calls onError when checking an answer fails', async () => {
    // Arrange
    const error = new Error('Request failed')

    const answers: Answer[] = [
      { text: 'London', guessed: false, correct: null },
      { text: 'Paris', guessed: false, correct: null },
    ]

    const checkAnswer = vi.fn().mockRejectedValue(error)
    const onError = vi.fn()

    const { revealCorrectAnswer } = useAnswerReveal({
      checkAnswer,
      onError,
    })

    // Act
    await revealCorrectAnswer(answers)

    // Assert
    expect(checkAnswer).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith(error)
  })
})
