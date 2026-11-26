export interface Answer {
  text: string
  guessed: boolean
  correct: boolean | null // Schrödinger's 🐈 (we do not know until the backend verifies)
}

export type AnswerInput = Omit<Answer, 'correct' | 'guessed'>
