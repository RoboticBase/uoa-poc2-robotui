module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  setupFilesAfterEnv: ['<rootDir>/tests/unit/jest.setup.js'],
  globals: {
    speechSynthesis: null,
    SpeechSynthesisUtterance: null,
    navigator: null,
  },
  collectCoverage: true
}
