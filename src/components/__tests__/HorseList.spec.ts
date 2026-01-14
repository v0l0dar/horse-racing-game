import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useGameStore } from '@/stores/game'
import HorseList from '../HorseList.vue'

describe('HorseList.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('renders empty message when no horses', () => {
    const wrapper = mount(HorseList)
    expect(wrapper.text()).toContain('No horses loaded')
    expect(wrapper.find('[data-test="horse-list-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="horse-list"]').exists()).toBe(false)
  })

  it('renders list of horses', () => {
    const store = useGameStore()
    store.horses = [
      { id: 1, name: 'Horse 1', color: '#ffffff', condition: 50 },
      { id: 2, name: 'Horse 2', color: '#000000', condition: 80 },
    ]

    const wrapper = mount(HorseList)

    const items = wrapper.findAll('li')
    expect(items).toHaveLength(2)
    expect(wrapper.text()).toContain('Horse 1')
    expect(wrapper.text()).toContain('Horse 2')
    expect(wrapper.text()).toContain('C:50')
    expect(wrapper.text()).toContain('C:80')
  })

  it('renders all 20 horses when generated', () => {
    const store = useGameStore()
    store.generateHorses()

    const wrapper = mount(HorseList)

    const items = wrapper.findAll('[data-test="horse-item"]')
    expect(items).toHaveLength(20)
  })

  it('displays horse colors correctly', () => {
    const store = useGameStore()
    store.horses = [
      { id: 1, name: 'Horse 1', color: '#ff0000', condition: 50 },
      { id: 2, name: 'Horse 2', color: '#00ff00', condition: 80 },
    ]

    const wrapper = mount(HorseList)

    const items = wrapper.findAll('[data-test="horse-item"]')
    expect(items[0]?.html()).toContain('background-color: rgb(255, 0, 0)')
    expect(items[1]?.html()).toContain('background-color: rgb(0, 255, 0)')
  })

  it('displays condition values correctly', () => {
    const store = useGameStore()
    store.horses = [
      { id: 1, name: 'Horse 1', color: '#fff', condition: 1 },
      { id: 2, name: 'Horse 2', color: '#fff', condition: 100 },
      { id: 3, name: 'Horse 3', color: '#fff', condition: 50 },
    ]

    const wrapper = mount(HorseList)

    expect(wrapper.text()).toContain('C:1')
    expect(wrapper.text()).toContain('C:100')
    expect(wrapper.text()).toContain('C:50')
  })

  it('shows correct header text', () => {
    const wrapper = mount(HorseList)
    expect(wrapper.text()).toContain('Horse List (1-20)')
  })

  it('renders empty list when horses array is empty', () => {
    const store = useGameStore()
    store.horses = []

    const wrapper = mount(HorseList)

    expect(wrapper.find('[data-test="horse-list-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="horse-list"]').exists()).toBe(false)
  })
})
