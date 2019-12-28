import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import Initial from '@/views/Initial.vue'
import { localVue, before, after } from '@/../tests/vueCommon.js'

beforeAll(before(jest))
afterAll(after())

describe('Initial.vue', () => {
  let actions = null
  let store = null

  beforeEach(() => {
    actions = {
      initAction: jest.fn(),
      saveAction: jest.fn(),
      connectAction: jest.fn(),
    }
    store = new Vuex.Store({
      state: {
        restEndpoint: '',
        restToken: '',
        restPrefix: '',
        mqttEndpoint: '',
        mqttUsername: '',
        mqttPassword: '',
        robotType: 'robot_ui',
        robotId: '',
        uiId: '',
      },
      actions: actions,
    })
    speechSynthesis.speak.mockClear()
  })

  it('renders using default values and click button', async () => {
    const wrapper = shallowMount(Initial, {store, localVue})
    expect(wrapper.attributes()).toMatchObject({class: 'initial'})
    expect(wrapper.vm.$data.params.restEndpoint).toMatch('')
    expect(wrapper.vm.$data.params.restToken).toMatch('')
    expect(wrapper.vm.$data.params.restPrefix).toMatch('')
    expect(wrapper.vm.$data.params.mqttEndpoint).toMatch('')
    expect(wrapper.vm.$data.params.mqttUsername).toMatch('')
    expect(wrapper.vm.$data.params.mqttPassword).toMatch('')
    expect(wrapper.vm.$data.params.robotType).toMatch('robot_ui')
    expect(wrapper.vm.$data.params.robotId).toMatch('')
    expect(wrapper.vm.$data.params.uiId).toMatch('')
    expect(wrapper.vm.$data.processing).toBeFalsy()
    expect(wrapper.html()).toMatch('<div><button class="btn btn-primary float-center">接続</button></div>')
    expect(actions.initAction).toHaveBeenCalledTimes(1)
    expect(actions.initAction.mock.calls[0][1]).toBeUndefined()
    expect(actions.saveAction).not.toHaveBeenCalled()
    expect(actions.connectAction).not.toHaveBeenCalled()
    expect(speechSynthesis.speak).not.toHaveBeenCalled()

    wrapper.find('button.btn').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.$data.processing).toBeTruthy()
    expect(wrapper.html()).toMatch('<div><mark>接続処理中</mark></div>')
    expect(actions.initAction).toHaveBeenCalledTimes(1)
    expect(actions.saveAction).toHaveBeenCalledTimes(1)
    expect(actions.saveAction.mock.calls[0][1]).toMatchObject({
      restEndpoint: '',
      restToken: '',
      restPrefix: '',
      mqttEndpoint: '',
      mqttUsername: '',
      mqttPassword: '',
      robotType: 'robot_ui',
      robotId: '',
      uiId: '',
    })
    expect(actions.connectAction).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak.mock.calls[0][0].text).toMatch('hack')
    expect(speechSynthesis.speak.mock.calls[0][0].volume).toEqual(0)

    actions.connectAction.mock.calls[0][1]()
    expect(wrapper.vm.$data.processing).toBeFalsy()
  })

  it('renders using restored values and click button', async () => {
    const restoredStore = new Vuex.Store({
      state: {
        restEndpoint: 'str1',
        restToken: 'str2',
        restPrefix: 'str3',
        mqttEndpoint: 'str4',
        mqttUsername: 'str5',
        mqttPassword: 'str6',
        robotType: 'str7',
        robotId: 'str8',
        uiId: 'str9',
      },
      actions: actions,
    })

    const wrapper = shallowMount(Initial, {store: restoredStore, localVue})
    expect(wrapper.attributes()).toMatchObject({class: 'initial'})
    expect(wrapper.vm.$data.params.restEndpoint).toMatch('str1')
    expect(wrapper.vm.$data.params.restToken).toMatch('str2')
    expect(wrapper.vm.$data.params.restPrefix).toMatch('str3')
    expect(wrapper.vm.$data.params.mqttEndpoint).toMatch('str4')
    expect(wrapper.vm.$data.params.mqttUsername).toMatch('str5')
    expect(wrapper.vm.$data.params.mqttPassword).toMatch('str6')
    expect(wrapper.vm.$data.params.robotType).toMatch('str7')
    expect(wrapper.vm.$data.params.robotId).toMatch('str8')
    expect(wrapper.vm.$data.params.uiId).toMatch('str9')
    expect(wrapper.vm.$data.processing).toBeFalsy()
    expect(wrapper.html()).toMatch('<div><button class="btn btn-primary float-center">接続</button></div>')
    expect(actions.initAction).toHaveBeenCalledTimes(1)
    expect(actions.initAction.mock.calls[0][1]).toBeUndefined()
    expect(actions.saveAction).not.toHaveBeenCalled()
    expect(actions.connectAction).not.toHaveBeenCalled()

    wrapper.find('button.btn').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.$data.processing).toBeTruthy()
    expect(wrapper.html()).toMatch('<div><mark>接続処理中</mark></div>')
    expect(actions.initAction).toHaveBeenCalledTimes(1)
    expect(actions.saveAction).toHaveBeenCalledTimes(1)
    expect(actions.saveAction.mock.calls[0][1]).toMatchObject({
      restEndpoint: 'str1',
      restToken: 'str2',
      restPrefix: 'str3',
      mqttEndpoint: 'str4',
      mqttUsername: 'str5',
      mqttPassword: 'str6',
      robotType: 'str7',
      robotId: 'str8',
      uiId: 'str9',
    })

    expect(actions.connectAction).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak.mock.calls[0][0].text).toMatch('hack')
    expect(speechSynthesis.speak.mock.calls[0][0].volume).toEqual(0)

    actions.connectAction.mock.calls[0][1]()
    expect(wrapper.vm.$data.processing).toBeFalsy()
  })

  it('sets values and click button', async () => {
    const wrapper = shallowMount(Initial, {store, localVue})
    expect(wrapper.attributes()).toMatchObject({class: 'initial'})
    wrapper.find('input#restEndpoint').setValue('set1')
    expect(wrapper.vm.$data.params.restEndpoint).toMatch('set1')
    wrapper.find('input#restToken').setValue('set2')
    expect(wrapper.vm.$data.params.restToken).toMatch('set2')
    wrapper.find('input#restPrefix').setValue('set3')
    expect(wrapper.vm.$data.params.restPrefix).toMatch('set3')
    wrapper.find('input#mqttEndpoint').setValue('set4')
    expect(wrapper.vm.$data.params.mqttEndpoint).toMatch('set4')
    wrapper.find('input#mqttUsername').setValue('set5')
    expect(wrapper.vm.$data.params.mqttUsername).toMatch('set5')
    wrapper.find('input#mqttPassword').setValue('set6')
    expect(wrapper.vm.$data.params.mqttPassword).toMatch('set6')
    wrapper.find('input#robotType').setValue('set7')
    expect(wrapper.vm.$data.params.robotType).toMatch('set7')
    wrapper.find('input#robotId').setValue('set8')
    expect(wrapper.vm.$data.params.robotId).toMatch('set8')
    wrapper.find('input#uiId').setValue('set9')
    expect(wrapper.vm.$data.params.uiId).toMatch('set9')
    expect(wrapper.vm.$data.processing).toBeFalsy()
    expect(wrapper.html()).toMatch('<div><button class="btn btn-primary float-center">接続</button></div>')
    expect(actions.initAction).toHaveBeenCalledTimes(1)
    expect(actions.initAction.mock.calls[0][1]).toBeUndefined()
    expect(actions.saveAction).not.toHaveBeenCalled()
    expect(actions.connectAction).not.toHaveBeenCalled()
    expect(speechSynthesis.speak).not.toHaveBeenCalled()

    wrapper.find('button.btn').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.$data.processing).toBeTruthy()
    expect(wrapper.html()).toMatch('<div><mark>接続処理中</mark></div>')
    expect(actions.initAction).toHaveBeenCalledTimes(1)
    expect(actions.saveAction).toHaveBeenCalledTimes(1)
    expect(actions.saveAction.mock.calls[0][1]).toMatchObject({
      restEndpoint: 'set1',
      restToken: 'set2',
      restPrefix: 'set3',
      mqttEndpoint: 'set4',
      mqttUsername: 'set5',
      mqttPassword: 'set6',
      robotType: 'set7',
      robotId: 'set8',
      uiId: 'set9',
    })
    expect(actions.connectAction).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak.mock.calls[0][0].text).toMatch('hack')
    expect(speechSynthesis.speak.mock.calls[0][0].volume).toEqual(0)

    actions.connectAction.mock.calls[0][1]()
    expect(wrapper.vm.$data.processing).toBeFalsy()
  })

  it('does nothing when processing is true', async () => {
    const wrapper = shallowMount(Initial, {store, localVue})
    expect(wrapper.attributes()).toMatchObject({class: 'initial'})
    wrapper.vm.$data.processing = true

    wrapper.find('button.btn').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.$data.processing).toBeTruthy()
    expect(wrapper.html()).toMatch('<div><mark>接続処理中</mark></div>')
    expect(actions.initAction).toHaveBeenCalledTimes(1)
    expect(actions.initAction.mock.calls[0][1]).toBeUndefined()
    expect(actions.saveAction).not.toHaveBeenCalled()
    expect(actions.connectAction).not.toHaveBeenCalled()
    expect(speechSynthesis.speak).not.toHaveBeenCalled()
  })
})
