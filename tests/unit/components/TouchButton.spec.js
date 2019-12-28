import { mount } from '@vue/test-utils'
import TouchButton from '@/components/TouchButton.vue'

import { localVue, before, after } from '@/../tests/vueCommon.js'

beforeAll(before(jest))
afterAll(after())

describe('TouchButton.vue', () => {

  it('renders an enable touch button', () => {
    const wrapper = mount(TouchButton, {localVue, propsData: {
      buttonText: 'dummy1',
      height: '100px',
      fontSize: '10px',
      buttonDisabled: false,
    }})
    expect(wrapper.attributes()).toMatchObject({class: 'touchButton container'})
    expect(wrapper.vm.styles).toMatchObject({ '--height': '100px', '--fontSize': '10px' })
    const button = wrapper.find('div.touchButton').find('div.form-group').find('button.btn.touchButton[type="submit"][ontouchstart=""]')
    expect(button.text()).toMatch('dummy1')
    expect(button.attributes().disabled).toBeUndefined()
  })

  it('renders a disable touch button', () => {
    const wrapper = mount(TouchButton, {localVue, propsData: {
      buttonText: 'dummy2',
      height: '200px',
      fontSize: '20px',
      buttonDisabled: true,
    }})
    expect(wrapper.attributes()).toMatchObject({class: 'touchButton container'})
    expect(wrapper.vm.styles).toMatchObject({ '--height': '200px', '--fontSize': '20px' })
    const button = wrapper.find('div.touchButton').find('div.form-group').find('button.btn.touchButton[type="submit"][ontouchstart=""]')
    expect(button.text()).toMatch('dummy2')
    expect(button.attributes().disabled).toMatch('disabled')
  })

  it('emits the clickEvent when clicking', async () => {
    const wrapper = mount(TouchButton, {localVue, propsData: {
      buttonText: 'dummy1',
      height: '100px',
      fontSize: '10px',
      buttonDisabled: false,
    }})
    const button = wrapper.find('div.touchButton').find('div.form-group').find('button.btn.touchButton[type="submit"][ontouchstart=""]')
    expect(button.attributes().disabled).toBeUndefined()
    expect(wrapper.vm.$data.processing).toBeFalsy()

    button.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.$data.processing).toBeTruthy()
    expect(wrapper.emitted('clickEvent')).toBeTruthy()
    expect(wrapper.emitted('clickEvent').length).toBe(1)
    const cb = wrapper.emitted('clickEvent')[0][0]
    cb()
    expect(wrapper.vm.$data.processing).toBeFalsy()
  })

  it('does not emit the clickEvent when processing', async () => {
    const wrapper = mount(TouchButton, {localVue, propsData: {
      buttonText: 'dummy1',
      height: '100px',
      fontSize: '10px',
      buttonDisabled: false,
    }})
    const button = wrapper.find('div.touchButton').find('div.form-group').find('button.btn.touchButton[type="submit"][ontouchstart=""]')
    expect(button.attributes().disabled).toBeUndefined()
    wrapper.vm.$data.processing = true

    button.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.$data.processing).toBeTruthy()
    expect(wrapper.emitted('clickEvent')).toBeUndefined()
  })

})
