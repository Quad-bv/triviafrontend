export function hasReachedAttemptLimit (
  attempts: number,
  attemptLimit: number,
): boolean {
  return attemptLimit > 0 && attempts >= attemptLimit
}

export function isLastQuestion (
  currentQuestionNumber: number,
  totalQuestions: number,
): boolean {
  return currentQuestionNumber === totalQuestions
}
