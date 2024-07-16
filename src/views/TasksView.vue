<template>
  <div class="mx-auto p-4 flex flex-row justify-evenly">
    <LoadingIndicator v-if="isLoading" />
    <div v-else class="flex flex-row justify-evenly w-full">
      <div class="tasks-list">
        <h3>Pending Tasks</h3>
        <TasksList listType="pending" :tasks="tasks.pending" @update:tasks="toggleStatus" />
      </div>

      <div class="tasks-list">
        <h3>Completed Tasks</h3>
        <TasksList listType="completed" :tasks="tasks.completed" @update:tasks="toggleStatus" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import type { Task, TaskStatus } from '@/types/types'
import { useTaskStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'
import TasksList from '@/components/TasksList.vue'

const tasksStore = useTaskStore()
const { addTasks, updateTasks } = tasksStore
const { tasks } = storeToRefs(tasksStore)
const isLoading = ref<boolean>(false)

onMounted(async () => {
  try {
    isLoading.value = true
    const res = await fetch('https://dummyjson.com/todos?limit=5')
    const { todos } = await res.json()
    addTasks(todos as Task[])
    isLoading.value = false
  } catch (error) {
    console.error(error)
    isLoading.value = false
  }
})

function toggleStatus({ updatedTasks, status }: { updatedTasks: Task[]; status: TaskStatus }) {
  updateTasks(status, updatedTasks)
}

watch(
  () => tasks,
  (newTasks: any) => {
    console.log(newTasks)
  }
)
</script>

<style scoped>
.tasks-list {
  @apply w-full m-4;
}
</style>
