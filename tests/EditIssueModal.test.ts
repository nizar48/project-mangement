import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import EditIssueModal from '../src/components/EditIssueModal.vue'
import { createTestingPinia } from '@pinia/testing'
import { useIssueStore } from '../src/stores/issueStore'

const mockTask = {
  id: 1,
  type: 'Bug',
  title: 'Fix API Issue',
  description: 'API is not responding.',
  priority: 'High',
  status: 'To Do',
  reporter: 'Alice',
  assignees: ['Bob']
}

describe('EditIssueModal.vue', () => {
  beforeEach(() => {
    // Create a div with id="teleport-target" and append to body
    const teleportTarget = document.createElement('div')
    teleportTarget.id = 'teleport-target'
    document.body.appendChild(teleportTarget)
  })

  afterEach(() => {
    // Clean up the teleport target
    document.body.innerHTML = ''
  })

  it('renders correctly when visible', async () => {
    const wrapper = mount(EditIssueModal, {
      props: { show: true, task: mockTask, columnId: 'backlog' },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          Teleport: true // This is important - stub the teleport component
        }
      },
      attachTo: document.body // Attach to document.body
    })

    // Wait for the component to render
    await wrapper.vm.$nextTick()

    // Debug
    console.log('HTML content:', document.body.innerHTML)

    expect(wrapper.html()).toContain('Edit Issue')
    expect(wrapper.find('input[placeholder="Issue title"]').exists()).toBe(true)
  })

  it('emits close event when cancel button is clicked', async () => {
    const wrapper = mount(EditIssueModal, {
      props: { show: true, task: mockTask, columnId: 'backlog' },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          Teleport: true
        }
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    // Find the cancel button and click it
    const cancelButton = wrapper.find('button[type="button"]')
    expect(cancelButton.exists()).toBe(true)
    await cancelButton.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('calls store updateTask on form submission', async () => {
    const wrapper = mount(EditIssueModal, {
      props: { show: true, task: mockTask, columnId: 'backlog' },
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
        stubs: {
          Teleport: true
        }
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    const issueStore = useIssueStore()
    vi.spyOn(issueStore, 'updateTask')

    const form = wrapper.find('form')
    expect(form.exists()).toBe(true)
    await form.trigger('submit.prevent')

    expect(issueStore.updateTask).toHaveBeenCalled()
  })
})