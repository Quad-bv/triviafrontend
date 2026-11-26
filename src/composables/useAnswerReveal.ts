import type { Answer } from '@/models/Answer'

interface AnswerRevealOptions {
  checkAnswer: (answer: string) => Promise<{ correct: boolean }>
  onError: (error: unknown) => void
}

// Temporary workaround: the current API only checks one answer per request due to time constraints.
export function useAnswerReveal (options: AnswerRevealOptions) {
  async function revealCorrectAnswer (answers: Answer[]) {
    const remainingAnswers = answers.filter(answer => !answer.guessed)

    try {
      for (const answer of remainingAnswers) {
        const response = await options.checkAnswer(answer.text)

        if (response.correct) {
          answer.correct = true
          break
        }
      }
    } catch (error) {
      options.onError(error)
    }
  }

  return {
    revealCorrectAnswer,
  }
}
