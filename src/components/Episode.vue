<template>
	<router-link class="episodes__item" :to="{ name: linkRouteName, params: {'id': episode.id} }">
		<div class="artwork">
			<img :src="artworkUrl" :altsrc="artworkUrlAlt" :srcdetail="artworkUrlDetail" :srcfallback="artwork" 
				onerror="if (this.src==this.attributes.srcdetail.value) {this.onerror=null; this.src=this.attributes.srcfallback.value} else if (this.src==this.attributes.altsrc.value) {this.src=this.attributes.srcdetail.value} else {this.src=this.attributes.altsrc.value}"
			>
		</div>
		<div class="text">
			<h4>{{ title }}</h4>
			<span class="subtitle" v-if="displaySubtitle">{{ episode.attributes.mirroredShow.title }}</span>
			<span class="subtitle" v-if="displayDescription">{{ this.episode.attributes.description | __sanitizeText }}</span>
		</div>
	</router-link>
</template>

<script>
import { __sanitizeText, __getFullTitle } from '@/lib/helpers'

export default {
	name: 'Episode',
	props: {
		episode: Object,
		displaySubtitle: Boolean,
		displayDescription: Boolean,
		isSerial: Boolean
	},
	filters: {
		__sanitizeText
	},
	computed: {
		artwork() {
			return this.episode.attributes.asset && this.episode.attributes.asset.url || ''
		},
		artworkFilename() {
			return this.artwork.split('/').pop()
		},
		artworkUrl() {
			return this.$config.artworkTeaserBase + this.artworkFilename
		},
		artworkUrlAlt() {
			return this.$config.artworkTeaserBaseAlt + this.artworkFilename
		},
		artworkUrlDetail() {
			return this.$config.artworkDetailBase + this.artworkFilename
		},
		title() {
			return __getFullTitle(this.episode)
		},
		linkRouteName() {
			return this.isSerial ? "Serial" : 'Episodes'
		}
	},
	methods: {
		onImgLoad() {
			console.log("loaded")
		}
	}
}
</script>

<style lang="scss">
.episodes__item {
	width: 47%;
	min-width: 200px;
	margin-top: rem(25px);
	@include mobileSize {
		display: flex;
		align-items: flex-start;
		width: 100%;
		margin-top: rem(15px);
	}
	.artwork {
		position: relative;
		width: 100%;
		padding-bottom: 63%;
		border-radius: 6px;
		overflow: hidden;
		transform: translate3d(0,0,0); // Safari fix
		@include mobileSize {
			width: 25%;
			min-width: 25%;
			max-width: rem(100px);
			padding-bottom: 20%;
			margin-right: rem(15px);
		}
		img {
			position: absolute;
			width: 100%;
			height: 100%;
			object-fit: cover;
			transition: transform 300ms ease;
		}
	}
	h4 {
		margin-bottom: rem(5px);
		@include mobileSize {
			margin-top: 0;
		}
	}
	.subtitle {
		font-size: rem(14px);
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}

	&:hover {
		img {
			transform: scale(1.1);
		}
	}
	@media screen and (min-width: 920px) {
		width: 31%;
	}
	@media screen and (min-width: 1280px) {
		width: 23%;
	}
}
div.episodes__item {
	margin-top: 0;
	@include mobileSize {
		display: none;
	}
}
</style>
