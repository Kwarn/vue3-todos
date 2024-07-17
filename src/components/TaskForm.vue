<template>
  <div
    class="h-fit mx-auto my-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md sm:w-[400px]"
  >
    <form @submit.prevent="onSubmit" class="space-y-4 h-full">
      <div class="form-group">
        <label for="todo" class="block text-sm font-medium text-gray-700">Task</label>
        <textarea
          id="todo"
          v-model="taskForm.todo"
          required
          aria-required="true"
          class="flex max-h-[150px] min-h-[50px] w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
      <div class="form-group flex items-center">
        <label for="completed" class="mr-2 text-sm font-medium text-gray-700">
          <span>Completed</span>
        </label>
        <input
          type="checkbox"
          id="completed"
          v-model="taskForm.completed"
          aria-labelledby="completed-label"
          class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {{ isEdit ? 'Update Task' : 'Add Task' }}
      </button>
      <button
        type="button"
        @click="resetForm"
        class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Reset
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, computed } from 'vue'
import type { Task } from '@/types/types'
import { useTaskStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'

interface TaskForm {
  todo: string
  completed: boolean
}

const emit = defineEmits<{
  (e: 'add-task', task: TaskForm): void
  (e: 'update-task', task: Task): void
}>()

const taskStore = useTaskStore()
const { editingTask } = storeToRefs(taskStore)

const taskForm = ref<TaskForm>({
  todo: '',
  completed: false
})

const isEdit = computed(() => !!editingTask.value)

watch(editingTask, (newTask) => {
  if (newTask) {
    taskForm.value = {
      todo: newTask.todo || '',
      completed: newTask.completed || false
    }
  } else {
    resetForm()
  }
})

function onSubmit() {
  if (isEdit.value && editingTask.value) {
    emit('update-task', { ...editingTask.value, ...taskForm.value })
  } else {
    emit('add-task', taskForm.value)
  }
  resetForm()
}

function resetForm() {
  taskForm.value = {
    todo: '',
    completed: false
  }
  taskStore.setEditingTask(null)
}
</script>
