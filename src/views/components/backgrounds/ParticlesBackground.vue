<template>
  <div
    id="particles-background"
    aria-hidden="true"
    class="fixed inset-0 z-0"
  />
</template>

<script lang="ts" setup>
  import { tsParticles } from '@tsparticles/engine'
  import { loadSlim } from '@tsparticles/slim'
  import { onBeforeUnmount, onMounted } from 'vue'

  let container: Awaited<ReturnType<typeof tsParticles.load>>

  onMounted(async () => {
    await loadSlim(tsParticles)

    container = await tsParticles.load({
      id: 'particles-background',
      options: {
        fullScreen: {
          enable: false,
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 150,
            density: {
              enable: true,
            },
          },
          color: {
            value: ['#818cf8', '#a5b4fc', '#c4b5fd'],
          },
          opacity: {
            value: 0.25,
            random: {
              enable: true,
              minimumValue: 0.1,
            },
          },
          size: {
            value: {
              min: 1,
              max: 3,
            },
          },
          links: {
            enable: true,
            distance: 130,
            color: '#818cf8',
            opacity: 0.1,
            width: 3,
          },
          move: {
            enable: true,
            speed: 0.4,
            direction: 'none',
            random: true,
            straight: false,
            outModes: {
              default: 'out',
            },
          },
        },
        interactivity: {
          detectsOn: 'window',
          events: {
            onHover: {
              enable: true,
              mode: 'repulse',
            },
          },
          modes: {
            repulse: {
              distance: 50,
              speed: 0.02,
            },
          },
        },
        detectRetina: true,
      },
    })
  })

  onBeforeUnmount(() => {
    container?.destroy()
  })
</script>
