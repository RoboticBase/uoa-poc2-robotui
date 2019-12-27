import {getRobotState, patchMoveNext} from '@/rest'
import { before, after } from '@/../tests/vueCommon.js'
import axios from 'axios'

jest.mock('axios')

beforeAll(before(jest))
afterAll(after())

const endpoint = 'http://example.com:1234'
const prefix = 'test_prefix'
const robotId = 'test_robotId'
const token = 'test_token'

describe('getRobotState', () => {
  const testmessage = 'test message'
  afterEach(() => {
    axios.get.mockClear()
  })

  it('returns retrieved data (url pattern 1)', async () => {
    axios.get.mockResolvedValue({testmessage})

    const data = await getRobotState(endpoint, prefix, token, robotId)
    expect(data).toMatchObject({
      testmessage,
      result: 'success',
    })
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get.mock.calls[0][0]).toMatch('http://example.com:1234/test_prefix/api/v1/robots/test_robotId/')
    expect(axios.get.mock.calls[0][1]).toMatchObject({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer test_token",
      }
    })
  })

  it('returns retrieved data (url pattern 2)', async () => {
    axios.get.mockResolvedValue({testmessage})

    const prefix = '/test_prefix'
    const robotId = 'test_robotId/'

    const data = await getRobotState(endpoint, prefix, token, robotId)
    expect(data).toMatchObject({
      testmessage,
      result: 'success',
    })
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get.mock.calls[0][0]).toMatch('http://example.com:1234/test_prefix/api/v1/robots/test_robotId/')
    expect(axios.get.mock.calls[0][1]).toMatchObject({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer test_token",
      }
    })
  })

  it('returns retrieved data (url pattern 3)', async () => {
    axios.get.mockResolvedValue({testmessage})

    const prefix = 'test_prefix/'
    const robotId = 'test_robotId'

    const data = await getRobotState(endpoint, prefix, token, robotId)
    expect(data).toMatchObject({
      testmessage,
      result: 'success',
    })
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get.mock.calls[0][0]).toMatch('http://example.com:1234/test_prefix/api/v1/robots/test_robotId/')
    expect(axios.get.mock.calls[0][1]).toMatchObject({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer test_token",
      }
    })
  })

  it('returns retrieved data (url pattern 4)', async () => {
    axios.get.mockResolvedValue({testmessage})

    const prefix = '/test_prefix/'
    const robotId = '/test_robotId/'

    const data = await getRobotState(endpoint, prefix, token, robotId)
    expect(data).toMatchObject({
      testmessage,
      result: 'success',
    })
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get.mock.calls[0][0]).toMatch('http://example.com:1234/test_prefix/api/v1/robots/test_robotId/')
    expect(axios.get.mock.calls[0][1]).toMatchObject({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer test_token",
      }
    })
  })

  it('returns retrieved data (url pattern 5)', async () => {
    axios.get.mockResolvedValue({testmessage})

    const prefix = '/test/prefix/'
    const robotId = '/test/robotId/'

    const data = await getRobotState(endpoint, prefix, token, robotId)
    expect(data).toMatchObject({
      testmessage,
      result: 'success',
    })
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get.mock.calls[0][0]).toMatch('http://example.com:1234/test/prefix/api/v1/robots/test/robotId/')
    expect(axios.get.mock.calls[0][1]).toMatchObject({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer test_token",
      }
    })
  })

  it('returns retrieved data (url pattern 6)', async () => {
    axios.get.mockResolvedValue({testmessage})

    const prefix = ''
    const robotId = ''

    const data = await getRobotState(endpoint, prefix, token, robotId)
    expect(data).toMatchObject({
      testmessage,
      result: 'success',
    })
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get.mock.calls[0][0]).toMatch('http://example.com:1234/api/v1/robots/')
    expect(axios.get.mock.calls[0][1]).toMatchObject({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer test_token",
      }
    })
  })

  it('returns error data when axios rejects error response', async () => {
    axios.get.mockRejectedValue(new Error('test error'))

    const data = await getRobotState(endpoint, prefix, token, robotId)
    expect(data).toMatchObject({
      result: 'failure',
    })
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get.mock.calls[0][0]).toMatch('http://example.com:1234/test_prefix/api/v1/robots/test_robotId/')
    expect(axios.get.mock.calls[0][1]).toMatchObject({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer test_token",
      }
    })
  })
})

