import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useIssueStore, Task } from '../src/stores/issueStore'

describe('useIssueStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with predefined columns', () => {
    const store = useIssueStore()
    expect(store.columns).toHaveLength(4)
  })

  it('adds an issue to the backlog', () => {
    const store = useIssueStore()
    const newTask: Task = {
      id: 9,
      type: 'Task',
      title: 'Write unit tests',
      description: 'Ensure store functions correctly.',
      priority: 'High',
      status: 'To Do',
      reporter: 'Dev',
      assignees: ['Tester']
    }

    store.addIssue(newTask)
    expect(store.columns.find(c => c.id === 'backlog')?.tasks).toContainEqual(newTask)
  })

  it('moves a task to another column', () => {
    const store = useIssueStore()
    const taskId = 1
    store.moveTask({ taskId, sourceColumnId: 'backlog', targetColumnId: 'todo', position: 0 })
    expect(store.columns.find(c => c.id === 'backlog')?.tasks.some(t => t.id === taskId)).toBe(false)
    expect(store.columns.find(c => c.id === 'todo')?.tasks.some(t => t.id === taskId)).toBe(true)
  })

  it('deletes a task from a column', () => {
    const store = useIssueStore()
    store.deleteTask(1, 'backlog')
    expect(store.columns.find(c => c.id === 'backlog')?.tasks.some(t => t.id === 1)).toBe(false)
  })

  it('updates a task in a column', () => {
    const store = useIssueStore()
    const updatedTask: Task = {
      id: 2,
      type: 'Feature',
      title: 'Updated Task Title',
      description: 'Updated description.',
      priority: 'Low',
      status: 'To Do',
      reporter: 'Charlie',
      assignees: ['Alice', 'David']
    }

    store.updateTask({ id: 2, columnId: 'backlog', updatedTask })
    expect(store.columns.find(c => c.id === 'backlog')?.tasks.find(t => t.id === 2)).toEqual(updatedTask)
  })
})
