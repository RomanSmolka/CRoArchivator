<template>
	<div class="show">
		<h2 class="section-title sticky"><span>{{ showTitle }}</span></h2>
		<div v-if="serials.length > 0">
			<div class="section-header">
				<h3 class="section-title">Seriály ({{ serials.length }})</h3>
				<v-select 
					:options="sortingOptions" 
					:clearable="false"
					:searchable="false"
					:filterable="false"
					v-model="serialsSorting" 
					class="sort"
				/>
			</div>
			<div class="episodes">
				<Episode v-for="serial in serials" :key="serial.id" :episode="serial" displayDescription isSerial/>
				<div class="episodes__item"></div>
				<div class="episodes__item"></div>
				<div class="episodes__item"></div>
			</div>
		</div>
		<div v-if="episodes.length > 0" class="section-header">
			<h3 class="section-title">Samostatné epizody ({{ episodes.length }})</h3>
			<v-select 
				:options="sortingOptions" 
				:clearable="false"
				:searchable="false"
				v-model="episodesSorting" 
				class="sort"
			/>
		</div>
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
	data() {
		return {
			sortingOptions: [
				{ code: 'latest', label: 'Nejnovější' },
				{ code: 'oldest', label: 'Nejstarší' }
			],
			serialsSorting: { code: 'latest', label: 'Nejnovější' },
			episodesSorting: { code: 'latest', label: 'Nejnovější' }
		}
	},
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
			const data = this.$store.state.media.serials[this.showId] || ''
			if (data) {
				return this.sort(data, this.serialsSorting.code)
			}
			return ''
		},
		episodes() {
			const data = this.$store.state.media.episodes[this.showId] || ''
			if (data) {
				return this.sort(data, this.episodesSorting.code)
			}
			return ''
		}
	},
	watch: {
		showId() {
			this.fetchEpisodes()
		}
	},
	methods: {
		sort(data, sorting) {
			return [...data].sort((a, b) => {
				const dateA = new Date(a.attributes.updated), dateB = new Date(b.attributes.updated)
				switch(sorting) {
					case 'latest':
						return dateA > dateB ? -1 : 1
					case 'oldest':
						return dateA > dateB ? 1 : -1
				}
			})
		},
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

<style lang="scss" scoped>
.section-header {
	display: flex;
	justify-content: space-between;
	.v-select {
		margin-top: 1.25rem;
	}
}
</style>
