import type { IHttpClient } from '@/services/interfaces/IHttpClient.ts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_PATH = import.meta.env.VITE_API_PATH ?? ''

export default class FetchHttpClient implements IHttpClient {
  async get<T>(path: string): Promise<T> {
    return this.request<T>(path)
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${API_PATH}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      )
    }

    return await response.json() as Promise<T>
  }
}
