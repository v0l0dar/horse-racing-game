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
  })
})
