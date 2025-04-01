<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight, KanbanSquare, Plus } from 'lucide-vue-next'
import { useIssueStore } from '../stores/issueStore'
import KanbanBoard from './KanbanBoard.vue'
import AddIssueModal from './AddIssueModal.vue'

const isExpanded = ref(true)
const isHovered = ref(false)
const showModal = ref(false)


// const issueStore = useIssueStore()

const toggleModal = () => {
  showModal.value = !showModal.value
}
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- main sidebqr -->
    <div class="flex h-full w-16 flex-col items-center border-r border-r-gray-300 bg-green-800 py-4 shadow">
      <div class="mb-8">
        <div class="flex h-10 w-10 items-center justify-center p-1">
          <img src="/jira-logo.svg" alt="logo"/>
        </div>
      </div>
      <div class="flex flex-1 flex-col items-center gap-4">
        <button class="cursor-pointer rounded-md p-2 hover:bg-green-700" title="Add Issue" @click="toggleModal">
          <Plus class="h-5 w-5 text-white"/>
        </button>
        <!--        <button class="cursor-pointer rounded-md p-2 hover:bg-green-700" title="Search">-->
        <!--          <Search class="h-5 w-5 text-white"/>-->
        <!--        </button>-->
      </div>
      <div class="mt-auto mb-4">
        <span
            class="mr-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-slate-900"
        >N</span
        >
      </div>
    </div>

    <!-- collapsible sidebar -->
    <div
        :class="[
        'group relative bg-gray-50 shadow transition-all duration-300',
        isExpanded ? 'w-64' : 'w-4 overflow-hidden',
        isHovered ? 'border-r-2 border-green-800' : 'border-r-2 border-transparent',
      ]"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
    >
      <div class="flex h-full flex-col">
        <div class="relative flex items-center px-4 pt-4">
          <div class="flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded bg-slate-900 font-bold text-white">A</div>
            <div>
              <h3 class="font-medium text-gray-800">Project Alpha</h3>
              <p class="text-xs text-gray-500">Software Project</p>
            </div>
          </div>

          <button
              @click="isExpanded = false"
              @mouseenter="isHovered = true"
              @mouseleave="isHovered = false"
              :class="[
              'group absolute top-4 -right-[13px] flex h-6 w-6 items-center justify-center rounded-full border shadow-md transition-all',
              isHovered ? 'border-green-800 bg-green-800' : 'border-gray-200 bg-white',
            ]"
          >
            <ChevronLeft :class="['h-4 w-4 pr-[2px]', isHovered ? 'text-white' : 'text-gray-600']"/>
          </button>
        </div>
        <nav class="flex-1 space-y-2 p-4">
          <RouterLink to="/" class="flex w-full items-center gap-2 rounded-md p-2 hover:bg-gray-200"
                      active-class="bg-gray-100">
            <KanbanSquare class="h-5 w-5 text-gray-600"/>
            <span class="text-gray-700">Kanban Board</span>
          </RouterLink>
          <!--          <button class="flex w-full items-center gap-2 rounded-md p-2 hover:bg-gray-200">-->
          <!--            <Settings class="h-5 w-5 text-gray-600" />-->
          <!--            <span class="text-gray-700">Project Settings</span>-->
          <!--          </button>-->
        </nav>
      </div>
    </div>

    <div v-if="!isExpanded" class="relative z-10">
      <button
          @click="isExpanded = true"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          :class="[
          'absolute top-4 left-16 -ml-[75px] flex h-6 w-6 items-center justify-center rounded-full border shadow-md transition-all',
          isHovered ? 'border-green-800 bg-green-800' : 'border-gray-200 bg-white',
        ]"
      >
        <ChevronRight :class="['h-4 w-4', isHovered ? 'text-white' : 'text-gray-600']"/>
      </button>
    </div>

    <!-- main content -->
    <div class="flex-1 overflow-hidden">
      <KanbanBoard/>
    </div>

    <AddIssueModal :show="showModal" @close="showModal = false"/>
  </div>
</template>