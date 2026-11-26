import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { useAnswerService } from '../../../src/composables/services/useAnswerService'
import { answersServiceKey } from '../../../src/services/ServiceKeys'

describe('useAnswerService', () => {
  it('returns the provided AnswersService', () => {
    // Arrange
    const service = {
      checkAnswer: async () => ({ correct: true }),
    }

    let result: ReturnType<typeof useAnswerService> | undefined

    const TestComponent = defineComponent({
      setup () {
        result = useAnswerService()
        return {}
      },
      template: '<div />',
    })

    // Act
    mount(TestComponent, {
      global: {
        provide: {
          [answersServiceKey as symbol]: service,
        },
      },
    })

    // Assert
    expect(result).toBe(service)
  })

  it('throws an error when AnswersService is not provided', () => {
    // Arrange
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const TestComponent = defineComponent({
      setup () {
        useAnswerService()
        return () => null
      },
    })

    // Act & Assert
    expect(() => mount(TestComponent)).toThrow(
      'AnswerService was not provided',
    )

    expect(consoleWarn).toHaveBeenCalled()
  })
})
