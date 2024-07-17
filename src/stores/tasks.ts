import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Task, Tasks, TaskStatus } from '@/types/types'

export const useTaskStore = defineStore(
  'tasks',
  () => {
    const tasks = ref<Tasks>({ pending: [], completed: [] })
    const editingTask = ref<Task | null>(null)

    function addTask(task: Task) {
      if (task.completed) tasks.value.completed.push(task)
      else tasks.value.pending.push(task)
    }

    function addTasks(newTasks: Task[]) {
      newTasks.forEach((task) => addTask(task))
    }

    function updateTasks(status: TaskStatus, updatedTasks: Task[]) {
      tasks.value[status] = updatedTasks.map((task) =>
        status === 'pending' ? { ...task, completed: false } : { ...task, completed: true }
      )
    }

    function updateTask(updatedTask: Task) {
      const currentStatus: TaskStatus = updatedTask.completed ? 'completed' : 'pending'
      const oppositeStatus: TaskStatus = !updatedTask.completed ? 'completed' : 'pending'

      const taskIndex = tasks.value[currentStatus].findIndex((task) => task.id === updatedTask.id)

      if (taskIndex !== -1) {
        // update the task in the same list if status has not changed
        tasks.value[currentStatus][taskIndex] = { ...updatedTask }
      } else {
        // remove the task from the opposite list if it exists there
        const oppositeTaskIndex = tasks.value[oppositeStatus].findIndex(
          (task) => task.id === updatedTask.id
        )
        if (oppositeTaskIndex !== -1) {
          tasks.value[oppositeStatus].splice(oppositeTaskIndex, 1)
        }

        // add the task to the new status list
        tasks.value[currentStatus].push(updatedTask)
      }
    }

    function setEditingTask(task: Task | null) {
      editingTask.value = task
    }

    function deleteTask(taskId: string) {
      const taskStatus: TaskStatus = tasks.value.pending.find((task) => task.id === taskId)
        ? 'pending'
        : 'completed'
      const taskIndex = tasks.value[taskStatus].findIndex((task) => task.id === taskId)

      if (taskIndex !== -1) {
        tasks.value[taskStatus].splice(taskIndex, 1)
      }
    }

    return {
      tasks,
      editingTask,
      addTasks,
      addTask,
      updateTasks,
      updateTask,
      setEditingTask,
      deleteTask
    }
  },
  {
    persist: {
      key: 'task-store',
      storage: localStorage
    }
  }
)
