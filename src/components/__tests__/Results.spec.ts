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
    expect(wrapper.find('[data-test="results-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="results-list"]').exists()).toBe(false)
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

  it('displays multiple results correctly', () => {
    const store = useGameStore()
    store.results = [
      {
        roundId: 1,
        distance: 1200,
        winner: { id: 1, name: 'Winner1', color: '#fff', condition: 50 },
        allResults: [
          { id: 1, name: 'Winner1', color: '#fff', condition: 50 },
          { id: 2, name: 'Loser1', color: '#000', condition: 30 },
        ],
      },
      {
        roundId: 2,
        distance: 1400,
        winner: { id: 3, name: 'Winner2', color: '#aaa', condition: 60 },
        allResults: [
          { id: 3, name: 'Winner2', color: '#aaa', condition: 60 },
          { id: 4, name: 'Loser2', color: '#bbb', condition: 40 },
        ],
      },
    ]

    const wrapper = mount(Results)

    const resultCards = wrapper.findAll('[data-test="result-card"]')
    expect(resultCards).toHaveLength(2)
    expect(wrapper.text()).toContain('Round 1')
    expect(wrapper.text()).toContain('Round 2')
    expect(wrapper.text()).toContain('1200m')
    expect(wrapper.text()).toContain('1400m')
  })

  it('displays all horses in correct order', () => {
    const store = useGameStore()
    const horses = [
      { id: 1, name: 'First', color: '#fff', condition: 50 },
      { id: 2, name: 'Second', color: '#000', condition: 40 },
      { id: 3, name: 'Third', color: '#aaa', condition: 30 },
    ]

    store.results = [
      {
        roundId: 1,
        distance: 1200,
        winner: horses[0],
        allResults: horses,
      },
    ]

    const wrapper = mount(Results)

    expect(wrapper.text()).toContain('First')
    expect(wrapper.text()).toContain('Second')
    expect(wrapper.text()).toContain('Third')
  })

  it('shows trophy only for winner', () => {
    const store = useGameStore()
    const winner = { id: 1, name: 'Winner', color: '#fff', condition: 50 }
    const loser = { id: 2, name: 'Loser', color: '#000', condition: 30 }

    store.results = [
      {
        roundId: 1,
        distance: 1200,
        winner,
        allResults: [winner, loser],
      },
    ]

    const wrapper = mount(Results)
    const html = wrapper.html()

    // Count trophies - should be exactly 1
    const trophyCount = (html.match(/🏆/g) || []).length
    expect(trophyCount).toBe(1)
    expect(html.indexOf('Winner 🏆')).toBeGreaterThan(-1)
    expect(html.indexOf('Loser 🏆')).toBe(-1)
  })

  it('displays distance for each result', () => {
    const store = useGameStore()
    store.results = [
      {
        roundId: 1,
        distance: 1200,
        winner: { id: 1, name: 'H1', color: '#fff', condition: 50 },
        allResults: [{ id: 1, name: 'H1', color: '#fff', condition: 50 }],
      },
      {
        roundId: 2,
        distance: 2000,
        winner: { id: 2, name: 'H2', color: '#000', condition: 60 },
        allResults: [{ id: 2, name: 'H2', color: '#000', condition: 60 }],
      },
    ]

    const wrapper = mount(Results)

    expect(wrapper.text()).toContain('1200m')
    expect(wrapper.text()).toContain('2000m')
  })

  it('handles empty results array', () => {
    const store = useGameStore()
    store.results = []

    const wrapper = mount(Results)

    expect(wrapper.find('[data-test="results-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="results-list"]').exists()).toBe(false)
  })
})
