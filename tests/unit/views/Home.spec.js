import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Home from '@/views/Home.vue'
import { localVue, before, after } from '../vueCommon.js'

beforeAll(before(jest))
afterAll(after())

const dummyComponent = Vue.extend({
  name: 'dummy',
  template: '<div>dummy</div>',
})

describe('Home.vue', () => {

  it('renders a component when store.robotState is a registered component name', () => {

    const store = new Vuex.Store({
      state: {
        robotState: 'dummy'
      },
      getters: {
        message: () => '',
        variant: () => '',
      }
    })

    const wrapper = mount(Home, {store, localVue, stubs: {'dummy': dummyComponent}})
    expect(wrapper.attributes()).toMatchObject({class: 'home container'})
    expect(wrapper.html()).toMatch('<div>dummy</div>')
    expect(wrapper.html()).toMatch('<div class="alert container">')
  })

  it('can not render a component when store.robotState is an unregistered component name', () => {
    const store = new Vuex.Store({
      state: {
        robotState: 'invalid'
      },
      getters: {
        message: () => '',
        variant: () => '',
      }
    })

    const wrapper = mount(Home, {store, localVue, stubs: {'dummy': dummyComponent}})
    expect(wrapper.attributes()).toMatchObject({class: 'home container'})
    expect(wrapper.html()).not.toMatch('<div>dummy</div>')
    expect(wrapper.html()).toMatch('<div class="alert container">')
  })
})
