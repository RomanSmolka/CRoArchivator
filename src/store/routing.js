export default {
	namespaced: true,
	state: {
		switchingRoute: false,
		routerGoingUp: false,
		history: []
	},
	mutations: {
		setSwitchingRoute(state, data) {
			state.switchingRoute = data
		},
		setRouterGoingUp(state, data) {
			state.routerGoingUp = data
		},
		addHistoryItem(state, item) {
			state.history.push(item)
		},
		removeLastHistoryItem(state) {
			state.history.pop()
		}
	}
}