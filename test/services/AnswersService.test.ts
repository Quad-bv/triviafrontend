import type { CheckAnswerRequest } from '../../src/models/CheckAnswerRequest.ts'
import type { IHttpClient } from '../../src/services/interfaces/IHttpClient.ts'
import { describe, expect, it, vi } from 'vitest'
import AnswersService from '../../src/services/AnswersService'

describe('AnswersService', () => {
  it.each([
    {
      scenario: 'a correct answer',
      response: { correct: true },
    },
    {
      scenario: 'an incorrect answer',
      response: { correct: false },
    },
  ])('returns the $scenario response', async ({ response }) => {
    // Arrange
    const request: CheckAnswerRequest = {
      question: 'What is the capital of France?',
      selectedAnswer: 'Paris',
      verificationToken: 'token',
    }

    const httpClient: IHttpClient = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue(response),
    }

    const service = new AnswersService(httpClient)

    // Act
    const result = await service.checkAnswer(request)

    // Assert
    expect(httpClient.post).toHaveBeenCalledWith(
      '/checkanswers',
      request,
    )
    expect(result).toEqual(response)
  })

  it('propagates an HTTP error', async () => {
    // Arrange
    const request: CheckAnswerRequest = {
      question: 'What is the capital of France?',
      selectedAnswer: 'Paris',
      verificationToken: 'token',
    }

    const error = new Error('Request failed')

    const httpClient: IHttpClient = {
      get: vi.fn(),
      post: vi.fn().mockRejectedValue(error),
    }

    const service = new AnswersService(httpClient)

    // Act
    const result = service.checkAnswer(request)

    // Assert
    await expect(result).rejects.toBe(error)
  })
})
