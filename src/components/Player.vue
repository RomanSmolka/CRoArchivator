<template>
	<div class="player">
		<audio hidden ref="audioEl"  @timeupdate="currentTime = $event.target.currentTime"></audio>

		<div class="controls">
			<button class="btn btn--round btn--secondary btn--icon" :disabled="!localQueue[cursor-1]" @click="changeTrack(cursor-1)">
				<svg class="icon icon--15 icon--rewind"><use href="#icon-rewind"></use></svg>
			</button>
			<button class="btn btn--round btn--gradient btn--icon" @click="togglePlayback">
				<svg class="icon icon--20 icon--pause" v-if="playerState === 'playing'"><use href="#icon-pause"></use></svg>
				<svg class="icon icon--50 icon--play" v-else><use href="#icon-play"></use></svg>
			</button>
			<button class="btn btn--round btn--secondary btn--icon" :disabled="!nextTrack" @click="changeTrack(cursor+1)">
				<svg class="icon icon--15 icon--forward"><use href="#icon-forward"></use></svg>
			</button>
		</div>

		<div class="playing">
			<h4>
				{{ currentTrack | __getFullTitle }}
			</h4>
			<div class="progress">
				<span class="time text-right">{{ currentTime | __secondsToHms }}</span>
				<input type="range" min="0" :max="duration.toFixed()" :value="currentTime" ref="progressBar">
				<span class="duration text-left">{{ duration | __secondsToHms }}</span>
			</div>
		</div>

		<div class="next" :class="{empty: !nextTrack}" @click="queueOpen = !queueOpen">
			<small>Následuje:</small>
			<p class="next-track">{{ nextTrack | __getFullTitle }}</p>
			<svg class="icon icon--15 icon--angle-u" :class="{rotated: queueOpen}"><use href="#icon-angle-u"></use></svg>
		</div>

		<transition name="fade" :duration="{ leave: 0 }">
			<div v-if="queueOpen" class="queue" v-click-outside="{callback: () => queueOpen = false, excludeClasses: ['next', 'icon', 'btn', 'progress']}">
				<draggable v-model="localQueue" v-bind="dragOptions">
					<transition-group>
						<div v-for="(item, index) in localQueue" :key="item.stamp">

							<div class="queue-item" :class="{current: cursor === index, past: cursor > index, ['item-'+(localQueue.length-index)]: true}">
								<h4 @click="changeTrack(index)"><svg class="icon icon--20 icon--play"><use href="#icon-play"></use></svg>{{ item | __getFullTitle }}</h4>
								<small>
									<svg class="icon icon--10 icon--clock"><use href="#icon-clock"></use></svg>
									<span class="duration">{{ item.attributes.audioLinks[0].duration | __secondsToHms }}</span>
									<v-popover trigger="click" placement="top">
										<svg class="icon icon--20 icon--menu-dots"><use href="#icon-menu-dots"></use></svg>
										<template slot="popover">
											<button @click="removeItemFromQueue(index)" title="Odstranit" v-close-popover>
												<svg class="icon icon--20 icon--trash"><use href="#icon-trash"></use></svg>
											</button>
											<button @click="goToEpisodeDetail(item)" title="Zobrazit detail" v-close-popover>
												<svg class="icon icon--20 icon--programme"><use href="#icon-programme"></use></svg>
											</button>
										</template>
									</v-popover>
								</small>
								<svg class="handle icon icon--30 icon--drag-dots"><use href="#icon-drag-dots"></use></svg>
							</div>

						</div>
					</transition-group>
				</draggable>
			</div>
		</transition>

	</div>
</template>

<script>
import { __getFullTitle, __secondsToHms } from '@/lib/helpers'
import draggable from "vuedraggable"

