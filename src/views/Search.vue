<template>
	<div class="home">
		<h2 class="section-title">Vyhledávání "{{ this.searchString }}"</h2>
		<div v-if="serials.length > 0">
			<h3 class="section-title">Seriály</h3>
			<div class="episodes">
				<Episode v-for="serial in serials" :key="serial.id" :episode="serial" displayDescription isSerial/>
				<div class="episodes__item"></div>
				<div class="episodes__item"></div>
				<div class="episodes__item"></div>
			</div>
		</div>
		<h3 v-if="episodes.length > 0 && serials.length > 0" class="section-title">Epizody</h3>
		<div class="episodes">
			<Episode v-for="episode in episodes" :key="episode.id" :episode="episode" :displaySubtitle="true"/>
			<div class="episodes__item"></div>
			<div class="episodes__item"></div>
			<div class="episodes__item"></div>
		</div>
	</div>
</template>

<script>
import Episode from '@/components/Episode'
import axios from 'axios'

export default {
	name: 'Search',
	components: {
		Episode
	},
	data() {
		return {
			serials: {},
			episodes: {}
		}
	},
	computed: {
		searchString() {
			return this.$route.query.string
		}
	},
	methods: {
		fetchEpisodes() {
			axios.get(this.$config.apiRoot + 'search/' + this.searchString)
				.then(response => {
					this.serials = response.data['serials']
					this.episodes = response.data['episodes']
				})
				.catch(error => {
					console.log(error)
			})
		}
	},
	watch: {
		searchString() {
			this.fetchEpisodes()
		},
	},
	created() {
		this.fetchEpisodes()
	}
}
</script>
