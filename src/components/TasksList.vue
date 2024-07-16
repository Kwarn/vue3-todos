<template>
  <draggable
    v-model="localTasks"
    :group="'tasks'"
    class="space-y-4 list-none m-auto"
    item-key="id"
    @change="onTasksChange"
  >
    <template #item="{ element: task }">
      <li class="flex justify-between items-center p-4 border rounded-lg shadow-md">
        <p class="flex-1">{{ task.todo }}</p>
        <div :class="task.completed ? 'text-green-500' : 'text-red-500'">
          {{ task.completed ? '✅' : '❌' }}
        </div>
      </li>
    </template>
  </draggable>
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
    console.log('new tasks', newTasks)
    localTasks.value.splice(0, localTasks.value.length, ...newTasks)
  }
)

function onTasksChange() {
  emit('update:tasks', { updatedTasks: localTasks.value, status: props.listType })
}
</script>
