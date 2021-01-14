<template>
	<div class="episode_detail">
		<div v-if="episode.id">
			<div class="cover">
				<img class="artwork" :src="artworkUrl" :altsrc="artworkUrlAlt" :srcfallback="artwork"
					onerror="if (this.src==this.attributes.altsrc.value) {this.onerror=null; this.src=this.attributes.srcfallback.value} else {this.src=this.attributes.altsrc.value}"
				>
				<div class="detail">
					<p>{{ episode.attributes.mirroredShow.title }}</p>
					<h2>{{ episodeTitle }}</h2>
					<div class="meta">
						<svg class="icon icon--15 icon--clock"><use href="#icon-clock"></use></svg>
						{{ episode.attributes.audioLinks[0].duration | __secondsToHms }}
					</div>
					<div class="buttons">
						<button class="btn btn--primary" @click="play">Přehrát</button>
						<button class="btn btn--secondary" @click="addToQueue">Přidat do fronty</button>
					</div>
				</div>
			</div>
			<div class="description" v-html="episode.attributes.description"></div>
			<div class="serial" v-if="isSerial">
				<h3>Další epizody seriálu</h3>
				<div class="episodes">
					<Episode v-for="episode in serialFiltered" :key="episode.id" :episode="episode" displayDescription />
					<div class="episodes__item"></div>
					<div class="episodes__item"></div>
					<div class="episodes__item"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import { __getFullTitle, __secondsToHms } from '@/lib/helpers'

import Episode from '@/components/Episode'

export default {
	name: 'EpisodeDetail',
	components: {
		Episode
	},
	filters: {
		__getFullTitle,
		__secondsToHms
	},
	data() {
		return {
			episode: {},
			serial: []
		}
	},
	computed: {
		episodeId() {
			return this.$route.params.id
		},
		episodeTitle() {
			return __getFullTitle(this.episode)
		},
		artwork() {
			return this.episode.attributes.asset && this.episode.attributes.asset.url || ''
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
		isSerial() {
			return this.episode.relationships && !!this.episode.relationships.serial.data
		},
		serialFiltered() {
			const filtered =  this.serial.filter((el) => {
				return el.id !== this.episodeId
			})
			return filtered.sort((a, b) => (a.attributes.part > b.attributes.part) ? 1 : -1)
		}
	},
	methods: {
		fetchEpisode() {
			axios.get(this.$config.apiRoot + 'episodes/' + this.episodeId)
				.then(response => {
					this.episode = response.data
					if (response.data.relationships.serial.data) this.fetchSerial()
				})
				.catch(error => {
					console.log(error)
			})
		},
		fetchSerial() {
			axios.get(this.$config.apiRoot + 'serials/' + this.episode.relationships.serial.data.id)
				.then(response => {
					this.serial = response.data['data']
				})
				.catch(error => {
					console.log(error)
			})
		},
		play() {
			this.$store.commit('player/addMediaToPlayer', { data: this.episode, playNow: true})
			this.$store.commit('player/setPlayerState', 'reset-play')
		},
		addToQueue() {
			this.$store.commit('player/addMediaToPlayer', { data: this.episode })
		}
	},
	created() {
		this.fetchEpisode()
	},
	beforeUpdate() {
		// this.fetchEpisode()
	}
}
</script>

<style lang="scss" scoped>
.cover {
	margin-top: rem(20px);
	margin-bottom: rem(30px);
	display: flex;
	@include mobileSize {
		display: block;
	}
	.artwork {
		width: 45%;
		height: 100%;
		border-radius: 6px;
		margin-right: rem(25px);
		object-fit: cover;
		@include mobileSize {
			width: 100%;
			height: auto;
			margin: 0;
		}
	}
	.detail {
		display: flex;
		flex-direction: column;
		justify-content: center;
		h2 {
			@include mobileSize {
				order: 1;
				margin: rem(5px) 0;
			}
		}
		p {
			@include mobileSize {
				order: 2;
			}
		}
		.meta {
			margin-top: rem(5px);
			@include mobileSize {
				order: 3;
			}
		}
		.icon {
			position: relative;
			top: 2px;
			margin-right: rem(5px);
		}
		.buttons {
			display: flex;
			flex-wrap: wrap;
			max-width: rem(450px);
			@include mobileSize {
				order: 3;
			}
			.btn {
				flex-grow: 1;
				margin-top: rem(20px);
				margin-right: rem(15px);
			}
		}
	}
}
.description {
	width: 75%;
	margin-bottom: rem(30px);
	@include mobileSize {
		width: 100%;
	}
}
</style>
