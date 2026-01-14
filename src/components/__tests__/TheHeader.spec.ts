import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useGameStore } from '@/stores/game'
import TheHeader from '../TheHeader.vue'

describe('TheHeader.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders header with title and buttons', () => {
    const wrapper = mount(TheHeader)
    
    expect(wrapper.find('h1').text()).toContain('Horse Racing')
    expect(wrapper.find('[data-test="generate-btn"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="start-btn"]').exists()).toBe(true)
  })

  it('disables generate button when race is running', () => {
    const store = useGameStore()
    store.isRaceRunning = true

    const wrapper = mount(TheHeader)
    const generateBtn = wrapper.find('[data-test="generate-btn"]')
    
    expect(generateBtn.attributes('disabled')).toBeDefined()
  })

  it('enables generate button when race is not running', () => {
    const store = useGameStore()
    store.isRaceRunning = false

    const wrapper = mount(TheHeader)
    const generateBtn = wrapper.find('[data-test="generate-btn"]')
    
    expect(generateBtn.attributes('disabled')).toBeUndefined()
  })

  it('disables start button when no schedule exists', () => {
    const store = useGameStore()
    store.schedule = []
    store.isRaceRunning = false

    const wrapper = mount(TheHeader)
    const startBtn = wrapper.find('[data-test="start-btn"]')
    
    expect(startBtn.attributes('disabled')).toBeDefined()
  })

  it('disables start button when race is running', () => {
    const store = useGameStore()
    store.schedule = [{ roundId: 1, distance: 1200, horses: [] }]
    store.isRaceRunning = true

    const wrapper = mount(TheHeader)
    const startBtn = wrapper.find('[data-test="start-btn"]')
    
    expect(startBtn.attributes('disabled')).toBeDefined()
  })

  it('disables start button when game is finished', () => {
    const store = useGameStore()
    store.schedule = [
      { roundId: 1, distance: 1200, horses: [] },
      { roundId: 2, distance: 1400, horses: [] },
    ]
    store.currentRoundIndex = 2
    store.isRaceRunning = false

    const wrapper = mount(TheHeader)
    const startBtn = wrapper.find('[data-test="start-btn"]')
    
    expect(startBtn.attributes('disabled')).toBeDefined()
  })

  it('enables start button when schedule exists and race is not running', () => {
    const store = useGameStore()
    store.schedule = [{ roundId: 1, distance: 1200, horses: [] }]
    store.currentRoundIndex = 0
    store.isRaceRunning = false

    const wrapper = mount(TheHeader)
    const startBtn = wrapper.find('[data-test="start-btn"]')
    
    expect(startBtn.attributes('disabled')).toBeUndefined()
  })

  it('shows "Racing..." text when race is running', () => {
    const store = useGameStore()
    store.isRaceRunning = true

    const wrapper = mount(TheHeader)
    const startBtn = wrapper.find('[data-test="start-btn"]')
    
    expect(startBtn.text()).toContain('Racing...')
  })

  it('shows "Start Race" text when race is not running', () => {
    const store = useGameStore()
    store.isRaceRunning = false

    const wrapper = mount(TheHeader)
    const startBtn = wrapper.find('[data-test="start-btn"]')
    
    expect(startBtn.text()).toContain('Start Race')
  })

  it('calls generateHorses and generateSchedule when generate button is clicked', async () => {
    const store = useGameStore()
    const generateHorsesSpy = vi.spyOn(store, 'generateHorses')
    const generateScheduleSpy = vi.spyOn(store, 'generateSchedule')

    const wrapper = mount(TheHeader)
    const generateBtn = wrapper.find('[data-test="generate-btn"]')
    
    await generateBtn.trigger('click')

    expect(generateHorsesSpy).toHaveBeenCalledOnce()
    expect(generateScheduleSpy).toHaveBeenCalledOnce()
  })

  it('calls startRace when start button is clicked', async () => {
    const store = useGameStore()
    store.schedule = [{ roundId: 1, distance: 1200, horses: [] }]
    store.currentRoundIndex = 0
    const startRaceSpy = vi.spyOn(store, 'startRace').mockResolvedValue()

    const wrapper = mount(TheHeader)
    const startBtn = wrapper.find('[data-test="start-btn"]')
    
    await startBtn.trigger('click')

    expect(startRaceSpy).toHaveBeenCalledOnce()
  })

  it('does not call startRace when button is disabled', async () => {
    const store = useGameStore()
    store.schedule = []
    const startRaceSpy = vi.spyOn(store, 'startRace')

    const wrapper = mount(TheHeader)
    const startBtn = wrapper.find('[data-test="start-btn"]')
    
    await startBtn.trigger('click')

    expect(startRaceSpy).not.toHaveBeenCalled()
  })
})
