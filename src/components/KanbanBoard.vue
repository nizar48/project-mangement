<script setup lang="ts">
import { useIssueStore } from '../stores/issueStore'
import KanbanColumn from './KanbanColumn.vue'
import { Search } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const issueStore = useIssueStore()

const searchQuery = ref('')
const filteredColumns = computed(() => issueStore.filterTasks(searchQuery.value))


const handleTaskMoved = ({
                           taskId,
                           sourceColumnId,
                           targetColumnId,
                           position
                         }: {
  taskId: number
  sourceColumnId: string
  targetColumnId: string
  position: number
}) => {
  issueStore.moveTask({ taskId, sourceColumnId, targetColumnId, position })
}
</script>

<template>
  <div class="flex h-screen">
    <div class="flex-1 overflow-x-auto p-6">
      <div class="relative w-96 mb-4">
        <Search
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:border-green-500 focus:outline-none h-5 w-5" />
        <input
          @input="filteredColumns = issueStore.filterTasks(searchQuery)"
          v-model="searchQuery"
          type="text"
          class="border border-gray-300 shadow px-4 py-1 bg-white rounded-md w-full focus:border-green-500 focus:outline-none"
          placeholder="Search..."
        />
      </div>
      <div class="grid h-[calc(100%-50px)] w-full grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        <KanbanColumn
          v-for="column in filteredColumns"
          :key="column.id"
          :column="column"
          @task-moved="handleTaskMoved"
        />
      </div>
    </div>
  </div>
</template>