export default {
	name: 'Player',
	components: {
		draggable
	},
	filters: {
		__getFullTitle,
		__secondsToHms
	},
	data() {
		return {
			localQueue: [],
			currentTime: 0,
			duration: 0,
			isSeeking: false,
			queueOpen: false,
			orderUpdated: false,
			dragOptions: {
				animation: 300,
				handle: '.handle'
			}
		}
	},
	computed: {
		queue() {
			return this.$store.state.player.playerMedia
		},
		playerState() {
			return this.$store.state.player.playerState
		},
		cursor: {
			get() {
				return this.$store.state.player.playerCursor
			},
			set(val) {
				this.$store.commit('player/setPlayerCursor', val)
			}
		},
		currentTrack() {
			return this.queue[this.cursor] || null
		},
		nextTrack() {
			return this.queue[this.cursor+1] || null
		},
		currentAudio() {
			if (this.currentTrack) {
				return this.$config.staticBase + encodeURI(this.currentTrack.localFile.replace('public/', ''))
			} else {
				return ''
			}
		}
	},
	methods: {
		togglePlayback() {
			this.$store.commit('player/setPlayerState', this.playerState === 'playing' ? 'paused' : 'playing')
		},
		changeTrack(index) {
			this.cursor = index
			this.$store.commit('player/setPlayerState', 'reset-play')
		},
		removeItemFromQueue(index) {
			const cursor = this.cursor

			if (index < cursor) {
				this.cursor--
			} else if (index === this.localQueue.length-1) {
				this.cursor = this.localQueue.length-2
			}

			this.localQueue.splice(index, 1)

			if (index === cursor) {
				this.$store.commit('player/setPlayerState', this.playerState === 'playing' ? 'reset-play' : 'reset')
			}
		},
		goToEpisodeDetail(episode) {
			const serialId = episode.relationships.serial.data && episode.relationships.serial.data.id || ''
			if (serialId) {
				this.$router.push({ name: 'Serial', params: {id: serialId} })
			} else {
				this.$router.push({ name: 'Episodes', params: {id: episode.id} })
			}
		}
	},
	watch: {
		queue(queue) {
			this.localQueue = queue
		},
		localQueue(queue) {
			if (this.currentTrack) {
				queue.some((item, index) => {
					if (item.stamp === this.currentTrack.stamp) {
						this.cursor = index
						return true
					}
				})
			}
			this.$store.commit('player/setPlayerMedia', queue)
		},
		playerState(state) {
			if (state === 'reset') {
				this.$refs.audioEl.src = this.currentAudio
				this.$store.commit('player/setPlayerState', 'paused')
			} 
			else if (state === 'reset-play') {
				this.$refs.audioEl.src = this.currentAudio
				this.$refs.audioEl.play()
				.then(() => {
					this.duration = this.$refs.audioEl.duration
					this.$store.commit('player/setPlayerState', 'playing')
				})
				.catch(error => {
					console.log(error)
				})
			} 
			else if (state === 'playing') {
				if (!this.$refs.audioEl.src) {
					this.$refs.audioEl.src = this.currentAudio
				}
				this.$refs.audioEl.play()
			} 
			else {
				this.$refs.audioEl.pause()
			}
		},
		currentTime(time) {
			if (time === this.duration) {
				this.$store.commit('player/setPlayerState', 'paused')
			}
		}
	},
	mounted() {
		this.$refs.progressBar.addEventListener('mousedown', () => {
			this.isSeeking = true
			this.$refs.audioEl.pause()
		})
		this.$refs.progressBar.addEventListener('touchstart', () => {
			this.isSeeking = true
			this.$refs.audioEl.pause()
		})

		this.$refs.progressBar.addEventListener('mousemove', (e) => {
			if (this.isSeeking) {
				this.$refs.audioEl.currentTime = e.target.value
			}
		})
		this.$refs.progressBar.addEventListener('touchmove', (e) => {
			if (this.isSeeking) {
				this.$refs.audioEl.currentTime = e.target.value
			}
		})

		this.$refs.progressBar.addEventListener('click', (e) => {
			this.$refs.audioEl.currentTime = e.target.value
		})

		this.$refs.progressBar.addEventListener('mouseup', () => {
			if (this.playerState === 'playing') {
				this.$refs.audioEl.play()
			}
			this.isSeeking = false
		})
		this.$refs.progressBar.addEventListener('touchend', () => {
			if (this.playerState === 'playing') {
				this.$refs.audioEl.play()
			}
			this.isSeeking = false
		})

		this.$refs.audioEl.addEventListener('durationchange', () => {
			this.duration = this.$refs.audioEl.duration
		})

		this.$refs.audioEl.addEventListener('ended', () => {
			if (this.nextTrack) {
				this.cursor++
				this.$store.commit('player/setPlayerState', 'reset-play')
			}
		})
	}
}
</script>

