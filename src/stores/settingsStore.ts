// stores/settingsStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const projectName = ref('Alpha Project')
  const projectType = ref('Software project')

  function updateProject(name: string, type: string) {
    projectName.value = name
    projectType.value = type
  }

  return {
    projectName,
    projectType,
    updateProject
  }
})
