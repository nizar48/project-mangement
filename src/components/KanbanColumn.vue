<script setup lang="ts">
import { ref } from 'vue'
import type { Column } from '../stores/issueStore.ts'
import KanbanTask from './KanbanTask.vue'

interface Props {
  column: Column
}

const props = defineProps<Props>()
const emit = defineEmits(['task-moved'])


const isDraggingOver = ref(false)

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDraggingOver.value = true
}

const onDragLeave = () => {
  isDraggingOver.value = false
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  isDraggingOver.value = false
  if (!event.dataTransfer) return

  const taskId = parseInt(event.dataTransfer.getData('taskId'))
  const sourceColumnId = event.dataTransfer.getData('sourceColumnId')
  const targetColumnId = props.column.id

  // if dropped in the same column, do nothing
  if (sourceColumnId === targetColumnId) return

  // add to end of list
  const position = props.column.tasks.length


  emit('task-moved', {taskId, sourceColumnId, targetColumnId, position})
}
</script>

<template>
  <div
      :class="[
      'flex h-full flex-col overflow-y-auto rounded-lg border bg-gray-50 p-3 shadow-sm',
      isDraggingOver ? 'border-green-500 bg-green-50' : 'border-gray-200',
    ]"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
  >
    <!-- col header -->
    <div class="flex items-center justify-between pb-2">
      <h3 class="text-sm font-semibold text-gray-600">{{ column.title.toUpperCase() }}</h3>
      <span class="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
        {{ column.tasks.length }}
      </span>
    </div>

    <!-- task list -->
    <div class="flex-1 overflow-y-auto">
      <KanbanTask v-for="task in column.tasks" :key="task.id" :task="task" :column-id="column.id"/>
    </div>
  </div>
</template>