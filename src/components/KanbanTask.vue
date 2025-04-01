<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '../stores/issueStore.ts'

interface Props {
  task: Task
  columnId: string | number
}

const props = defineProps<Props>()
const emit = defineEmits(['drag-start'])

// card state if details are shown or not
const showDetails = ref(false)

// toggle task details
const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'low':
      return 'bg-blue-100 text-blue-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'high':
      return 'bg-orange-100 text-orange-800'
    case 'critical':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'bug':
      return 'bg-red-100 text-red-800'
    case 'feature':
      return 'bg-green-100 text-green-800'
    case 'task':
      return 'bg-blue-100 text-blue-800'
    case 'epic':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// handle drag start
const onDragStart = (event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('taskId', props.task.id.toString())
    event.dataTransfer.setData('sourceColumnId', props.columnId.toString())
    event.dataTransfer.effectAllowed = 'move'

    emit('drag-start', {taskId: props.task.id, columnId: props.columnId})
  }
}
</script>

<template>
  <div
      class="mb-2 cursor-grab rounded-md border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
      draggable="true"
      @dragstart="onDragStart"
      @click="toggleDetails"
  >
    <div class="mb-2 flex items-center justify-between">
      <span :class="['rounded-md px-2 py-0.5 text-xs font-medium', getTypeColor(task.type)]">
        {{ task.type }}
      </span>
      <span :class="['rounded-md px-2 py-0.5 text-xs font-medium', getPriorityColor(task.priority)]">
        {{ task.priority }}
      </span>
    </div>

    <h4 class="mb-2 text-sm font-medium text-gray-800">{{ task.title }}</h4>

    <p v-if="task.description && !showDetails" class="mb-3 text-xs text-gray-600">
      {{ task.description.length > 100 ? `${ task.description.substring(0, 100) }...` : task.description }}
    </p>

    <div v-if="!showDetails" class="mt-2 flex flex-col flex-wrap items-start gap-2 text-xs text-gray-600">
      <div><span class="font-medium">Reporter:</span> {{ task.reporter }}</div>
      <div v-if="task.assignees.length" class="flex items-center gap-1">
        <span class="font-medium">Assignees:</span>
        <div class="flex -space-x-1 overflow-hidden">
          <span
              v-for="(assignee, index) in task.assignees.slice(0, 3)"
              :key="index"
              class="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-white bg-gray-200 text-xs"
              :title="assignee"
          >
            {{ assignee.charAt(0) }}
          </span>
          <span
              v-if="task.assignees.length > 3"
              class="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-white bg-gray-300 text-xs"
              :title="`${task.assignees.length - 3} more`"
          >
            +{{ task.assignees.length - 3 }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="showDetails" class="mt-3 border-t border-gray-200 pt-3">
      <div v-if="task.description" class="mb-3">
        <h5 class="mb-1 text-xs font-medium text-gray-500">Description</h5>
        <p class="text-sm text-gray-700">{{ task.description }}</p>
      </div>

      <div class="mb-3">
        <h5 class="mb-1 text-xs font-medium text-gray-500">Reporter</h5>
        <div class="flex items-center">
          <span class="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs">
            {{ task.reporter.charAt(0) }}
          </span>
          <span class="text-sm">{{ task.reporter }}</span>
        </div>
      </div>
      
      <div>
        <h5 class="mb-1 text-xs font-medium text-gray-500">Assignees</h5>
        <div class="flex flex-wrap gap-1">
          <div v-for="(assignee, index) in task.assignees" :key="index" class="flex items-center rounded-full py-0.5">
            <span class="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs">
              {{ assignee.charAt(0) }}
            </span>
            <span class="text-xs">{{ assignee }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>