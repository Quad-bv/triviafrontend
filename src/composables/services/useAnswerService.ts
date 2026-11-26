import { inject } from 'vue'
import { answersServiceKey } from '@/services/ServiceKeys.ts'

export function useAnswerService () {
  const service = inject(answersServiceKey)

  if (!service) {
    throw new Error('AnswerService was not provided')
  }

  return service
}
