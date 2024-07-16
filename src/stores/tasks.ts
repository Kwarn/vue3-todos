import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Task, Tasks, TaskStatus } from '@/types/types'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Tasks>({ pending: [], completed: [] })

  function addTask(task: Task) {
    if (task.completed) tasks.value.completed.push(task)
    else tasks.value.pending.push(task)
    console.log('called', task)
  }

  function addTasks(newTasks: Task[]) {
    newTasks.forEach((task) => addTask(task))
  }

  function updateTasks(status: TaskStatus, updatedTasks: Task[]) {
    tasks.value[status] = updatedTasks.map((task) =>
      status === 'pending' ? { ...task, completed: false } : { ...task, completed: true }
    )
  }

  return { tasks, addTask, addTasks, updateTasks }
})
