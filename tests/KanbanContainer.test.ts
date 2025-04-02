// KanbanColumn.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import KanbanColumn from '../src/components/KanbanColumn.vue'
import KanbanTask from '../src/components/KanbanTask.vue'
import type { Column } from '../src/stores/issueStore'


vi.mock('../src/components/KanbanTask.vue', () => ({
  default: {
    name: 'KanbanTask',
    props: ['task', 'columnId'],
    template: '<div class="mock-task"></div>'
  }
}))

describe('KanbanColumn', () => {
  // Setup Pinia before each test
  beforeEach(() => {
    // Create a fresh Pinia instance and make it active
    setActivePinia(createPinia())
  })

  const mockColumn: Column = {
    id: 'column1',
    title: 'todo',
    tasks: [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        type: 'bug',
        priority: 'high',
        status: 'open',
        reporter: 'user1',
        assignees: ['user2']
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        type: 'feature',
        priority: 'medium',
        status: 'in-progress',
        reporter: 'user3',
        assignees: ['user4', 'user5']
      }
    ]
  }

  let wrapper

  beforeEach(() => {
    // Mount the component after Pinia is set up
    wrapper = mount(KanbanColumn, {
      props: {
        column: mockColumn
      },
      global: {
        plugins: [createPinia()]
      }
    })
  })

  it('renders the column title correctly', () => {
    expect(wrapper.find('h3').text()).toBe('TODO')
  })

  it('displays the correct number of tasks', () => {
    expect(wrapper.find('span').text().trim()).toBe('2')
  })

  it('renders KanbanTask components for each task', () => {
    const tasks = wrapper.findAllComponents(KanbanTask)
    expect(tasks.length).toBe(2)
  })

  it('updates isDraggingOver when dragging over the column', async () => {
    expect(wrapper.vm.isDraggingOver).toBe(false)
    await wrapper.trigger('dragover')
    expect(wrapper.vm.isDraggingOver).toBe(true)
    await wrapper.trigger('dragleave')
    expect(wrapper.vm.isDraggingOver).toBe(false)
  })

  it('applies the correct styling when dragging over', async () => {
    expect(wrapper.classes()).not.toContain('border-green-500')
    expect(wrapper.classes()).not.toContain('bg-green-50')

    await wrapper.trigger('dragover')
    expect(wrapper.classes()).toContain('border-green-500')
    expect(wrapper.classes()).toContain('bg-green-50')

    await wrapper.trigger('dragleave')
    expect(wrapper.classes()).not.toContain('border-green-500')
    expect(wrapper.classes()).not.toContain('bg-green-50')
  })

  it('emits task-moved event with correct data on drop', async () => {
    const mockDataTransfer = {
      getData: vi.fn()
        .mockImplementationOnce(() => '99') // taskId
        .mockImplementationOnce(() => 'column2') // sourceColumnId
    }

    await wrapper.trigger('drop', {
      dataTransfer: mockDataTransfer,
      preventDefault: vi.fn()
    })

    expect(wrapper.emitted('task-moved')).toBeTruthy()
    expect(wrapper.emitted('task-moved')[0][0]).toEqual({
      taskId: 99,
      sourceColumnId: 'column2',
      targetColumnId: 'column1',
      position: 2 // should be at the end of the list
    })
  })

  it('does not emit when source and target columns are the same', async () => {
    const mockDataTransfer = {
      getData: vi.fn()
        .mockImplementationOnce(() => '1') // taskId
        .mockImplementationOnce(() => 'column1') // sourceColumnId (same as targetColumnId)
    }

    await wrapper.trigger('drop', {
      dataTransfer: mockDataTransfer,
      preventDefault: vi.fn()
    })

    expect(wrapper.emitted('task-moved')).toBeFalsy()
  })
})