import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useGameStore } from '@/stores/game'
import Results from '../Results.vue'

describe('Results.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('renders waiting message initially', () => {
    const wrapper = mount(Results)
    expect(wrapper.text()).toContain('Waiting for results')
  })

  it('displays winner information correctly', () => {
    const store = useGameStore()
    const mockHorse = { id: 1, name: 'Speedy', color: '#ff0000', condition: 90 }

    store.results = [
      {
        roundId: 1,
        distance: 1200,
        winner: mockHorse,
        allResults: [mockHorse, { id: 2, name: 'Slow', color: '#000', condition: 10 }],
      },
    ]

    const wrapper = mount(Results)

    expect(wrapper.text()).toContain('Speedy')
    expect(wrapper.text()).toContain('Round 1')
    expect(wrapper.text()).toContain('🏆')
  })
})
