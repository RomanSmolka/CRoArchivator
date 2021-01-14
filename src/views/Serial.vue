<template>
	<div class="serial">
		<h2 class="section-title"><span>{{ serialTitle }}</span></h2>
		<div class="content">
			<div class="detail">
				<img v-if="artwork" class="artwork" :src="artworkUrl" :altsrc="artworkUrlAlt" :srcfallback="artwork"
					onerror="if (this.src==this.attributes.altsrc.value) {this.onerror=null; this.src=this.attributes.srcfallback.value} else {this.src=this.attributes.altsrc.value}"
				>
				<div v-html="description"></div>
			</div>
			<div class="episodes">
				<div v-for="episode in episodes" :key="episode.id" class="episode" :class="{playing: currentlyPlaying === episode.id}">
					<div class="episode-body" @click="playEpisode(episode)">
						<h4>
							<svg class="icon icon--25 icon--play"><use href="#icon-play"></use></svg>
							Epizoda {{ episode.attributes.part }} | {{ episode.attributes.title }}
						</h4>
						<p>{{ episode.attributes.description | __sanitizeText }}</p>
						<small class="meta">
							<svg class="icon icon--10 icon--clock"><use href="#icon-clock"></use></svg>
							{{ episode.attributes.audioLinks[0].duration | __secondsToHms }}
						</small>
					</div>
					<button class="btn-queue" title="Přidat do fronty">
						<svg class="icon icon--20 icon--note-plus" @click="addEpisodeToQueue(episode)"><use href="#icon-note-plus"></use></svg>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import { __sanitizeText, __secondsToHms } from '@/lib/helpers'

export default {
	name: 'Serial',
	data() {
		return {
			serial: {},
			episodes: null
		}
	},
	filters: {
		__sanitizeText,
		__secondsToHms
	},
	computed: {
		serialId() {
			return this.$route.params.id
		},
		serialTitle() {
			return this.episodes && this.episodes[0]['attributes']['mirroredSerial']['title']
		},
		description() {
			return this.serial.attributes && this.serial.attributes.description || ''
		},
		artwork() {
			return this.serial.attributes && this.serial.attributes.asset && this.serial.attributes.asset.url || ''
		},
		artworkFilename() {
			return this.artwork.split('/').pop()
		},
		artworkUrl() {
			return this.$config.artworkDetailBase + this.artworkFilename
		},
		artworkUrlAlt() {
			return this.$config.artworkDetailBaseAlt + this.artworkFilename
		},
		currentlyPlaying() {
			const cursor = this.$store.state.player.playerCursor
			return this.$store.state.player.playerMedia[cursor] && this.$store.state.player.playerMedia[cursor]['id']
		}
	},
	methods: {
		fetchEpisodes() {
			if (!this.episodes) {
				const resource = this.$config.apiRoot + 'serials' + '/' + this.serialId
				axios.get(resource)
					.then(response => {
						this.episodes = response.data['data']
						this.serial = response.data['info']
					})
					.catch(error => {
						console.log(error)
					})
			}
		},
		playEpisode(episode) {
			this.$store.commit('player/addMediaToPlayer', { data: episode, playNow: true})
			this.$store.commit('player/setPlayerState', 'reset-play')
		},
		addEpisodeToQueue(episode) {
			this.$store.commit('player/addMediaToPlayer', { data: episode })
		}
	},
	created() {
		this.fetchEpisodes()
	}
}
</script>

<style lang="scss" scoped>
h3 {
	margin-top: rem(15px);
	text-transform: uppercase;
	font-size: 18px;
}
.content {
	display: flex;
	@include mobileSize {
		flex-direction: column;
	}
}
.detail {
	flex: 0 0 50%;
	margin-right: rem(60px);
	@include mobileSize {
		margin-right: 0;
	}
}
.artwork {
	width: 100%;
	height: auto;
	border-radius: 6px;
	margin: rem(25px) 0;
	object-fit: cover;
	@include mobileSize {
		width: 100%;
		height: auto;
		margin: rem(10px) 0;
	}
}
.episodes {
	display: block;
	margin-top: rem(5px);
	@include mobileSize {
		margin-top: rem(15px);
	}
	.episode {
		display: flex;
		position: relative;
		padding: rem(15px) 0;
		&:not(:last-child) {
			border-bottom: 1px solid $clrSeparator;
		}
		&-body {
			margin-right: rem(10px);
			cursor: pointer;
			flex-grow: 1;
			.meta {
				display: flex;
				align-items: center;
				.icon {
					margin-right: rem(5px);
				}
			}
			p {
				margin: rem(5px) 0;
			}
			&:hover {
				h4 {
					color: $clrHighlight;
				}
			}
		}
		&.playing {
			h4 {
				color: $clrHighlight;
				.icon {
					display: inline-block;
				}
			}
		}
	}
	h4 {
		margin: 0;
		position: relative;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		.icon {
			display: none;
			position: absolute;
			left: -30px;
			top: -1px;
			fill: $clrRed;
		}
	}
	p {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
}
</style>
