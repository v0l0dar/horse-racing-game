import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '../App.vue'

describe('App.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders all main components', () => {
    const wrapper = mount(App)

    // Check that all main components are rendered
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('aside').exists()).toBe(true)
  })

  it('has correct layout structure', () => {
    const wrapper = mount(App)

    const main = wrapper.find('main')
    expect(main.exists()).toBe(true)
    expect(main.classes()).toContain('grid')
    expect(main.classes()).toContain('grid-cols-12')
  })

  it('renders header component', () => {
    const wrapper = mount(App)

    // TheHeader should render the title
    expect(wrapper.html()).toContain('Horse Racing')
  })
})