describe('patchMoveNext', () => {
  const res = {
    res: 'test response'
  }

  afterEach(() => {
    axios.patch.mockClear()
  })

  it('returns result data (url pattern 1)', async () => {
    axios.patch.mockResolvedValue(res)

    const data = await patchMoveNext(endpoint, prefix, token, robotId)
    expect(data).toMatchObject({
      result: 'success',
      message: '',
      response: res,
    })
    expect(axios.patch).toHaveBeenCalledTimes(1)
    expect(axios.patch.mock.calls[0][0]).toMatch('http://example.com:1234/test_prefix/api/v1/robots/test_robotId/nexts/')
    expect(axios.patch.mock.calls[0][1]).toMatchObject({})
    expect(axios.patch.mock.calls[0][2]).toMatchObject({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer test_token",
      }
    })
  })

  it('returns result data (url pattern 2)', async () => {
    axios.patch.mockResolvedValue(res)

    const prefix = ''
    const robotId = 'test_robotId/'

    const data = await patchMoveNext(endpoint, prefix, token, robotId)
    expect(data).toMatchObject({
      result: 'success',
      message: '',
      response: res,
    })
    expect(axios.patch).toHaveBeenCalledTimes(1)
    expect(axios.patch.mock.calls[0][0]).toMatch('http://example.com:1234/api/v1/robots/test_robotId/nexts/')
    expect(axios.patch.mock.calls[0][1]).toMatchObject({})
    expect(axios.patch.mock.calls[0][2]).toMatchObject({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer test_token",
      }
    })
  })

  it('returns result data (url pattern 3)', async () => {
    axios.patch.mockResolvedValue(res)

    const prefix = '/test_prefix/'
    const robotId = '/'

    const data = await patchMoveNext(endpoint, prefix, token, robotId)
    expect(data).toMatchObject({
      result: 'success',
      message: '',
      response: res,
    })
    expect(axios.patch).toHaveBeenCalledTimes(1)
    expect(axios.patch.mock.calls[0][0]).toMatch('http://example.com:1234/test_prefix/api/v1/robots/nexts/')
    expect(axios.patch.mock.calls[0][1]).toMatchObject({})
    expect(axios.patch.mock.calls[0][2]).toMatchObject({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer test_token",
      }
    })
  })

  it('returns error data when axios rejects 412 error response', async () => {
    const err = new Error('test error')
    const response = {
      status: 412,
      description: '412 error',
    }
    err.response = response
    axios.patch.mockRejectedValue(err)

    const data = await patchMoveNext(endpoint, prefix, token, robotId)
    expect(data).toMatchObject({
      result: 'warning',
      message: '次のルートは設定されていません',
      response: response,
    })
    expect(axios.patch).toHaveBeenCalledTimes(1)
    expect(axios.patch.mock.calls[0][0]).toMatch('http://example.com:1234/test_prefix/api/v1/robots/test_robotId/nexts/')
    expect(axios.patch.mock.calls[0][1]).toMatchObject({})
    expect(axios.patch.mock.calls[0][2]).toMatchObject({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer test_token",
      }
    })
  })

  it('returns error data when axios rejects 423 error response', async () => {
    const err = new Error('test error')
    const response = {
      status: 423,
      description: '423 error',
    }
    err.response = response
    axios.patch.mockRejectedValue(err)

    const data = await patchMoveNext(endpoint, prefix, token, robotId)
    expect(data).toMatchObject({
      result: 'warning',
      message: 'ロボットが移動中です',
      response: response,
    })
    expect(axios.patch).toHaveBeenCalledTimes(1)
    expect(axios.patch.mock.calls[0][0]).toMatch('http://example.com:1234/test_prefix/api/v1/robots/test_robotId/nexts/')
    expect(axios.patch.mock.calls[0][1]).toMatchObject({})
    expect(axios.patch.mock.calls[0][2]).toMatchObject({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer test_token",
      }
    })
  })

  it('returns error data when axios rejects other error response', async () => {
    const err = new Error('test error')
    const response = {
      status: 500,
      description: '500 error',
    }
    err.response = response
    axios.patch.mockRejectedValue(err)

    const data = await patchMoveNext(endpoint, prefix, token, robotId)
    expect(data).toMatchObject({
      result: 'failure',
      message: err,
      response: response,
    })
    expect(axios.patch).toHaveBeenCalledTimes(1)
    expect(axios.patch.mock.calls[0][0]).toMatch('http://example.com:1234/test_prefix/api/v1/robots/test_robotId/nexts/')
    expect(axios.patch.mock.calls[0][1]).toMatchObject({})
    expect(axios.patch.mock.calls[0][2]).toMatchObject({
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "bearer test_token",
      }
    })
  })
})
