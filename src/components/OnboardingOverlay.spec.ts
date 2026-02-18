import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '@/i18n'
import OnboardingOverlay from './OnboardingOverlay.vue'

class ResizeObserverMock {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

describe('OnboardingOverlay', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  })

  it('renders step 1 when visible', () => {
    const wrapper = mount(OnboardingOverlay, {
      props: { visible: true },
      global: {
        plugins: [i18n],
        stubs: { Teleport: true },
      },
    })
    expect(wrapper.text()).toContain('1 / 3')
  })

  it('does not render when not visible', () => {
    const wrapper = mount(OnboardingOverlay, {
      props: { visible: false },
      global: {
        plugins: [i18n],
        stubs: { Teleport: true },
      },
    })
    expect(wrapper.find('.onboarding-root').exists()).toBe(false)
  })

  it('shows next button on step 1', () => {
    const wrapper = mount(OnboardingOverlay, {
      props: { visible: true },
      global: {
        plugins: [i18n],
        stubs: { Teleport: true },
      },
    })
    expect(wrapper.find('.onboarding-btn').exists()).toBe(true)
  })
})
