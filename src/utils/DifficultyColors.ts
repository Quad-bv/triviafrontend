import { Difficulty } from '../models/enums/Difficulty'

export function getDifficultyColor (difficulty: Difficulty): string {
  switch (difficulty) {
    case Difficulty.EASY: {
      return 'green'
    }
    case Difficulty.MEDIUM: {
      return 'yellow'
    }
    case Difficulty.HARD: {
      return 'red'
    }
    default: {
      return 'grey'
    }
  }
}
