import type { QuestionsRequest } from '@/models/QuestionsRequest.ts'
import type { QuestionsResponse } from '@/models/QuestionsResponse.ts'
import type { IHttpClient } from '@/services/interfaces/IHttpClient.ts'
import type { IQuestionsService } from '@/services/interfaces/IQuestionsService.ts'

export default class QuestionsService implements IQuestionsService {
  constructor (private readonly httpClient: IHttpClient) {}

  async getQuestions (
    request: QuestionsRequest,
  ): Promise<QuestionsResponse[]> {
    const params = new URLSearchParams()

    params.set('amount', String(request.amount))

    if (request.category !== undefined) {
      params.set('category', String(request.category))
    }
    if (request.difficulty) {
      params.set('difficulty', request.difficulty)
    }
    if (request.type) {
      params.set('type', request.type)
    }
    if (request.token) {
      params.set('token', request.token)
    }

    return this.httpClient.get<QuestionsResponse[]>(
      `/questions?${params.toString()}`,
    )
  }
}
