<template>
  <div
    :class="[
      'w-full h-full min-h-[200px] flex flex-col items-center justify-center border rounded-lg shadow-md',
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
      @end="handleDragEnd"
    >
      <template #item="{ element: task, index }">
        <li
          :id="'list-item-' + task.id"
          :aria-label="'Task ' + (index + 1)"
          @mouseover="hoveredTaskIndex = index"
          @mouseleave="hoveredTaskIndex = null"
          @click="handleItemClick(index)"
          @keydown.enter.prevent="handleItemClick(index)"
          @keydown.escape="hoveredTaskIndex = null"
          @keydown="handleKeyDown(index, $event)"
          class="flex justify-between p-4 border rounded-lg shadow-md w-full relative"
          tabindex="0"
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
              @keydown.enter.prevent="editTask(task)"
              class="text-blue-500 mr-2 hover:bg-green-200 flex items-center"
            >
              <i class="fas fa-pencil-alt"></i>
              <span class="sr-only">Edit task</span>
            </button>
            <button
              id="delete-button"
              @click="deleteTask(task.id)"
              @keydown.enter.prevent="deleteTask(task.id)"
              class="text-red-500 hover:bg-red-200 flex items-center"
            >
              <i class="fas fa-trash-alt"></i>
              <span class="sr-only">Delete task</span>
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
  isDragging.value = true
}

function setIsDraggingFalse() {
  isDragging.value = false
}

function handleDragEnd() {
  hoveredTaskIndex.value = null
}

function editTask(task: Task) {
  taskStore.setEditingTask(task)
}

function deleteTask(taskId: string) {
  taskStore.deleteTask(taskId)
  taskStore.setEditingTask(null)
}

function handleItemClick(index: number) {
  hoveredTaskIndex.value = hoveredTaskIndex.value === index ? null : index
}

function onTasksChange() {
  emit('update:tasks', { status: props.listType, updatedTasks: localTasks.value })
}

function handleKeyDown(index: number, event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowUp':
      moveItemUp(index)
      break
    case 'ArrowDown':
      moveItemDown(index)
      break
    case 'ArrowLeft':
      moveItemToList(localTasks.value[index].id, 'pending')
      break
    case 'ArrowRight':
      moveItemToList(localTasks.value[index].id, 'completed')
      break
  }
}

function moveItemUp(index: number) {
  if (index > 0) {
    const movedTask = localTasks.value.splice(index, 1)[0]
    localTasks.value.splice(index - 1, 0, movedTask)
    onTasksChange()
  }
}

function moveItemDown(index: number) {
  if (index < localTasks.value.length - 1) {
    const movedTask = localTasks.value.splice(index, 1)[0]
    localTasks.value.splice(index + 1, 0, movedTask)
    onTasksChange()
  }
}

function moveItemToList(taskId: string, targetList: TaskStatus) {
  if (props.listType !== targetList) {
    taskStore.moveTaskToList(props.listType, targetList, taskId)
  }
}

watch(
  () => taskStore.tasks[props.listType],
  (newTasks) => {
    localTasks.value = newTasks
  }
)
</script>
