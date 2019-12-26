import { mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Moving from '@/views/Moving.vue'
import { localVue, before, after } from '@/../tests/vueCommon.js'

beforeAll(before(jest))
afterAll(after())

describe('Moving.vue', () => {
  let mutations = null
  let store = null

  beforeEach(() => {
    mutations = {
      updateLockState: jest.fn((state, params) => {
        state.lockMessage = params.lockMessage
        state.lockUtterance = params.lockUtterance
      }),
      updateDest: (state, dest) => {
        state.destination = dest
      },
    }
    store = new Vuex.Store({
      state: {
        destination: '',
        lockMessage: null,
        lockUtterance: '',
      },
      mutations: mutations,
    })
    speechSynthesis.speak.mockClear()
  })

  it('renders the moving view', () => {
    store.commit('updateDest', 'dest1')
    const wrapper = mount(Moving, {store, localVue})
    expect(wrapper.attributes()).toMatchObject({class: 'moving'})
    expect(wrapper.find('div.header').find('nav.navbar').find('ul.navbar-nav').find('form.form-inline').find('button.btn').html()).toMatch('<button class="btn btn-outline-dark btn-sm">切断</button>')
    expect(wrapper.find('div.display').find('span.display-1').html()).toMatch('<span class="display-1">移動中</span>')
    expect(wrapper.find('div.destination').find('span.display-4').html()).toMatch('<span class="display-4">移動先：dest1</span>')
    expect(wrapper.vm.$data.unsubscribe).toBeInstanceOf(Function)
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak.mock.calls[0][0].text).toMatch('dest1へ移動します。')
    expect(speechSynthesis.speak.mock.calls[0][0].volume).toEqual(1)
  })

  it('is notified that "updateLockState" is called', async () => {
    store.commit('updateDest', 'dest2')
    const wrapper = mount(Moving, {store, localVue})
    expect(wrapper.find('div.display').find('span.display-1').html()).toMatch('<span class="display-1">移動中</span>')
    expect(wrapper.find('div.destination').find('span.display-4').html()).toMatch('<span class="display-4">移動先：dest2</span>')
    expect(wrapper.findAll('div.lockMessage').exists()).toBeFalsy()

    store.commit('updateLockState', {
      lockMessage: 'test_robot_01が作業中のため',
      lockUtterance: '他のロボットが作業中のため、一時待機します。'
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('div.display').find('span.display-1').html()).toMatch('<span class="display-1">一時待機</span>')
    expect(wrapper.find('div.destination').find('span.display-4').html()).toMatch('<span class="display-4">移動先：dest2</span>')
    expect(wrapper.find('div.lockMessage').find('span.display-4').html()).toMatch('<span class="display-4">test_robot_01が作業中のため</span>')
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(2)
    expect(speechSynthesis.speak.mock.calls[0][0].text).toMatch('dest2へ移動します。')
    expect(speechSynthesis.speak.mock.calls[0][0].volume).toEqual(1)
    expect(speechSynthesis.speak.mock.calls[1][0].text).toMatch('他のロボットが作業中のため、一時待機します。')
    expect(speechSynthesis.speak.mock.calls[1][0].volume).toEqual(1)
  })

  it('unsubscribes the "updateLockState" when destroyed', () => {
    const wrapper = mount(Moving, {store, localVue})
    expect(wrapper.vm.$data.unsubscribe).toBeInstanceOf(Function)

    let mockUnsubscribe = jest.fn()
    wrapper.vm.$data.unsubscribe = mockUnsubscribe

    wrapper.destroy()

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
    expect(mockUnsubscribe).toHaveBeenCalledWith()
  })

  it('is destroyed successfully although this.unsubscribe is null', () => {
    const wrapper = mount(Moving, {store, localVue})
    expect(wrapper.vm.$data.unsubscribe).toBeInstanceOf(Function)

    wrapper.vm.$data.unsubscribe = null

    wrapper.destroy()
  })

  it('ignores notifications from other than "updateLockState"', async () => {
    store.commit('updateDest', 'dest3')
    const wrapper = mount(Moving, {store, localVue})
    expect(wrapper.vm.$data.unsubscribe).toBeInstanceOf(Function)
    expect(wrapper.find('div.display').find('span.display-1').html()).toMatch('<span class="display-1">移動中</span>')
    expect(wrapper.find('div.destination').find('span.display-4').html()).toMatch('<span class="display-4">移動先：dest3</span>')
    expect(wrapper.findAll('div.lockMessage').exists()).toBeFalsy()

    store.commit('updateDest', 'dest4')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('div.display').find('span.display-1').html()).toMatch('<span class="display-1">移動中</span>')
    expect(wrapper.find('div.destination').find('span.display-4').html()).toMatch('<span class="display-4">移動先：dest4</span>')
    expect(wrapper.findAll('div.lockMessage').exists()).toBeFalsy()
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak.mock.calls[0][0].text).toMatch('dest3へ移動します。')
    expect(speechSynthesis.speak.mock.calls[0][0].volume).toEqual(1)
  })
})
