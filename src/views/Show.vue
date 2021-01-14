<template>
	<div class="show">
		<h2 class="section-title sticky"><span>{{ showTitle }}</span></h2>
		<div v-if="serials.length > 0">
			<h3 class="section-title">Seriály ({{ serials.length }})</h3>
			<div class="episodes">
				<Episode v-for="serial in serials" :key="serial.id" :episode="serial" displayDescription isSerial/>
				<div class="episodes__item"></div>
				<div class="episodes__item"></div>
				<div class="episodes__item"></div>
			</div>
		</div>
		<h3 v-if="episodes.length > 0" class="section-title">Samostatné epizody ({{ episodes.length }})</h3>
		<div class="episodes">
			<Episode v-for="episode in episodes" :key="episode.id" :episode="episode"/>
			<div class="episodes__item"></div>
			<div class="episodes__item"></div>
			<div class="episodes__item"></div>
		</div>
	</div>
</template>

<script>
import Episode from '@/components/Episode'

export default {
	name: 'Show',
	components: {
		Episode
	},
	computed: {
		showId() {
			return this.$route.params.id
		},
		showTitle() {
			const show = this.$store.state.media.shows.find(show => show.id === this.showId)
			return show && show.title || ''
		},
		serials() {
			return this.$store.state.media.serials[this.showId] || ''
		},
		episodes() {
			return this.$store.state.media.episodes[this.showId] || ''
		}
	},
	watch: {
		showId() {
			this.fetchEpisodes()
		}
	},
	methods: {
		fetchSerials() {
			if (!this.serials) {
				this.$store.dispatch('media/fetchSerials', { showId: this.showId })
			}
		},
		fetchEpisodes() {
			if (!this.episodes) {
				this.$store.dispatch('media/fetchEpisodes', { showId: this.showId })
			}
		}
	},
	created() {
		this.fetchSerials()
		this.fetchEpisodes()
	}
}
</script>
