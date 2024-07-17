import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import TaskForm from '@/components/TaskForm.vue'
import { useTaskStore } from '@/stores/tasks'
import { createPinia, setActivePinia } from 'pinia'

describe('TaskForm.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the form with initial values', () => {
    const wrapper = mount(TaskForm)

    const todoInput = wrapper.find('textarea#todo').element as HTMLTextAreaElement
    const completedInput = wrapper.find('input#completed').element as HTMLInputElement

    expect(todoInput.value).toBe('')
    expect(completedInput.checked).toBe(false)
    expect(wrapper.find('button[type="submit"]').text()).toBe('Add Task')
  })

  it('updates the form values when editingTask is set', async () => {
    const taskStore = useTaskStore()
    const wrapper = mount(TaskForm)
    taskStore.setEditingTask({ id: '1', todo: 'Edit Task', completed: true, userId: '1' })
    await wrapper.vm.$nextTick()
    const todoInput = wrapper.find('textarea#todo').element as HTMLTextAreaElement
    const completedInput = wrapper.find('input#completed').element as HTMLInputElement

    expect(todoInput.value).toBe('Edit Task')
    expect(completedInput.checked).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toBe('Update Task')
  })

  it('emits add-task event with form data on submit', async () => {
    const wrapper = mount(TaskForm)
    const todoInput = wrapper.find('textarea#todo')
    const completedInput = wrapper.find('input#completed').element as HTMLInputElement

    await todoInput.setValue('New Task')
    completedInput.checked = true
    await completedInput.dispatchEvent(new Event('change'))

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('add-task')).toBeTruthy()
    expect(wrapper.emitted('add-task')?.[0]).toEqual([{ todo: 'New Task', completed: true }])
  })

  it('emits update-task event with form data on submit when editing', async () => {
    const taskStore = useTaskStore()
    taskStore.setEditingTask({ id: '1', todo: 'Edit Task', completed: true, userId: '1' })
    const wrapper = mount(TaskForm)

    await wrapper.vm.$nextTick()

    const todoInput = wrapper.find('textarea#todo')
    const completedInput = wrapper.find('input#completed').element as HTMLInputElement

    await todoInput.setValue('Updated Task')
    completedInput.checked = false
    await completedInput.dispatchEvent(new Event('change'))

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('update-task')).toBeTruthy()
    expect(wrapper.emitted('update-task')?.[0]).toEqual([
      { id: '1', todo: 'Updated Task', completed: false, userId: '1' }
    ])
  })

  it('resets the form on reset button click', async () => {
    const taskStore = useTaskStore()
    taskStore.setEditingTask({ id: '1', todo: 'Edit Task', completed: true, userId: '1' })
    const wrapper = mount(TaskForm)

    await wrapper.vm.$nextTick()

    await wrapper.find('button').trigger('click')

    const todoInput = wrapper.find('textarea#todo').element as HTMLTextAreaElement
    const completedInput = wrapper.find('input#completed').element as HTMLInputElement

    expect(todoInput.value).toBe('')
    expect(completedInput.checked).toBe(false)
  })
})
