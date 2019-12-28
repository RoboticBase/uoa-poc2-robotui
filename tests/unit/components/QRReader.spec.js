import { mount } from '@vue/test-utils'
import QRReader from '@/components/QRReader.vue'

import { localVue, before, after } from '@/../tests/vueCommon.js'

beforeAll(before(jest))
afterAll(after())

describe('QRReader.vue', () => {

  it('renders the QRCode Reader', () => {
    const wrapper = mount(QRReader, {localVue, propsData: {
      width: '1px',
      height: '2px',
    }})
    expect(wrapper.attributes()).toMatchObject({class: 'qrreader container'})
    expect(wrapper.find('div.qrreader.container').find('video#video[muted="muted"][autoplay="autoplay"][playsinline=""]').exists()).toBeTruthy()
    expect(wrapper.find('div.qrreader.container').find('canvas#canvas').exists()).toBeTruthy()
    expect(wrapper.vm.$data.timer).toBeNull()

    wrapper.destroy()
    expect(wrapper.vm.$data.timer).toBeNull()
  })

  it('renders the video image when mounted', async () => {
    let code = null
    const mockedQR = jest.fn().mockImplementation(() => code)
    jest.mock('jsqr', () => mockedQR)

    const mockedPlay = jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => {})
    mockedPlay.mockClear()
    const mockedPause = jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    mockedPause.mockClear()

    const wrapper = mount(QRReader, {localVue, propsData: {
      width: '1px',
      height: '2px',
    }})
    const video = wrapper.vm.$refs.video
    const canvas = wrapper.vm.$refs.canvas
    const ctx = canvas.getContext('2d')
    ctx.drawImage = jest.fn()
    ctx.getImageData = jest.fn().mockReturnValue({data: null, width: 0, height: 0})
    ctx.beginPath = jest.fn()
    ctx.moveTo = jest.fn()
    ctx.lineTo = jest.fn()
    ctx.stroke = jest.fn()

    expect(wrapper.vm.$data.timer).toBeNull()

    wrapper.vm.onloadedmetadata(video, canvas, ctx)()

    expect(mockedPlay).toHaveBeenCalledTimes(1)
    expect(mockedPlay.mock.calls[0]).toEqual([])
    expect(wrapper.vm.$data.timer).not.toBeNull()
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
    expect(mockedPlay.mock.calls[0]).toEqual([])
    expect(ctx.drawImage).toHaveBeenCalledTimes(1)
    expect(ctx.drawImage.mock.calls[0]).toEqual([video, 0, 0, 1, 2])
    expect(ctx.getImageData).toHaveBeenCalledTimes(1)
    expect(ctx.getImageData.mock.calls[0]).toEqual([0, 0, 1, 2])
    expect(ctx.beginPath).not.toHaveBeenCalled()
    expect(ctx.moveTo).not.toHaveBeenCalled()
    expect(ctx.lineTo).not.toHaveBeenCalled()
    expect(ctx.stroke).not.toHaveBeenCalled()
    expect(mockedQR).toHaveBeenCalledTimes(1)
    expect(mockedQR).toHaveBeenCalledWith(null, 0, 0)
    expect(mockedPause).not.toHaveBeenCalled()
    expect(wrapper.vm.$data.timer).not.toBeNull()

    code = {
      location: {
        topLeftCorner: {x: 1.1, y: 1.2},
        topRightCorner: {x: 2.1, y: 2.2},
        bottomLeftCorner: {x: 3.1, y: 3.2},
        bottomRightCorner: {x: 4.1, y: 4.2},
      }
    }
    await new Promise(resolve => setTimeout(resolve, 600))

    expect(mockedPlay).toHaveBeenCalledTimes(1)
    expect(mockedPlay.mock.calls[0]).toEqual([])
    expect(ctx.drawImage).toHaveBeenCalledTimes(2)
    expect(ctx.drawImage.mock.calls[1]).toEqual([video, 0, 0, 1, 2])
    expect(ctx.getImageData).toHaveBeenCalledTimes(2)
    expect(ctx.getImageData.mock.calls[1]).toEqual([0, 0, 1, 2])
    expect(ctx.beginPath).toHaveBeenCalledTimes(1)
    expect(ctx.beginPath.mock.calls[0]).toEqual([])
    expect(ctx.moveTo).toHaveBeenCalledTimes(1)
    expect(ctx.moveTo.mock.calls[0]).toEqual([1.1, 1.2])
    expect(ctx.lineTo).toHaveBeenCalledTimes(4)
    expect(ctx.lineTo.mock.calls[0]).toEqual([2.1, 2.2])
    expect(ctx.lineTo.mock.calls[1]).toEqual([4.1, 4.2])
    expect(ctx.lineTo.mock.calls[2]).toEqual([3.1, 3.2])
    expect(ctx.lineTo.mock.calls[3]).toEqual([1.1, 1.2])
    expect(ctx.stroke).toHaveBeenCalledTimes(1)
    expect(ctx.stroke.mock.calls[0]).toEqual([])
    expect(mockedQR).toHaveBeenCalledTimes(2)
    expect(mockedQR).toHaveBeenCalledWith(null, 0, 0)
    expect(mockedPause).toHaveBeenCalledTimes(1)
    expect(mockedPlay.mock.calls[0]).toEqual([])
    expect(wrapper.vm.$data.timer).toBeNull()

    wrapper.destroy()
    expect(wrapper.vm.$data.timer).toBeNull()
  })

  it('ignores clearInterval when timer object is null', async () => {
    let code = null
    const mockedQR = jest.fn().mockImplementation(() => code)
    jest.mock('jsqr', () => mockedQR)

    const mockedPlay = jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => {})
    mockedPlay.mockClear()
    const mockedPause = jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    mockedPause.mockClear()

    const wrapper = mount(QRReader, {localVue, propsData: {
      width: '1px',
      height: '2px',
    }})
    const video = wrapper.vm.$refs.video
    const canvas = wrapper.vm.$refs.canvas
    const ctx = canvas.getContext('2d')
    ctx.drawImage = jest.fn()
    ctx.getImageData = jest.fn().mockReturnValue({data: null, width: 0, height: 0})
    ctx.beginPath = jest.fn()
    ctx.moveTo = jest.fn()
    ctx.lineTo = jest.fn()
    ctx.stroke = jest.fn()

    wrapper.vm.onloadedmetadata(video, canvas, ctx)()
    wrapper.vm.$data.timer = null
    await new Promise(resolve => setTimeout(resolve, 600))
    code = {
      location: {
        topLeftCorner: {x: 1.1, y: 1.2},
        topRightCorner: {x: 2.1, y: 2.2},
        bottomLeftCorner: {x: 3.1, y: 3.2},
        bottomRightCorner: {x: 4.1, y: 4.2},
      }
    }
    await new Promise(resolve => setTimeout(resolve, 600))

    wrapper.destroy()
    expect(wrapper.vm.$data.timer).toBeNull()
  })

  it('clears the interval if timer is not null', () => {
    const wrapper2 = mount(QRReader, {localVue, propsData: {
      width: '1px',
      height: '2px',
    }})
    const video2 = wrapper2.vm.$refs.video
    const canvas2 = wrapper2.vm.$refs.canvas
    const ctx2 = canvas2.getContext('2d')

    wrapper2.vm.onloadedmetadata(video2, canvas2, ctx2)()
    expect(wrapper2.vm.$data.timer).not.toBeNull()
    wrapper2.destroy()
    expect(wrapper2.vm.$data.timer).toBeNull()

  })

  it('prints logs when getUserMedia throws an exception', async () => {
    const propsData = { width: '1px', height: '2px' }
    navigator.mediaDevices.getUserMedia = jest.fn().mockRejectedValue(new Error('test error'))
    mount(QRReader, { localVue, propsData })
  })

})
