import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import NewIssueModal from '../src/components/AddIssueModal.vue'
import { createTestingPinia } from '@pinia/testing'
import { useIssueStore } from '../src/stores/issueStore'

describe('NewIssueModal.vue', () => {
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
    const wrapper = mount(NewIssueModal, {
      props: { show: true },
      global: {
        plugins: [createTestingPinia()],
        stubs: { // stub? In Vitest, a stub is a type of test double used to replace a function with a fake implementation
          Teleport: true // Stub the teleport component
        }
      },
      attachTo: document.body
    })

    // Wait for the component to render
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Add New Issue')
    expect(wrapper.find('input[placeholder="Issue title"]').exists()).toBe(true)
  })

  it('does not render when show is false', async () => {
    const wrapper = mount(NewIssueModal, {
      props: { show: false },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          Teleport: true
        }
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.html()).not.toContain('Add New Issue')
  })

  it('emits close event when cancel button is clicked', async () => {
    const wrapper = mount(NewIssueModal, {
      props: { show: true },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          Teleport: true
        }
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    const cancelButton = wrapper.find('button[type="button"]')
    expect(cancelButton.exists()).toBe(true)
    await cancelButton.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('calls store addIssue on form submission', async () => {
    const wrapper = mount(NewIssueModal, {
      props: { show: true },
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
    vi.spyOn(issueStore, 'addIssue')

    // Fill in required fields
    await wrapper.find('input[placeholder="Issue title"]').setValue('Test Issue')
    await wrapper.find('input[placeholder="Your name"]').setValue('Tester')

    const form = wrapper.find('form')
    expect(form.exists()).toBe(true)
    await form.trigger('submit.prevent')

    expect(issueStore.addIssue).toHaveBeenCalled()
    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('resets form after submission', async () => {
    const wrapper = mount(NewIssueModal, {
      props: { show: true },
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
        stubs: {
          Teleport: true
        }
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    // Fill in form fields
    await wrapper.find('input[placeholder="Issue title"]').setValue('Test Issue')
    await wrapper.find('textarea').setValue('Test Description')
    await wrapper.find('input[placeholder="Your name"]').setValue('Tester')
    await wrapper.find('input[placeholder="Comma-separated names"]').setValue('Person1, Person2')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')

    // Mount the component again to check if form was reset
    const newWrapper = mount(NewIssueModal, {
      props: { show: true },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          Teleport: true
        }
      },
      attachTo: document.body
    })

    await newWrapper.vm.$nextTick()

    // Check that form fields are reset to defaults
    expect(newWrapper.find('input[placeholder="Issue title"]').element.textContent).toBe('')
    expect(newWrapper.find('textarea').element.value).toBe('')
    expect(newWrapper.find('input[placeholder="Your name"]').element.textContent).toBe('')
    expect(newWrapper.find('input[placeholder="Comma-separated names"]').element.textContent).toBe('')
  })
})