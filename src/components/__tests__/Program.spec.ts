import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useGameStore } from '@/stores/game'
import Program from '../Program.vue'

describe('Program.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('renders empty message when no schedule', () => {
    const wrapper = mount(Program)
    expect(wrapper.find('[data-test="empty-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="schedule-list"]').exists()).toBe(false)
  })

  it('renders schedule and highlights current round', () => {
    const store = useGameStore()
    store.schedule = [
      { roundId: 1, distance: 1200, horses: [{ id: 1, name: 'H1', color: '#fff', condition: 10 }] },
      { roundId: 2, distance: 1400, horses: [] },
    ]
    store.currentRoundIndex = 1

    const wrapper = mount(Program)

    const rounds = wrapper.findAll('[data-test="round-item"]')
    expect(rounds).toHaveLength(2)
    expect(rounds[0]?.find('[data-test="round-id"]').text()).toBe('Round 1')
    expect(rounds[0]?.find('[data-test="round-distance"]').text()).toBe('1200m')
    expect(rounds[1]?.classes()).toContain('bg-blue-50')
    expect(rounds[0]?.classes()).toContain('opacity-50')
  })

  it('highlights first round when currentRoundIndex is 0', () => {
    const store = useGameStore()
    store.schedule = [
      { roundId: 1, distance: 1200, horses: [{ id: 1, name: 'H1', color: '#fff', condition: 10 }] },
      { roundId: 2, distance: 1400, horses: [] },
    ]
    store.currentRoundIndex = 0

    const wrapper = mount(Program)

    const rounds = wrapper.findAll('[data-test="round-item"]')
    expect(rounds[0]?.classes()).toContain('bg-blue-50')
    expect(rounds[1]?.classes()).not.toContain('bg-blue-50')
  })

  it('renders all 6 rounds correctly', () => {
    const store = useGameStore()
    store.schedule = Array.from({ length: 6 }, (_, i) => ({
      roundId: i + 1,
      distance: 1200 + i * 200,
      horses: [],
    }))
    store.currentRoundIndex = 2

    const wrapper = mount(Program)

    const rounds = wrapper.findAll('[data-test="round-item"]')
    expect(rounds).toHaveLength(6)
    rounds.forEach((round, index) => {
      expect(round.find('[data-test="round-id"]').text()).toBe(`Round ${index + 1}`)
      expect(round.find('[data-test="round-distance"]').text()).toBe(`${1200 + index * 200}m`)
    })
  })

  it('displays horses in each round', () => {
    const store = useGameStore()
    store.schedule = [
      {
        roundId: 1,
        distance: 1200,
        horses: [
          { id: 1, name: 'Horse 1', color: '#ff0000', condition: 50 },
          { id: 2, name: 'Horse 2', color: '#00ff00', condition: 60 },
        ],
      },
    ]
    store.currentRoundIndex = 0

    const wrapper = mount(Program)

    expect(wrapper.text()).toContain('Horse 1')
    expect(wrapper.text()).toContain('Horse 2')
  })

  it('applies opacity to completed rounds', () => {
    const store = useGameStore()
    store.schedule = [
      { roundId: 1, distance: 1200, horses: [] },
      { roundId: 2, distance: 1400, horses: [] },
      { roundId: 3, distance: 1600, horses: [] },
    ]
    store.currentRoundIndex = 2

    const wrapper = mount(Program)

    const rounds = wrapper.findAll('[data-test="round-item"]')
    expect(rounds[0]?.classes()).toContain('opacity-50')
    expect(rounds[1]?.classes()).toContain('opacity-50')
    expect(rounds[2]?.classes()).not.toContain('opacity-50')
  })

  it('handles empty schedule gracefully', () => {
    const store = useGameStore()
    store.schedule = []

    const wrapper = mount(Program)

    expect(wrapper.find('[data-test="empty-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="schedule-list"]').exists()).toBe(false)
  })
})
