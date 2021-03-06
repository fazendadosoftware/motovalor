import { mount } from '@vue/test-utils'
import Home from '@/views/Home.vue'

describe('Home.vue', () => {
  test.skip('renders home vue', () => {
    const wrapper = mount(Home)
    expect(wrapper.text()).toMatch('Ready to create an app?')
  })
})
