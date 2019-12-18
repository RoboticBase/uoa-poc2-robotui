import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import StandBy from '@/views/StandBy.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('Standby.vue', () => {

  beforeEach(() => {
    speechSynthesis.speak.mockClear()
  })

  it('renders the standby view', () => {
    const store = new Vuex.Store({
      state: {
        destination: 'test1',
      }
    })
    const wrapper = mount(StandBy, {store, localVue})
    expect(wrapper.attributes()).toMatchObject({class: 'standby'})
    expect(wrapper.find('div.header').find('nav.navbar').find('ul.navbar-nav').find('form.form-inline').find('button.btn').html()).toMatch('<button class="btn btn-outline-dark btn-sm">切断</button>')
    expect(wrapper.find('div.display').find('span.display-1').html()).toMatch('<span class="display-1">待機中</span>')
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1)
    expect(speechSynthesis.speak.mock.calls[0][0].text).toMatch('test1に到着しました。待機します。')
    expect(speechSynthesis.speak.mock.calls[0][0].volume).toEqual(1)
  })
})
