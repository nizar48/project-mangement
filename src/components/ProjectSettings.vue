<script setup lang="ts">

</script>

<template>
  <div class="flex flex-1 justify-center mt-16">

    <div class="bg-white border border-gray-300 w-full mx-6 h-[40%] shadow rounded-md pt-6 pb-20 px-10">
      <h1 class="text-2xl mb-6">Project Settings</h1>
      <div class="flex flex-col space-y-2">
        <label for="projectName" class="mb-1 block text-sm font-medium text-gray-700">Project name</label>
        <input id="projectName" type="text"
               class="w-96 border border-gray-300 shadow px-2 py-1 rounded-md focus:outline-none focus:border-green-500" />
      </div>

      <div class="mt-6 mb-8 w-96">
        <label class="mb-1 block text-sm font-medium text-gray-700">Project type</label>
        <select

          class="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-green-500 focus:outline-none"
        >
          <option>Software project</option>
          <option>Design project</option>
          <option>Research project</option>
        </select>
      </div>
      <button
        type="submit"
        class="cursor-pointer rounded-md bg-green-900 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
      >
        Update project
      </button>
    </div>
  </div>

</template>

<style scoped>

</style>