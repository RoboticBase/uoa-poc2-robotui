import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import Home from '@/views/Home.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

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
    const originalError = console.error;
    console.error = jest.fn();

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

    console.error = originalError;
  })
})
