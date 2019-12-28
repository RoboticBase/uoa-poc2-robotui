import speak from '@/speak'
import { before, after } from '@/../tests/vueCommon.js'

beforeAll(before(jest))
afterAll(after())

describe('speak', () => {
  const utterance = 'test utterance'

  beforeEach(() => {
    speechSynthesis.speak.mockClear()
  })

  it('calls speechSynthesis.speak by default volume', () => {
    speak(utterance)
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak.mock.calls[0][0]).toMatchObject({
      text: utterance,
      lang: 'ja-JP',
      voice: 36,
      rate: 1.0,
      volume: 1.0,
    })
  })

  it('calls speechSynthesis.speak by specified volume', () => {
    speak(utterance, 0.5)
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak.mock.calls[0][0]).toMatchObject({
      text: utterance,
      lang: 'ja-JP',
      voice: 36,
      rate: 1.0,
      volume: 0.5,
    })
  })

})
