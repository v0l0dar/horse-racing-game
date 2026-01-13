import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { key } from '@/store'
import RaceTrack from '../RaceTrack.vue'

const mockHorse1 = { id: 1, name: 'Bolt', color: '#ff0000', condition: 100 }
const mockHorse2 = { id: 2, name: 'Dash', color: '#00ff00', condition: 90 }

interface RacePosition {
  id: number
  progress: number
  finished: boolean
}

interface RaceRound {
  roundId: number
  distance: number
  horses: (typeof mockHorse1)[]
}

interface RaceState {
  schedule: RaceRound[]
  currentRoundIndex: number
  isRaceRunning: boolean
  currentRacePositions: RacePosition[]
}

const createVuexStore = (stateOverride: Partial<RaceState> = {}) => {
  return createStore({
    state: {
      schedule: [],
      currentRoundIndex: 0,
      isRaceRunning: false,
      currentRacePositions: [],
      ...stateOverride,
    },
    getters: {
      currentRound: (state: RaceState) => {
        return state.schedule[state.currentRoundIndex] || null
      },
    },
  })
}

describe('RaceTrack.vue', () => {
  it('renders empty state when no round active', () => {
    const store = createVuexStore({ schedule: [] })
    const wrapper = mount(RaceTrack, {
      global: { plugins: [[store, key]] },
    })
    expect(wrapper.find('[data-test="empty-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="track-lanes"]').exists()).toBe(false)
  })

  it('renders lanes and horses when round is active', () => {
    const mockSchedule = [{ roundId: 1, distance: 1200, horses: [mockHorse1, mockHorse2] }]

    const mockPositions = [
      { id: 1, progress: 50, finished: false },
      { id: 2, progress: 20, finished: false },
    ]

    const store = createVuexStore({
      schedule: mockSchedule,
      currentRoundIndex: 0,
      currentRacePositions: mockPositions,
      isRaceRunning: true,
    })
    const wrapper = mount(RaceTrack, {
      global: { plugins: [[store, key]] },
    })

    expect(wrapper.find('[data-test="round-info"]').text()).toBe('Round 1 — 1200m')

    expect(wrapper.findAll('[data-test="horse-lane"]')).toHaveLength(2)

    const runner1 = wrapper.find('[data-test="horse-runner-1"]')
    expect(runner1.exists()).toBe(true)
    expect(runner1.text()).toContain('Bolt')

    expect(runner1.attributes('style')).toContain('left: calc(50% - 2rem)')

    const runner2 = wrapper.find('[data-test="horse-runner-2"]')
    expect(runner2.exists()).toBe(true)
    expect(runner2.text()).toContain('Dash')
    expect(runner2.attributes('style')).toContain('left: calc(20% - 2rem)')
  })
})
