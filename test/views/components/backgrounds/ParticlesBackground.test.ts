import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ParticlesBackground from '../../../../src/views/components/backgrounds/ParticlesBackground.vue'

const { loadSlimMock, loadMock, destroyMock } = vi.hoisted(() => ({
  loadSlimMock: vi.fn(),
  loadMock: vi.fn(),
  destroyMock: vi.fn(),
}))

vi.mock('@tsparticles/engine', () => ({
  tsParticles: {
    load: loadMock,
  },
}))

vi.mock('@tsparticles/slim', () => ({
  loadSlim: loadSlimMock,
}))

describe('ParticlesBackground', () => {
  let wrappers: VueWrapper[] = []

  afterEach(() => {
    for (const wrapper of wrappers) {
      wrapper.unmount()
    }
    wrappers = []
    vi.clearAllMocks()
  })

  const mountComponent = () => {
    const wrapper = mount(ParticlesBackground)
    wrappers.push(wrapper)
    return wrapper
  }

  describe('Rendering', () => {
    it('matches the snapshot', () => {
      // Arrange
      const wrapper = mountComponent()

      // Assert
      expect(wrapper.html()).toMatchSnapshot()
    })
  })

  describe('Particle initialisation', () => {
    it('loads the particle engine and initialises the particle background on mount', async () => {
      // Arrange
      loadMock.mockResolvedValue({ destroy: destroyMock })

      // Act
      mountComponent()

      await vi.waitFor(() => {
        expect(loadMock).toHaveBeenCalledOnce()
      })

      // Assert
      expect(loadSlimMock).toHaveBeenCalledOnce()

      expect(loadMock).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'particles-background',
          options: expect.objectContaining({
            fullScreen: { enable: false },
            fpsLimit: 60,
            detectRetina: true,
          }),
        }),
      )
    })
  })

  describe('Cleanup', () => {
    it('destroys the particle container when the component is unmounted', async () => {
      // Arrange
      loadMock.mockResolvedValue({ destroy: destroyMock })

      const wrapper = mountComponent()

      await vi.waitFor(() => {
        expect(loadMock).toHaveBeenCalledOnce()
      })

      // Act
      wrapper.unmount()

      // Assert
      expect(destroyMock).toHaveBeenCalledOnce()
    })
  })
})
