import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VTooltip from 'v-tooltip'
import VSelect from 'vue-select'
import {clickOutside} from './lib/directives'

import OpenIndicator from './components/OpenIndicator.vue'

import './theme/style.scss'

const devEnv = process.env.NODE_ENV === 'development'

// eslint-disable-next-line no-undef
const ngrokTunnel = typeof tunnel === 'undefined' ? '' : tunnel
const config = {
	apiRoot: devEnv ? 'http://192.168.0.21:5000/' : ngrokTunnel + '/cro/api/',
	staticBase: devEnv ? 'http://192.168.0.21/' : ngrokTunnel + '/',
	artworkTeaserBase: 'https://www.mujrozhlas.cz/sites/default/files/styles/teaser/public/rapi/',
	artworkTeaserBaseAlt: 'https://portal.rozhlas.cz/sites/default/files/styles/cro_16x9_default/public/',
	artworkDetailBase: 'https://www.mujrozhlas.cz/sites/default/files/styles/detail/public/rapi/',
	artworkDetailBaseAlt: 'https://portal.rozhlas.cz/sites/default/files/styles/cro_16x9_default/public/'
}

VSelect.props.components.default = () => ({ OpenIndicator })

Vue.prototype.$config = config

Vue.config.productionTip = false
Vue.use(VTooltip)
Vue.directive(clickOutside)
Vue.component('v-select', VSelect)

new Vue({
	router,
	store,
	render: function (h) { return h(App) }
}).$mount('#app')
