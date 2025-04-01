<script setup lang="ts">
import { useIssueStore } from '../stores/issueStore'
import KanbanColumn from './KanbanColumn.vue'

const issueStore = useIssueStore()

const handleTaskMoved = ({
                           taskId,
                           sourceColumnId,
                           targetColumnId,
                           position,
                         }: {
  taskId: number
  sourceColumnId: string
  targetColumnId: string
  position: number
}) => {
  issueStore.moveTask({taskId, sourceColumnId, targetColumnId, position})
}
</script>

<template>
  <div class="flex h-screen flex-col">
    <div class="flex-1 overflow-x-auto p-6">
      <div class="grid h-full w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <KanbanColumn
            v-for="column in issueStore.columns"
            :key="column.id"
            :column="column"
            @task-moved="handleTaskMoved"
        />
      </div>
    </div>
  </div>
</template>