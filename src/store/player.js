export default {
	namespaced: true,
	state: {
		playerMedia: [],
		playerCursor: 0,
		playerState: 'stopped'
	},
	mutations: {
		addMediaToPlayer(state, {data, playNow}) {
			const newItem = {...data}
			newItem.stamp = Math.random().toString().replace("0.", "")

			if (playNow && state.playerMedia.length) {
				const playerMedia = [...state.playerMedia]
				playerMedia.splice(state.playerCursor+1, 0, newItem)

				state.playerMedia = playerMedia
				state.playerCursor++
			} else {
				state.playerMedia.push(newItem)
			}
		},
		setPlayerMedia(state, data) {
			state.playerMedia = data
		},
		setPlayerCursor(state, data) {
			state.playerCursor = data
		},
		setPlayerState(state, data) {
			state.playerState = data
		}
	}
}