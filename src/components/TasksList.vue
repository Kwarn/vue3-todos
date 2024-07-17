<template>
  <div
    :class="[
      'w-full h-full min-h-[200px] flex flex-col items-center justify-center border rounded-lg shadow-md z-10',
      { 'bg-green-100': isDragging }
    ]"
  >
    <draggable
      v-model="localTasks"
      :group="'tasks'"
      class="space-y-4 list-none m-auto w-full h-full flex flex-col p-4 cursor-move"
      item-key="id"
      @change="onTasksChange"
      @dragover="setIsDraggingTrue"
      @dragleave="setIsDraggingFalse"
      @drop="setIsDraggingFalse"
    >
      <template #item="{ element: task, index }">
        <li
          :id="'list-item-' + task.id"
          @mouseover="hoveredTaskIndex = index"
          @mouseleave="hoveredTaskIndex = null"
          class="flex justify-between p-4 border rounded-lg shadow-md w-full relative"
        >
          <p class="flex-1">{{ task.todo }}</p>
          <div :class="task.completed ? 'text-green-500' : 'text-red-500'">
            {{ task.completed ? '✅' : '❌' }}
          </div>
          <div
            v-if="hoveredTaskIndex === index"
            class="absolute w-[70px] top-[-2px] right-10 mt-2 mr-2 bg-white p-3 border border-gray-200 rounded-lg shadow-md flex flex-row justify-between"
          >
            <button
              id="edit-button"
              @click="editTask(task)"
              class="text-blue-500 mr-2 hover:bg-green-200 flex items-center"
            >
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button
              id="delete-button"
              @click="deleteTask(task.id)"
              class="text-red-500 hover:bg-red-200 flex items-center"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </li>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import type { Task, TaskStatus } from '@/types/types'
import draggable from 'vuedraggable'
import { useTaskStore } from '@/stores/tasks'
import { storeToRefs } from 'pinia'

interface Props {
  listType: TaskStatus
}

const props = defineProps<Props>()
const emit = defineEmits(['update:tasks'])

const taskStore = useTaskStore()
const localTasks = ref<Task[]>([])
const { tasks } = storeToRefs(taskStore)

localTasks.value = tasks.value[props.listType]

let isDragging = ref<boolean>(false)
let hoveredTaskIndex = ref<number | null>(null)

function setIsDraggingTrue() {
  console.log('isDragging', isDragging)
  isDragging.value = true
}

function setIsDraggingFalse() {
  isDragging.value = false
}

function editTask(task: Task) {
  taskStore.setEditingTask(task)
}

function deleteTask(taskId: string) {
  taskStore.deleteTask(taskId)
  taskStore.setEditingTask(null)
}

function onTasksChange() {
  emit('update:tasks', { status: props.listType, updatedTasks: localTasks.value })
}

watch(
  () => taskStore.tasks[props.listType],
  (newTasks) => {
    localTasks.value = newTasks
  }
)
</script>
