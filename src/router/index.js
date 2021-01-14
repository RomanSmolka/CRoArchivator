import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

import Home from '../views/Home.vue'
import Search from '../views/Search.vue'
import Show from '../views/Show.vue'
import Serial from '../views/Serial.vue'
import EpisodeDetail from '../views/EpisodeDetail.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		meta: {
			level: 0
		}
	},
	{
		path: '/search',
		name: 'Search',
		component: Search,
		meta: {
			level: 0
		}
	},
	{
		path: '/show/:id',
		name: 'Show',
		component: Show,
		meta: {
			level: 1
		}
	},
	{
		path: '/serial/:id',
		name: 'Serial',
		component: Serial,
		meta: {
			level: 2
		}
	},
	{
		path: '/episodes/:id',
		name: 'Episodes',
		component: EpisodeDetail,
		meta: {
			level: 2
		}
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.NODE_ENV === 'development' ? '' : '/cro',
	routes,
	scrollBehavior (to, from, savedPosition) {
		return new Promise((resolve) => {
			setTimeout(() => {
				if (savedPosition) {
					resolve(savedPosition)
				} else {
					resolve({ x: 0, y: 0 })
				}
			}, 90)
		})
	}
})

router.beforeEach((to, from, next) => {
	const prevHistoryItem = store.state.routing.history[store.state.routing.history.length-2]
	const goingBack = to.path == prevHistoryItem

	store.commit('routing/setSwitchingRoute', to.meta.level >= from.meta.level && !goingBack)
	store.commit('routing/setRouterGoingUp', to.meta.level < from.meta.level || goingBack)

	if (goingBack) store.commit('routing/removeLastHistoryItem')
	else store.commit('routing/addHistoryItem', to.path)

	setTimeout(() => {
		next()
	}, 150)
})

router.afterEach(() => {
	setTimeout(() => {
		store.commit('routing/setSwitchingRoute', false)
	}, 700)
})

export default router
