import type { CheckAnswerRequest } from '@/models/CheckAnswerRequest.ts'
import type { CheckAnswerResponse } from '@/models/CheckAnswerResponse.ts'
import type { IAnswersService } from '@/services/interfaces/IAnswersService.ts'
import type { IHttpClient } from '@/services/interfaces/IHttpClient.ts'

export default class AnswersService implements IAnswersService {
  constructor (private readonly httpClient: IHttpClient) {}

  async checkAnswer (
    request: CheckAnswerRequest,
  ): Promise<CheckAnswerResponse> {
    return this.httpClient.post<CheckAnswerResponse>(
      '/checkanswers',
      request,
    )
  }
}
