import type { CheckAnswerRequest } from '@/models/CheckAnswerRequest.ts'
import type { CheckAnswerResponse } from '@/models/CheckAnswerResponse.ts'

export interface IAnswersService {
  checkAnswer: (request: CheckAnswerRequest) => Promise<CheckAnswerResponse>
}
