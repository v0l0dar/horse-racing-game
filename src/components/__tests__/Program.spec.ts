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

    const rounds = wrapper.findAll('.p-3')
    expect(rounds).toHaveLength(2)
    expect(rounds[0]?.find('[data-test="round-id"]').text()).toBe('Round 1')
    expect(rounds[0]?.find('[data-test="round-distance"]').text()).toBe('1200m')
    expect(rounds[1]?.classes()).toContain('bg-blue-50')
    expect(rounds[0]?.classes()).toContain('opacity-50')
  })
})
