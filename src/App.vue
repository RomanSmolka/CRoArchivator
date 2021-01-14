<template>
	<div id="app" :class="{playing: this.$store.state.player.playerMedia.length}">
		<svg class="no-display" v-html="require('./assets/icons.html')"></svg>
		<NavigationToggle/>
		<Navigation/>
		<div class="router-view" :class="{ switching: switchingRoute}">
			<transition :name="transitionName" mode="out-in">
				<router-view :key="$route.path"></router-view>
			</transition>
		</div>
		<div class="overlay" v-if="navOpen" @click="toggleNav"></div>
		<Player v-show="playerHasMedia"/>
	</div>
</template>

<script>
import Navigation from '@/components/Navigation'
import NavigationToggle from '@/components/NavigationToggle'
import Player from '@/components/Player'

export default {
	name: 'App',
	components: {
		Navigation,
		NavigationToggle,
		Player
	},
	computed: {
		playerHasMedia() {
			return this.$store.state.player.playerMedia.length
		},
		transitionName() {
			return this.$store.state.routing.routerGoingUp ? 'reverse' : 'slide'
		},
		navOpen() {
			return this.$store.state.navOpen
		},
		switchingRoute() {
			return this.$store.state.routing.switchingRoute
		}
	},
	methods: {
		toggleNav() {
			this.$store.commit('toggleNav')
		}
	}
}
</script>

<style lang="scss">
#app {
	.router-view {
		margin-left: rem(220px);
		padding: rem(20px) rem(35px);
		background-color: rgba(255, 255, 255, 0.6);
		transition: all 400ms ease;
		position: relative;
		@include mobileSize {
			margin: 0;
			padding: rem(0px) rem(20px);
			> div {
				position: absolute;
				width: calc(100% - 40px);
			}
		}
	}
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	&.playing {
		.router-view > div {
			padding-bottom: rem(100px);
			@include mobileSize {
				padding-bottom: rem(150px);
			}
		}
	}
}
.nav-open {
	.router-view {
		transform: translateX(rem(100px));
		opacity: 0.5;
		filter: blur(2px);
	}
}

@include desktopSize {
	.slide-leave-active {
		opacity: 0;
		transition: opacity 80ms linear;
	}
	.episode_detail.slide-enter {
		opacity: 0;
		transform: translateY(1%);
	}
	.episode_detail.slide-enter-to {
		opacity: 1;
		transition: opacity 100ms ease 120ms, transform 350ms ease 100ms;
	}
}

@include mobileSize {
	.slide-enter-active {
		transition: transform 800ms cubic-bezier(0.075, 0.820, 0.165, 1.000), opacity 200ms ease;
		transform: translateX(0);
		opacity: 1;
	}
	.switching .slide-enter {
		opacity: 0;
		transform: translateX(10%);
	}
	.switching > div:first-child:not(.slide-enter-active) {
		opacity: 0;
		transform: translateX(-20%);
		transition: opacity 150ms ease, transform 300ms ease-out;
	}
	
	.reverse-enter {
		opacity: 0;
	}
	.reverse-enter-active {
		transition: opacity 500ms ease;
	}
}

</style>
