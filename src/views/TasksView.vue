<template>
  <div class="mx-auto p-4 flex justify-evenly">
    <LoadingIndicator v-if="isLoading" />
    <div v-else class="flex justify-evenly flex-col w-full">
      <div>
        <TaskForm @add-task="onFormSubmitCreate" @update-task="onFormSubmitUpdate" />
      </div>

      <p class="m-auto mt-0">* drag and drop tasks</p>

      <div class="flex justify-between flex-col md:flex-row">
        <div class="tasks-list flex justify-center flex-col">
          <h3 class="m-auto my-2">Todo</h3>
          <TasksList listType="pending" @update:tasks="toggleStatus" />
        </div>

        <div class="tasks-list flex justify-center flex-col">
          <h3 class="m-auto my-2">Completed</h3>
          <TasksList listType="completed" @update:tasks="toggleStatus" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task, TaskStatus } from '@/types/types'
import { useTaskStore } from '@/stores/tasks'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import TasksList from '@/components/TasksList.vue'
import TaskForm from '@/components/TaskForm.vue'
import { v4 as uuid } from 'uuid'

/* 
  Hello :)
    dummyjson.com mocks mutation requests (POST/PATCH/DELETE) we can't use it to actually update tasks.
    I've opted to use dummyjson.com to fetch initial tasks and then manage them locally with a persisted pinia store.
    the alternative would be to make the dummy requests and use the response to update the local store.
    if this is what was intended I am happy to make the changes.
*/

const taskStore = useTaskStore()
const { addTask, addTasks, updateTasks, updateTask } = taskStore
const { tasks } = storeToRefs(taskStore)
const isLoading = ref<boolean>(true)

onMounted(async () => {
  // prevent fetching initial tasks if persisted pinia store already has tasks
  if (tasks.value.pending.length || tasks.value.completed.length) {
    isLoading.value = false
    return
  }
  try {
    const res = await fetch('https://dummyjson.com/todos?limit=5')
    const { todos } = await res.json()
    // switching int id to uuid to avoid random conflicts when creating new tasks
    const newTasks = todos.map((task: Task) => ({ ...task, id: uuid(), userId: uuid() }))
    addTasks(newTasks as Task[])
    isLoading.value = false
  } catch (error) {
    console.error(error)
    isLoading.value = false
  }
})

function toggleStatus({ status, updatedTasks }: { status: TaskStatus; updatedTasks: Task[] }) {
  updateTasks(status, updatedTasks)
}

function onFormSubmitCreate(newTask: Partial<Task>) {
  addTask({
    id: uuid(),
    userId: uuid(),
    todo: newTask?.todo ?? '',
    completed: newTask.completed ?? false
  })
}

function onFormSubmitUpdate(updatedTask: Task) {
  updateTask(updatedTask)
}
</script>

<style scoped>
.tasks-list {
  @apply w-full md:m-4;
}
</style>
