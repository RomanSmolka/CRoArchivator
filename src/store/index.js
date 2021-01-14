import Vue from 'vue'
import Vuex from 'vuex'

import media from './media'
import player from './player'
import routing from './routing'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		media,
		player,
		routing
	},
	state: {
		navOpen: false
	},
	mutations: {
		toggleNav(state) {
			const navOpen = state.navOpen
			document.body.className = navOpen ? '' : 'nav-open'
			state.navOpen = !navOpen
		}
	}
})
