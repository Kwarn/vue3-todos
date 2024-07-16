import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Tasks from '../../views/TasksView.vue'

describe('Tasks', () => {
  it('renders properly', () => {
    const wrapper = mount(Tasks, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
