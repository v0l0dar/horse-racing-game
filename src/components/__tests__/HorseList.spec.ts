import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { key } from '@/store'
import HorseList from '../HorseList.vue'

interface StoreState {
  horses: Array<{ id: number; name: string; color: string; condition: number }>
}

const createVuexStore = (initialState: Partial<StoreState>) => {
  return createStore({
    state: {
      horses: [],
      ...initialState,
    },
  })
}

describe('HorseList.vue', () => {
  it('renders empty message when no horses', () => {
    const store = createVuexStore({ horses: [] })

    const wrapper = mount(HorseList, {
      global: {
        plugins: [[store, key]],
      },
    })

    expect(wrapper.text()).toContain('No horses loaded')
  })

  it('renders list of horses', () => {
    const mockHorses = [
      { id: 1, name: 'Horse 1', color: '#ffffff', condition: 50 },
      { id: 2, name: 'Horse 2', color: '#000000', condition: 80 },
    ]
    const store = createVuexStore({ horses: mockHorses })

    const wrapper = mount(HorseList, {
      global: {
        plugins: [[store, key]],
      },
    })

    const items = wrapper.findAll('li')
    expect(items).toHaveLength(2)
    expect(wrapper.text()).toContain('Horse 1')
    expect(wrapper.text()).toContain('Horse 2')
    expect(wrapper.text()).toContain('C:50')
  })
})
