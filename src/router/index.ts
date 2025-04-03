import { createRouter, createWebHistory } from 'vue-router'
import KanbanContainer from '../components/KanbanContainer.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    component: KanbanContainer
  }]
})

export default router