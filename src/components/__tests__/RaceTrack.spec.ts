import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useGameStore } from '@/stores/game'
import RaceTrack from '../RaceTrack.vue'

const mockHorse1 = { id: 1, name: 'Bolt', color: '#ff0000', condition: 100 }
const mockHorse2 = { id: 2, name: 'Dash', color: '#00ff00', condition: 90 }

describe('RaceTrack.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('renders empty state when no round active', () => {
    const wrapper = mount(RaceTrack)
    expect(wrapper.find('[data-test="empty-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="track-lanes"]').exists()).toBe(false)
  })

  it('renders lanes and horses when round is active', () => {
    const store = useGameStore()

    store.schedule = [{ roundId: 1, distance: 1200, horses: [mockHorse1, mockHorse2] }]
    store.currentRoundIndex = 0
    store.currentRacePositions = [
      { id: 1, progress: 50, finished: false, time: 0 },
      { id: 2, progress: 20, finished: false, time: 0 },
    ]
    store.isRaceRunning = true

    const wrapper = mount(RaceTrack)

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

  it('renders correct number of lanes for 10 horses', () => {
    const store = useGameStore()
    const horses = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Horse ${i + 1}`,
      color: '#fff',
      condition: 50,
    }))

    store.schedule = [{ roundId: 1, distance: 1200, horses }]
    store.currentRoundIndex = 0
    store.currentRacePositions = horses.map(h => ({
      id: h.id,
      progress: 0,
      finished: false,
      time: 0,
    }))

    const wrapper = mount(RaceTrack)

    expect(wrapper.findAll('[data-test="horse-lane"]')).toHaveLength(10)
  })

  it('displays correct round information', () => {
    const store = useGameStore()
    store.schedule = [
      { roundId: 1, distance: 1200, horses: [mockHorse1] },
      { roundId: 2, distance: 2000, horses: [mockHorse1] },
    ]
    store.currentRoundIndex = 1
    store.currentRacePositions = [{ id: 1, progress: 0, finished: false, time: 0 }]

    const wrapper = mount(RaceTrack)

    expect(wrapper.find('[data-test="round-info"]').text()).toBe('Round 2 — 2000m')
  })

  it('calculates progress position correctly for 0%', () => {
    const store = useGameStore()
    store.schedule = [{ roundId: 1, distance: 1200, horses: [mockHorse1] }]
    store.currentRoundIndex = 0
    store.currentRacePositions = [{ id: 1, progress: 0, finished: false, time: 0 }]

    const wrapper = mount(RaceTrack)

    const runner = wrapper.find('[data-test="horse-runner-1"]')
    expect(runner.attributes('style')).toContain('left: calc(0% - 2rem)')
  })

  it('calculates progress position correctly for 100%', () => {
    const store = useGameStore()
    store.schedule = [{ roundId: 1, distance: 1200, horses: [mockHorse1] }]
    store.currentRoundIndex = 0
    store.currentRacePositions = [{ id: 1, progress: 100, finished: true, time: 1000 }]

    const wrapper = mount(RaceTrack)

    const runner = wrapper.find('[data-test="horse-runner-1"]')
    expect(runner.attributes('style')).toContain('left: calc(100% - 2rem)')
  })

  it('handles missing position data gracefully', () => {
    const store = useGameStore()
    store.schedule = [{ roundId: 1, distance: 1200, horses: [mockHorse1] }]
    store.currentRoundIndex = 0
    store.currentRacePositions = []

    const wrapper = mount(RaceTrack)

    const runner = wrapper.find('[data-test="horse-runner-1"]')
    expect(runner.attributes('style')).toContain('left: calc(0% - 2rem)')
  })

  it('displays lane numbers correctly', () => {
    const store = useGameStore()
    const horses = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      name: `Horse ${i + 1}`,
      color: '#fff',
      condition: 50,
    }))

    store.schedule = [{ roundId: 1, distance: 1200, horses }]
    store.currentRoundIndex = 0
    store.currentRacePositions = horses.map(h => ({
      id: h.id,
      progress: 0,
      finished: false,
      time: 0,
    }))

    const wrapper = mount(RaceTrack)

    const lanes = wrapper.findAll('[data-test="horse-lane"]')
    lanes.forEach((lane, index) => {
      expect(lane.text()).toContain(`${index + 1}`)
    })
  })
})
