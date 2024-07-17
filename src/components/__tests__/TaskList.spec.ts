import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import TaskList from '@/components/TasksList.vue'
import { useTaskStore } from '@/stores/tasks'
import { createPinia, setActivePinia } from 'pinia'

// see README.md for explanation of why I have commented out some tests

describe('TaskList.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders tasks correctly', () => {
    const taskStore = useTaskStore()
    taskStore.tasks = {
      pending: [
        { id: '1', todo: 'Task 1', completed: false, userId: '1' },
        { id: '2', todo: 'Task 2', completed: true, userId: '1' }
      ],
      completed: []
    }
    const wrapper = mount(TaskList, {
      props: {
        listType: 'pending'
      }
    })

    const taskItems = wrapper.findAll('li')
    expect(taskItems.length).toBe(2)
    expect(taskItems[0].text()).toContain('Task 1')
    expect(taskItems[1].text()).toContain('Task 2')
  })

  it('shows edit and delete buttons on task hover', async () => {
    const taskStore = useTaskStore()
    taskStore.tasks = {
      pending: [{ id: '1', todo: 'Task 1', completed: false, userId: '1' }],
      completed: []
    }
    const wrapper = mount(TaskList, {
      props: {
        listType: 'pending'
      }
    })

    const taskItem = wrapper.find('#list-item-1')
    await taskItem.trigger('mouseover')

    const editButton = taskItem.find('#edit-button')
    const deleteButton = taskItem.find('#delete-button')

    expect(editButton.exists()).toBe(true)
    expect(deleteButton.exists()).toBe(true)
  })

  // it('calls editTask when edit button is clicked', async () => {
  //   const taskStore = useTaskStore()
  //   taskStore.tasks = {
  //     pending: [{ id: '1', todo: 'Task 1', completed: false, userId: '1' }],
  //     completed: []
  //   }
  //   const wrapper = mount(TaskList, {
  //     props: {
  //       listType: 'pending'
  //     }
  //   })

  //   const taskItem = wrapper.find('#list-item-1')
  //   await taskItem.trigger('mouseover')

  //   const editButton = taskItem.find('#edit-button')
  //   const editTaskSpy = vi.spyOn(wrapper.vm, 'editTask')

  //   await editButton.trigger('click')
  //   expect(editTaskSpy).toHaveBeenCalledWith(taskStore.tasks.pending[0])
  // })

  // it('calls deleteTask when delete button is clicked', async () => {
  //   const taskStore = useTaskStore()
  //   taskStore.tasks = {
  //     pending: [{ id: '1', todo: 'Task 1', completed: false, userId: '1' }],
  //     completed: []
  //   }
  //   const wrapper = mount(TaskList, {
  //     props: {
  //       listType: 'pending'
  //     }
  //   })

  //   const taskItem = wrapper.find('#list-item-1')
  //   await taskItem.trigger('mouseover')

  //   const deleteButton = taskItem.find('#delete-button')
  //   const deleteTaskSpy = vi.spyOn(wrapper.vm, 'deleteTask')

  //   await deleteButton.trigger('click')
  //   expect(deleteTaskSpy).toHaveBeenCalledWith('1')
  // })

  // it('emits update:tasks event on tasks change after reordering', async () => {
  //   const tasks = ref([
  //     { id: '1', todo: 'Task 1', completed: false, userId: '1' },
  //     { id: '2', todo: 'Task 2', completed: false, userId: '2' }
  //   ])

  //   const wrapper = mount(TaskList, {
  //     props: {
  //       listType: 'pending',
  //       tasks: tasks.value
  //     }
  //   })

  //   await wrapper.vm.$nextTick()

  //   const draggable = wrapper.findComponent({ name: 'draggable' })
  //   await draggable.trigger('start', { item: wrapper.find('#list-item-2').element })
  //   await draggable.trigger('add', {
  //     newIndex: 0,
  //     newIndexArray: [0],
  //     element: draggable.vm.list[1]
  //   })

  //   await wrapper.vm.$nextTick()

  //   expect(wrapper.emitted('update:tasks')).toBeTruthy()

  //   const emittedTasks = wrapper.emitted('update:tasks')
  //   const reorderedTasks = emittedTasks?.[emittedTasks.length - 1][0]
  //   expect(reorderedTasks).toEqual([
  //     { id: '2', todo: 'Task 2', completed: false, userId: '2' },
  //     { id: '1', todo: 'Task 1', completed: false, userId: '1' }
  //   ])
  // })
  // it('updates localTasks when store tasks change', async () => {
  //   const taskStore = useTaskStore()
  //   taskStore.tasks = {
  //     pending: [{ id: '1', todo: 'Task 1', completed: false, userId: '1' }],
  //     completed: []
  //   }

  //   const wrapper = mount(TaskList, {
  //     props: {
  //       listType: 'pending'
  //     }
  //   })

  //   taskStore.tasks.pending.push({ id: '2', todo: 'Task 2', completed: true, userId: '1' })
  //   await wrapper.vm.$nextTick()

  //   expect(wrapper.localTasks.length).toBe(2)
  // })
})
