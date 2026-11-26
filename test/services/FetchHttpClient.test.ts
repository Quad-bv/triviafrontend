import type FetchHttpClientClass from '../../src/services/FetchHttpClient'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('FetchHttpClient', () => {
  let client: InstanceType<typeof FetchHttpClientClass>

  beforeEach(async () => {
    vi.resetModules()
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.test.com')
    vi.stubEnv('VITE_API_PATH', '/api')

    const { default: FetchHttpClient } = await import(
      '../../src/services/FetchHttpClient',
    )

    client = new FetchHttpClient()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('sends a GET request and returns the JSON response', async () => {
    // Arrange
    const response = [{ question: 'What is the capital of France?' }]
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(response),
    })
    vi.stubGlobal('fetch', fetchMock)

    // Act
    const result = await client.get('/questions')

    // Assert
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test.com/api/questions',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    expect(result).toEqual(response)
  })

  it('sends a POST request with a JSON body and returns the JSON response', async () => {
    // Arrange
    const body = { answer: 'Paris' }
    const response = { correct: true }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(response),
    })
    vi.stubGlobal('fetch', fetchMock)

    // Act
    const result = await client.post('/checkanswers', body)

    // Assert
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test.com/api/checkanswers',
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    expect(result).toEqual(response)
  })

  it.each([
    { status: 400, statusText: 'Bad Request' },
    { status: 401, statusText: 'Unauthorized' },
    { status: 404, statusText: 'Not Found' },
    { status: 500, statusText: 'Internal Server Error' },
  ])(
    'throws an error when the API responds with $status $statusText',
    async ({ status, statusText }) => {
      // Arrange
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status,
        statusText,
      })
      vi.stubGlobal('fetch', fetchMock)

      // Act
      const result = client.get('/questions')

      // Assert
      await expect(result).rejects.toThrow(
        `API request failed: ${status} ${statusText}`,
      )
    },
  )

  it('uses an empty API path when VITE_API_PATH is not configured', async () => {
    // Arrange
    vi.stubEnv('VITE_API_PATH', '')
    vi.resetModules()

    const { default: FetchHttpClient } = await import(
      '../../src/services/FetchHttpClient',
    )
    const clientWithoutApiPath = new FetchHttpClient()

    const response = [{ question: 'What is the capital of France?' }]
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(response),
    })
    vi.stubGlobal('fetch', fetchMock)

    // Act
    const result = await clientWithoutApiPath.get('/questions')

    // Assert
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test.com/questions',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    expect(result).toEqual(response)
  })
})
