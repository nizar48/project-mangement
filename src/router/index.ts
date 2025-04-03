import { createRouter, createWebHistory } from 'vue-router'
import ProjectSettings from '../components/ProjectSettings.vue'
import KanbanBoard from '../components/KanbanBoard.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    component: KanbanBoard
  },
    {
      path: '/settings',
      component: ProjectSettings
    }
  ]
})

export default router