import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import Picking from '@/views/Picking.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('Picking.vue', () => {
  let actions = null
  let state = null
  let store = null

  beforeEach(() => {
    actions = {
      moveNextAction: jest.fn(),
    }
    state = {
      destination: '',
    }
    store = new Vuex.Store({
      state: state,
      actions: actions,
    })
    speechSynthesis.speak.mockClear()
  })

  it('renders and speaks when showing the view', () => {
    state.destination = 'wh1'

    const wrapper = mount(Picking, {store, localVue})
    expect(wrapper.attributes()).toMatchObject({class: 'picking'})
    expect(wrapper.find('div.header').find('nav.navbar').find('ul.navbar-nav').find('form.form-inline').find('button.btn').html()).toMatch('<button class="btn btn-outline-dark btn-sm">切断</button>')
    expect(wrapper.find('div.display').find('span.display-4').html()).toMatch('<span class="display-4">倉庫: wh1</span>')
    expect(wrapper.find('div.touchButton').find('div.form-group').find('button.btn.touchButton[type="submit"][ontouchstart=""]').text()).toMatch('作業完了')
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak.mock.calls[0][0].text).toMatch('wh1に到着しました。指定された品物の積み下ろしをしてください。')
    expect(speechSynthesis.speak.mock.calls[0][0].volume).toEqual(1)
    expect(actions.moveNextAction).not.toHaveBeenCalled()
    expect(wrapper.find({name: 'touchButton'}).vm.$data.processing).toBeFalsy()
  })

  it('invokes moveNextAction when the touthButton is clicked', async () => {
    const originalError = console.error
    console.error = jest.fn()

    state.destination = 'wh2'

    const wrapper = mount(Picking, {store, localVue})
    expect(wrapper.attributes()).toMatchObject({class: 'picking'})
    expect(wrapper.find('div.display').find('span.display-4').html()).toMatch('<span class="display-4">倉庫: wh2</span>')
    expect(actions.moveNextAction).not.toHaveBeenCalled()
    expect(wrapper.find({name: 'touchButton'}).vm.$data.processing).toBeFalsy()

    let button = wrapper.find('div.touchButton').find('div.form-group').find('button.btn.touchButton[type="submit"][ontouchstart=""]')
    button.trigger('click')
    await wrapper.vm.$nextTick()

    expect(actions.moveNextAction).toHaveBeenCalledTimes(1)
    expect(actions.moveNextAction.mock.calls[0][1]).toBeInstanceOf(Function)
    expect(wrapper.find({name: 'touchButton'}).vm.$data.processing).toBeTruthy()

    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak.mock.calls[0][0].text).toMatch('wh2に到着しました。指定された品物の積み下ろしをしてください。')
    expect(speechSynthesis.speak.mock.calls[0][0].volume).toEqual(1)

    actions.moveNextAction.mock.calls[0][1]()
    expect(wrapper.find({name: 'touchButton'}).vm.$data.processing).toBeFalsy()

    console.error = originalError
  })

  it('invokes moveNextAction but does nothing when touchButton is processing', async () => {
    const originalError = console.error
    console.error = jest.fn()

    state.destination = 'wh3'

    const wrapper = mount(Picking, {store, localVue})
    expect(wrapper.attributes()).toMatchObject({class: 'picking'})
    expect(wrapper.find('div.display').find('span.display-4').html()).toMatch('<span class="display-4">倉庫: wh3</span>')
    expect(actions.moveNextAction).not.toHaveBeenCalled()
    expect(wrapper.find({name: 'touchButton'}).vm.$data.processing).toBeFalsy()

    wrapper.find({name: 'touchButton'}).vm.$data.processing = true
    let button = wrapper.find('div.touchButton').find('div.form-group').find('button.btn.touchButton[type="submit"][ontouchstart=""]')
    button.trigger('click')
    await wrapper.vm.$nextTick()

    expect(actions.moveNextAction).not.toHaveBeenCalled()

    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak.mock.calls[0][0].text).toMatch('wh3に到着しました。指定された品物の積み下ろしをしてください。')
    expect(speechSynthesis.speak.mock.calls[0][0].volume).toEqual(1)

    console.error = originalError
  })

})
