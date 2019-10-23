const voice = speechSynthesis.getVoices()[36]

export default function (utterance, volume = 1) {
  let u = new SpeechSynthesisUtterance()
  u.text = utterance
  u.lang = 'ja-JP'
  u.voice = voice
  u.rate = 1.0
  u.volume = volume
  speechSynthesis.speak(u)
}
