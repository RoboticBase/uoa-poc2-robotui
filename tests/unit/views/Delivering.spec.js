import { mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Delivering from '@/views/Delivering.vue'
import { localVue, before, after } from '../vueCommon.js'

beforeAll(before(jest))
afterAll(after())

describe('Delivering.vue', () => {
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
    state.destination = 'dest1'

    const wrapper = mount(Delivering, {store, localVue})
    expect(wrapper.attributes()).toMatchObject({class: 'delivering'})
    expect(wrapper.find('div.header').find('nav.navbar').find('ul.navbar-nav').find('form.form-inline').find('button.btn').html()).toMatch('<button class="btn btn-outline-dark btn-sm">切断</button>')
    expect(wrapper.find('div.display').find('span.display-4').html()).toMatch('<span class="display-4">出荷先: dest1</span>')
    expect(wrapper.find('h3').html()).toMatch('<h3>あなたのQRコードをかざしてください</h3>')
    expect(wrapper.find('div.qrreader.container').find('video#video[muted="muted"][autoplay="autoplay"][playsinline=""]').exists()).toBeTruthy()
    expect(wrapper.find('div.qrreader.container').find('canvas#canvas').exists()).toBeTruthy()
    const button = wrapper.find('div.touchButton').find('div.form-group').find('button.btn.touchButton[type="submit"][ontouchstart=""]')

    expect(button.text()).toMatch('受取')
    expect(button.attributes().disabled).toMatch('disabled')
    expect(wrapper.vm.$data.buttonDisabled).toBeTruthy()
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak.mock.calls[0][0].text).toMatch('品物をお届けにまいりました。QRコードをご準備ください。')
    expect(speechSynthesis.speak.mock.calls[0][0].volume).toEqual(1)
    expect(actions.moveNextAction).not.toHaveBeenCalled()
    expect(wrapper.find({name: 'qrreader'}).vm.$data.timer).toBeNull()
    expect(wrapper.find({name: 'touchButton'}).vm.$data.processing).toBeFalsy()
  })

  it('renders the video image when mounted this view, and enables the touchButton when detecting QRcode', async () => {
    state.destination = 'dest2'

    let code = null

    const wrapper = mount(Delivering, {store, localVue})
    const qrreader = wrapper.find({name: 'qrreader'}).vm

    const mockedQR = jest.fn().mockImplementation(() => code)
    jest.mock('jsqr', () => mockedQR)

    const mockedPlay = jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => {})
    mockedPlay.mockClear()
    const mockedPause = jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    mockedPause.mockClear()

    const video = qrreader.$refs.video
    const canvas = qrreader.$refs.canvas
    const ctx = canvas.getContext('2d')
    ctx.drawImage = jest.fn()
    ctx.getImageData = jest.fn().mockReturnValue({data: null, width: 0, height: 0})
    ctx.beginPath = jest.fn()
    ctx.moveTo = jest.fn()
    ctx.lineTo = jest.fn()
    ctx.stroke = jest.fn()

    expect(qrreader.$data.timer).toBeNull()

    qrreader.onloadedmetadata(video, canvas, ctx)()

    expect(mockedPlay).toHaveBeenCalledTimes(1)
    expect(qrreader.$data.timer).not.toBeNull()
    expect(ctx.drawImage).not.toHaveBeenCalled()
    expect(ctx.getImageData).not.toHaveBeenCalled()
    expect(ctx.beginPath).not.toHaveBeenCalled()
    expect(ctx.moveTo).not.toHaveBeenCalled()
    expect(ctx.lineTo).not.toHaveBeenCalled()
    expect(ctx.stroke).not.toHaveBeenCalled()
    expect(mockedQR).not.toHaveBeenCalled()
    expect(mockedPause).not.toHaveBeenCalled()

    await new Promise(resolve => setTimeout(resolve, 600))

    expect(mockedPlay).toHaveBeenCalledTimes(1)
    expect(ctx.drawImage).toHaveBeenCalled()
    expect(ctx.getImageData).toHaveBeenCalled()
    expect(ctx.beginPath).not.toHaveBeenCalled()
    expect(ctx.moveTo).not.toHaveBeenCalled()
    expect(ctx.lineTo).not.toHaveBeenCalled()
    expect(ctx.stroke).not.toHaveBeenCalled()
    expect(mockedQR).toHaveBeenCalledTimes(1)
    expect(mockedQR).toHaveBeenCalledWith(null, 0, 0)
    expect(mockedPause).not.toHaveBeenCalled()
    expect(qrreader.$data.timer).not.toBeNull()

    expect(wrapper.vm.$data.buttonDisabled).toBeTruthy()
    expect(wrapper.find('h3').html()).toMatch('<h3>あなたのQRコードをかざしてください</h3>')
    expect(wrapper.find('div.touchButton').find('div.form-group').find('button.btn.touchButton[type="submit"][ontouchstart=""]').attributes().disabled).toMatch('disabled')
    expect(wrapper.find({name: 'touchButton'}).vm.$data.processing).toBeFalsy()

    code = {
      location: {
        topLeftCorner: {x: 0.0, y: 0.0},
        topRightCorner: {x: 0.0, y: 0.0},
        bottomLeftCorner: {x: 0.0, y: 0.0},
        bottomRightCorner: {x: 0.0, y: 0.0},
      }
    }
    await new Promise(resolve => setTimeout(resolve, 600))

    expect(mockedPlay).toHaveBeenCalledTimes(1)
    expect(ctx.drawImage).toHaveBeenCalled()
    expect(ctx.getImageData).toHaveBeenCalled()
    expect(ctx.beginPath).toHaveBeenCalled()
    expect(ctx.moveTo).toHaveBeenCalled()
    expect(ctx.lineTo).toHaveBeenCalled()
    expect(ctx.stroke).toHaveBeenCalled()
    expect(mockedQR).toHaveBeenCalledTimes(2)
    expect(mockedQR).toHaveBeenCalledWith(null, 0, 0)
    expect(mockedPause).toHaveBeenCalled()
    expect(qrreader.$data.timer).toBeNull()

    expect(wrapper.vm.$data.buttonDisabled).toBeFalsy()
    expect(wrapper.find('h3').html()).toMatch('<h3>品物を受け取ったら、受取ボタンを押してください</h3>')
    expect(wrapper.find('div.touchButton').find('div.form-group').find('button.btn.touchButton[type="submit"][ontouchstart=""]').attributes().disabled).toBeUndefined()
    expect(wrapper.find({name: 'touchButton'}).vm.$data.processing).toBeFalsy()
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(2)
    expect(speechSynthesis.speak.mock.calls[1][0].text).toMatch('お客様を認識しました。品物をお受け取りください。品物を受け取ったら、受け取りボタンを押してください。')
    expect(speechSynthesis.speak.mock.calls[1][0].volume).toEqual(1)
    expect(actions.moveNextAction).not.toHaveBeenCalled()
  })

  it('invokes moveNextAction when the touthButton is clicked', async () => {
    const originalError = console.error
    console.error = jest.fn()

    state.destination = 'dest3'

    const wrapper = mount(Delivering, {store, localVue})
    expect(wrapper.attributes()).toMatchObject({class: 'delivering'})
    expect(wrapper.find('div.display').find('span.display-4').html()).toMatch('<span class="display-4">出荷先: dest3</span>')
    expect(actions.moveNextAction).not.toHaveBeenCalled()
    const button = wrapper.find('div.touchButton').find('div.form-group').find('button.btn.touchButton[type="submit"][ontouchstart=""]')
    const touchButton = wrapper.find({name: 'touchButton'}).vm
    expect(button.attributes().disabled).toMatch('disabled')
    expect(touchButton.$data.processing).toBeFalsy()

    wrapper.vm.$data.buttonDisabled = false

    await wrapper.vm.$nextTick()

    expect(button.attributes().disabled).toBeUndefined()
    button.trigger('click')
    await wrapper.vm.$nextTick()

    expect(actions.moveNextAction).toHaveBeenCalledTimes(1)
    expect(actions.moveNextAction.mock.calls[0][1]).toBeInstanceOf(Function)
    expect(touchButton.$data.processing).toBeTruthy()
    actions.moveNextAction.mock.calls[0][1]()
    expect(touchButton.$data.processing).toBeFalsy()

    console.error = originalError
  })

  it('invokes moveNextAction but does nothing when touchButton is processing', async () => {
    state.destination = 'dest4'

    const wrapper = mount(Delivering, {store, localVue})
    expect(wrapper.attributes()).toMatchObject({class: 'delivering'})
    expect(wrapper.find('div.display').find('span.display-4').html()).toMatch('<span class="display-4">出荷先: dest4</span>')
    expect(actions.moveNextAction).not.toHaveBeenCalled()
    const button = wrapper.find('div.touchButton').find('div.form-group').find('button.btn.touchButton[type="submit"][ontouchstart=""]')
    const touchButton = wrapper.find({name: 'touchButton'}).vm
    expect(button.attributes().disabled).toMatch('disabled')
    expect(touchButton.$data.processing).toBeFalsy()

    wrapper.vm.$data.buttonDisabled = false
    touchButton.$data.processing = true

    await wrapper.vm.$nextTick()

    expect(button.attributes().disabled).toBeUndefined()
    button.trigger('click')
    await wrapper.vm.$nextTick()

    expect(actions.moveNextAction).not.toHaveBeenCalled()
    expect(touchButton.$data.processing).toBeTruthy()
  })

})