<style scoped lang="scss">

@mixin range-track() {
	box-sizing: border-box;
	height: 3px;
	background-color: $clrSeparator;
	border-radius: 10px;
}
@mixin range-thumb() {
	appearance: none;
	// box-shadow: 0 0 10px 0 rgba(255,55,60,0.5);
	height: 25px;
	width: 25px;
	border: none;
	border-radius: 30px;
	background: radial-gradient(circle, rgb(255, 55, 60) 0%, rgb(255, 55, 60) 32%, rgba(255,55,60,0.1) 34%, rgba(255,55,60,0.02) 60%, rgba(255,255,255,0) 70%, rgba(255,255,255,0) 100%);
	transition: transform 250ms ease;
	cursor: grab;
}

.player {
	position: fixed;
	display: flex;
	bottom: 0;
	left: 0;
	width: 100%;
	height: rem(70px);
	background-color: rgba(255, 255, 255, 0.9);
	box-shadow: 0 0 30px #00000020;
	backdrop-filter: blur(15px);
	z-index: 200;
	@include mobileSize {
		flex-direction: column-reverse;
		height: auto;
	}

	.icon {
		fill: $clrRed;
		&--play, &--pause {
			fill: #fff;
		}
	}

	.controls {
		display: flex;
		flex: 1 0 25%;
		align-items: center;
		padding-left: rem(15px);
		@include mobileSize {
			flex: 1 0 100%;
			justify-content: center;
			max-width: 100%;
			margin-bottom: rem(10px);
		}
		.btn {
			margin: 0 rem(5px);
			transition: background-color 250ms ease;
			width: rem(30px);
			height: rem(30px);
			@include mobileSize {
				width: rem(35px);
				height: rem(35px);
			}
			&--gradient {
				background-color: $clrRed;
				box-shadow: 0 3px 16px 0 rgba(255,55,60,0.19);
				width: rem(50px);
				height: rem(50px);
				&:hover {
					background-image: none;
				}
			}
		}
	}
	.playing {
		flex: 1 0 50%;
		max-width: 50%;
		text-align: center;
		border-right: 1px solid $clrSeparator;
		@include mobileSize {
			flex: 1 0 100%;
			max-width: 100%;
			margin: 0;
			border: none;
		}

		h4 {
			padding: 0 rem(15px);
			overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			@include mobileSize {
				-webkit-line-clamp: 2;
			}
		}

		.progress {
			display: flex;
			align-items: center;

			input {
				flex-grow: 1;
				margin: 0 rem(10px);
				appearance: none;
				padding: 0;
				display: block;
				@include mobileSize {
					margin: rem(10px) rem(5px);
				}

				&:focus {
					outline: none;
				}

				&::-webkit-slider-runnable-track {
					@include range-track();
					margin: 0;
					background-color: transparent;
					background-image: linear-gradient(90deg, #00000000 10px, $clrSeparator 10px, $clrSeparator calc(100% - 10px), #00000000 calc(100% - 10px) 100%);
				}
				&::-moz-range-track {
					@include range-track();
					margin: 0;
					width: calc(100% - 12px);
				}

				&::-webkit-slider-thumb {
					@include range-thumb();
					transform: translateY(-11px);
					&:hover {
						transform: translateY(-11px) scale(1.4);
					}
				}
				&::-moz-range-thumb {
					@include range-thumb();
					&:hover {
						transform: scale(1.4);
					}
				}
			}

			.time, .duration {
				width: rem(60px);
				@include mobileSize {
					font-size: rem(14px);
				}
			}
		}
	}

	.next {
		position: relative;
		display: flex;
		flex: 1 0 25%;
		flex-direction: column;
		padding: rem(10px) rem(30px) 0 rem(15px);
		transition: opacity 250ms ease;
		cursor: pointer;
		user-select: none;
		&:hover {
			opacity: 0.8;
		}

		small {
			@include mobileSize {
				display: none;
			}
		}

		.next-track {
			font-size: rem(12px);
			font-weight: 600;
			overflow: hidden;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			@include mobileSize {
				-webkit-line-clamp: 1;
				&::before {
					content: "Následuje: ";
				}
			}
		}

		.icon {
			position: absolute;
			right: rem(15px);
			top: calc(50% - #{rem(4px)});
		}

	}

	.queue {
		position: absolute;
		right: 0;
		bottom: rem(70px);
		width: 30%;
		max-height: calc(100vh - 70px);
		overflow-y: auto;
		background-color: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(15px);
		padding: rem(10px) 0;
		box-shadow: 0 0 30px #00000020;
		border-radius: 5px 0 0;
		border-bottom: 1px solid $clrSeparator;
		clip-path: inset(-40px 0px 0px -40px);
		transition: all 400ms ease;
		@include mobileSize {
			position: relative;
			width: auto;
			bottom: 0;
		}

		&.fade-enter {
			opacity: 0;
			.queue-item {
				transform: translateY(20%);
				opacity: 0;
				transition: opacity 400ms ease, transform 0 linear 400ms;
			}
		}

		.queue-item {
			position: relative;
			padding: rem(5px) rem(35px) rem(5px) rem(30px);
			transition: opacity 400ms ease, transform 300ms ease;
			user-select: none;

			&.item-0 {
				transition-delay: 50ms;
			}
			&.item-1 {
				transition-delay: 100ms;
			}
			&.item-2 {
				transition-delay: 150ms;
			}
			&.item-3 {
				transition-delay: 200ms;
			}
			&.item-4 {
				transition-delay: 250ms;
			}
			&.item-5 {
				transition-delay: 300ms;
			}
			&.item-6 {
				transition-delay: 350ms;
			}
			&.item-7 {
				transition-delay: 400ms;
			}
			&.item-8 {
				transition-delay: 450ms;
			}

			h4 {
				position: relative;
				margin: 0;
				font-size: rem(14px);
				color: $clrDark;
				cursor: pointer;
				&:hover {
					color: $clrRed;
				}
			}
			small {
				display: flex;
				align-items: baseline;
				font-size: rem(12px);
			}
			.duration {
				margin-right: rem(5px);
			}
			.icon--clock {
				margin-right: rem(5px);
				position: relative;
				top: 1px;
				fill: $clrBody;
			}
			.icon--menu-dots {
				position: relative;
				top: 5.5px;
				cursor: pointer;
			}
			.icon--play {
				display: none;
				position: absolute;
				left: rem(-25px);
				top: 1px;
				fill: $clrRed;
			}
			.handle {
				position: absolute;
				right: rem(10px);
				top: rem(6px);
				fill: $clrBody;
				cursor: grab;
			}

		}

		.current {
			h4 {
				color: $clrHighlight;
			}
			.icon--play {
				display: inline-block;
			}
		}

		.past {
			opacity: 0.4;
		}

		.sortable-ghost{
			visibility: hidden;
		}

	}
}
</style>
