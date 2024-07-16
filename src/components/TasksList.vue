<template>
  <div class="tasks-list-container">
    <draggable
      v-model="localTasks"
      :group="'tasks'"
      class="space-y-4 list-none m-auto w-full h-full flex flex-col p-4"
      item-key="id"
      @change="onTasksChange"
    >
      <template #item="{ element: task }">
        <li class="flex justify-between p-4 border rounded-lg shadow-md w-full">
          <p class="flex-1">{{ task.todo }}</p>
          <div :class="task.completed ? 'text-green-500' : 'text-red-500'">
            {{ task.completed ? '✅' : '❌' }}
          </div>
        </li>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, onMounted } from 'vue'
import draggable from 'vuedraggable'
import type { Task, TaskStatus } from '@/types/types'

interface Props {
  listType: TaskStatus
  tasks: Task[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:tasks'])

const localTasks = ref<Task[]>([])

onMounted(() => {
  localTasks.value = [...props.tasks]
})

watch(
  () => props.tasks,
  (newTasks) => {
    localTasks.value = [...newTasks]
  }
)

function onTasksChange() {
  emit('update:tasks', { updatedTasks: localTasks.value, status: props.listType })
}
</script>

<style scoped>
.tasks-list-container {
  @apply w-full h-full min-h-[200px] flex flex-col items-center justify-center border rounded-lg shadow-md;
}

.empty-placeholder {
  @apply w-full h-full flex items-center justify-center;
}
</style>
