import { mount } from '@vue/test-utils'
import Vuex from 'vuex'
import Header from '@/components/Header.vue'

import { localVue, before, after } from '../vueCommon.js'

beforeAll(before(jest))
afterAll(after())

describe('Header.vue', () => {
  let actions = null
  let state = null
  let store = null

  beforeEach(() => {
    actions = {
      disconnectAction: jest.fn(),
    }
    state = {
      robotId: '',
    }
    store = new Vuex.Store({
      state: state,
      actions: actions,
    })
  })

  it('renders a header component', () => {
    state.robotId = 'robot 01'

    const wrapper = mount(Header, {store, localVue})
    expect(wrapper.attributes()).toMatchObject({class: 'header'})
    expect(wrapper.find('div.header').find('nav.navbar').find('div.navbar-brand').html()).toMatch('<div class="navbar-brand">robot 01</div>')
    expect(wrapper.find('div.header')
                  .find('nav.navbar')
                  .find('ul.navbar-nav')
                  .find('form.form-inline')
                  .find('button').html()).toMatch('<button class="btn btn-outline-dark btn-sm">切断</button>')
    expect(actions.disconnectAction).not.toHaveBeenCalled()
  })

  it('invokes disconnectAction when clicking button', async () => {
    state.robotId = 'robot 02'

    const wrapper = mount(Header, {store, localVue})
    expect(wrapper.find('div.header').find('nav.navbar').find('div.navbar-brand').html()).toMatch('<div class="navbar-brand">robot 02</div>')

    wrapper.find('button.btn').trigger('click')
    await wrapper.vm.$nextTick()

    expect(actions.disconnectAction).toHaveBeenCalledTimes(1)
    const calledArgs = actions.disconnectAction.mock.calls[0]
    expect(calledArgs[calledArgs.length - 1]).toBeUndefined()
  })
})
