import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { key } from '@/store'
import Results from '../Results.vue'

const createVuexStore = (stateOverride: Record<string, unknown> = {}) => {
  return createStore({
    state: {
      results: [],
      ...stateOverride,
    },
  })
}

describe('Results.vue', () => {
  it('renders waiting message initially', () => {
    const store = createVuexStore()
    const wrapper = mount(Results, {
      global: { plugins: [[store, key]] },
    })
    expect(wrapper.text()).toContain('Waiting for results')
  })

  it('displays winner information correctly', () => {
    const mockHorse = { id: 1, name: 'Speedy', color: '#ff0000', condition: 90 }
    const mockResults = [
      {
        roundId: 1,
        distance: 1200,
        winner: mockHorse,
        allResults: [mockHorse, { id: 2, name: 'Slow', color: '#000', condition: 10 }],
      },
    ]

    const store = createVuexStore({ results: mockResults })
    const wrapper = mount(Results, {
      global: { plugins: [[store, key]] },
    })

    expect(wrapper.text()).toContain('Speedy')
    expect(wrapper.text()).toContain('Round 1')

    expect(wrapper.text()).toContain('🏆')
  })
})
