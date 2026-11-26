import type { QuestionsRequest } from '../../src/models/QuestionsRequest.ts'
import type { QuestionsResponse } from '../../src/models/QuestionsResponse.ts'
import type { IHttpClient } from '../../src/services/interfaces/IHttpClient.ts'
import { describe, expect, it, vi } from 'vitest'
import QuestionsService from '../../src/services/QuestionsService'

describe('QuestionsService', () => {
  it.each([
    {
      scenario: 'only the required amount',
      request: { amount: 10 },
      expectedUrl: '/questions?amount=10',
    },
    {
      scenario: 'a category',
      request: { amount: 10, category: 9 },
      expectedUrl: '/questions?amount=10&category=9',
    },
    {
      scenario: 'a difficulty',
      request: { amount: 10, difficulty: 'easy' },
      expectedUrl: '/questions?amount=10&difficulty=easy',
    },
    {
      scenario: 'a question type',
      request: { amount: 10, type: 'multiple' },
      expectedUrl: '/questions?amount=10&type=multiple',
    },
    {
      scenario: 'a token',
      request: { amount: 10, token: 'test-token' },
      expectedUrl: '/questions?amount=10&token=test-token',
    },
    {
      scenario: 'all optional parameters',
      request: {
        amount: 10,
        category: 9,
        difficulty: 'easy',
        type: 'multiple',
        token: 'test-token',
      },
      expectedUrl:
          '/questions?amount=10&category=9&difficulty=easy&type=multiple&token=test-token',
    },
  ])('requests questions with $scenario', async ({ request, expectedUrl }) => {
    // Arrange
    const response: QuestionsResponse[] = []
    const httpClient: IHttpClient = {
      get: vi.fn().mockResolvedValue(response),
      post: vi.fn(),
    }
    const service = new QuestionsService(httpClient)

    // Act
    const result = await service.getQuestions(request)

    // Assert
    expect(httpClient.get).toHaveBeenCalledWith(expectedUrl)
    expect(result).toEqual(response)
  })

  it('propagates an HTTP error', async () => {
    // Arrange
    const request: QuestionsRequest = { amount: 10 }
    const error = new Error('Request failed')

    const httpClient: IHttpClient = {
      get: vi.fn().mockRejectedValue(error),
      post: vi.fn(),
    }
    const service = new QuestionsService(httpClient)

    // Act
    const result = service.getQuestions(request)

    // Assert
    await expect(result).rejects.toBe(error)
  })
})
