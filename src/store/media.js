import axios from 'axios'

export default {
	namespaced: true,
	state: {
		shows: [],
		serials: {},
		episodes: {},
		latest: {}
	},
	mutations: {
		addShows(state, data) {
			state.shows = data
		},
		addLatest(state, data) {
			state.latest = data
		},
		addSerials(state, { showId, data }) {
			const serials = {...state.serials}
			serials[showId] = data

			state.serials = serials
		},
		addEpisodes(state, { showId, data }) {
			const episodes = {...state.episodes}
			episodes[showId] = data

			state.episodes = episodes
		}
	},
	actions: {
		fetchShows ({ commit }) {
			const resource = this._vm.$config.apiRoot + 'shows'
			axios.get(resource)
				.then(response => {
					commit('addShows', response.data)
				})
				.catch(error => {
					console.log(error)
				})
		},
		fetchSerials ({ commit }, { showId }) {
			const resource = this._vm.$config.apiRoot + 'shows' + '/' + showId + '/serials'
			axios.get(resource)
				.then(response => {
					commit('addSerials', { showId, data: response.data })
				})
				.catch(error => {
					console.log(error)
				})
		},
		fetchEpisodes ({ commit }, { showId }) {
			const resource = this._vm.$config.apiRoot + 'shows' + '/' + showId
			axios.get(resource)
				.then(response => {
					commit('addEpisodes', { showId, data: response.data })
				})
				.catch(error => {
					console.log(error)
				})
		},
		fetchLatest ({ commit }) {
			const resource = this._vm.$config.apiRoot + 'latest'
			axios.get(resource)
				.then(response => {
					commit('addLatest', response.data)
				})
				.catch(error => {
					console.log(error)
				})
		}
	}
}