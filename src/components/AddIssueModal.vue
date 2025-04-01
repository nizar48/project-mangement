<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { useIssueStore } from '../stores/issueStore'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const newIssue = ref({
  type: 'Task',
  title: '',
  description: '',
  priority: 'Medium',
  reporter: '',
  assignees: '',
})


const issueStore = useIssueStore()

const handleSubmit = () => {
  const assigneesArray = newIssue.value.assignees
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a)

  issueStore.addIssue({
    id: Date.now(),
    type: newIssue.value.type,
    title: newIssue.value.title,
    description: newIssue.value.description,
    priority: newIssue.value.priority,
    status: 'Backlog',
    reporter: newIssue.value.reporter,
    assignees: assigneesArray,
  })

  resetForm()
  emit('close')
}

const resetForm = () => {
  newIssue.value = {
    type: 'Task',
    title: '',
    description: '',
    priority: 'Medium',
    reporter: '',
    assignees: '',
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="props.show" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Semi-transparent overlay -->
      <div class="absolute inset-0 backdrop-blur-sm" @click="closeModal"></div>

      <!-- Modal content -->
      <div class="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-800">Add New Issue</h2>
          <button @click="closeModal" class="rounded-full p-1 hover:bg-gray-100">
            <X class="h-5 w-5 text-gray-500"/>
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">Issue Type</label>
            <select
                v-model="newIssue.type"
                class="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-500 focus:outline-none"
            >
              <option>Task</option>
              <option>Bug</option>
              <option>Feature</option>
              <option>Epic</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">Title</label>
            <input
                v-model="newIssue.title"
                type="text"
                required
                class="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-500 focus:outline-none"
                placeholder="Issue title"
            />
          </div>

          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
                v-model="newIssue.description"
                class="h-24 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-500 focus:outline-none"
                placeholder="Describe the issue..."
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">Priority</label>
            <select
                v-model="newIssue.priority"
                class="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-500 focus:outline-none"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">Reporter</label>
            <input
                v-model="newIssue.reporter"
                type="text"
                required
                class="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-500 focus:outline-none"
                placeholder="Your name"
            />
          </div>

          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium text-gray-700">Assignees</label>
            <input
                v-model="newIssue.assignees"
                type="text"
                class="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-500 focus:outline-none"
                placeholder="Comma-separated names"
            />
            <p class="mt-1 text-xs text-gray-500">Separate multiple assignees with commas</p>
          </div>

          <div class="flex justify-end space-x-2">
            <button
                type="button"
                @click="closeModal"
                class="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
                type="submit"
                class="cursor-pointer rounded-md bg-green-900 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
            >
              Create Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>