<template>
	<div class="home">
		<h2 class="section-title">Naposledy přidané</h2>
		<div class="latest episodes">
			<Episode v-for="episode in this.$store.state.media.latest" :key="episode.id" :episode="episode" :displaySubtitle="true"/>
			<div class="episodes__item"></div>
			<div class="episodes__item"></div>
			<div class="episodes__item"></div>
		</div>
	</div>
</template>

<script>
import Episode from '@/components/Episode'

export default {
	name: 'Home',
	components: {
		Episode
	},
	created () {
		this.fetchLatest()
	},
	methods: {
		fetchLatest () {
			this.$store.dispatch('media/fetchLatest')
		}
	}
}
</script>
