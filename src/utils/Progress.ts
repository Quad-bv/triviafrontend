export function getProgressPercentage (
  questionNumber: number,
  totalQuestions: number,
): number {
  return (questionNumber / totalQuestions) * 100
}

export function getProgressColor (progress: number): string {
  if (progress <= 33) {
    return 'green'
  }
  if (progress <= 66) {
    return 'yellow'
  }
  if (progress < 100) {
    return 'orange'
  }

  return 'red'
}
