<template>
	<div class="nav">
		<div class="nav__border"></div>
		<div class="nav__content">
			<input v-model="searchString" @keyup.enter="search" type="text" placeholder="Vyhledávání">
			<ul>
				<li><router-link :to="{name: 'Home'}" @click.native="toggleNav">Naposledy přidané</router-link></li>
			</ul>
			<h3>Pořady</h3>
			<ul class="nav__show-listing" :class="this.$store.state.player.playerMedia.length ? 'bottom-space' : ''">
				<li v-for="(show) in other" :key="show.id">
					<router-link class="nav__show-link" :to="{name: 'Show', params: {'id': show.id}}" @click.native="toggleNav">{{ show.title }}</router-link>
				</li>
				<li><h4>Hry</h4></li>
				<li v-for="(show) in plays" :key="show.id">
					<router-link class="nav__show-link" :to="{name: 'Show', params: {'id': show.id}}" @click.native="toggleNav">{{ show.title }}</router-link>
				</li>
				<li><h4>Četba</h4></li>
				<li v-for="(show) in audiobooks" :key="show.id">
					<router-link class="nav__show-link" :to="{name: 'Show', params: {'id': show.id}}" @click.native="toggleNav">{{ show.title }}</router-link>
				</li>
				<li><h4>Pohádky</h4></li>
				<li v-for="(show) in kids" :key="show.id">
					<router-link class="nav__show-link" :to="{name: 'Show', params: {'id': show.id}}" @click.native="toggleNav">{{ show.title }}</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Navigation',
	data() {
		return {
			searchString: ''
		}
	},
	computed: {
		shows() {
			return this.$store.state.media.shows
		},
		plays() {
			return this.shows.filter(show => show.type === 'hra')
		},
		audiobooks() {
			return this.shows.filter(show => show.type === 'cetba')
		},
		kids() {
			return this.shows.filter(show => show.type === 'deti')
		},
		other() {
			return this.shows.filter(show => show.type === '')
		}
	},
	methods: {
		fetchShows() {
			this.$store.dispatch('media/fetchShows')
		},
		toggleNav() {
			if (this.$store.state.navOpen) this.$store.commit('toggleNav')
		},
		search() {
			if (this.searchString.length > 2) {
				this.toggleNav()
				this.$router.push({ name: 'Search', query: { string: this.searchString } })
				this.searchString = ''
			}
		}
	},
	created () {
		this.fetchShows()
	}
}
</script>

<style scoped lang="scss">
.nav {
	position: fixed;
	left: 0;
	top: 0;
	transition: all 400ms ease;
	z-index: 100;
	@include mobileSize {
		transform: translateX(-120%)
	}

	&__content {
		width: rem(220px);
		height: 100vh;
		overflow-y: scroll;
		background-color: $clrBgGrey;
		clip-path: inset(0px 15px 0px 0px);
		@include mobileSize {
			width: rem(280px);
		}
	}
	&__border {
		content: "";
		height: 120vh;
		width: 30px;
		position: absolute;
		right: 0;
		box-shadow: 0 0 8px #ccc;
		top: 0;
		border-radius: 0 0 100%;
		background-color: $clrBgGrey;
		clip-path: inset(0px -10px 0px 0px);
	}
	input {
		margin-top: rem(15px);
		font-size: rem(12px);
		@include mobileSize {
			font-size: rem(14px);
		}
	}
	h3 {
		position: sticky;
		top: 0;
		padding: rem(10px) rem(20px) rem(5px) rem(20px);
		border-bottom: 1px solid $clrSeparator;
		z-index: 1;
		backdrop-filter: blur(15px);
	}
	h4 {
		margin: 0;
		padding: rem(5px) 0 rem(5px) rem(20px);
		text-transform: uppercase;
		font-size: rem(14px);
		font-weight: 700;
	}
	ul {
		padding-top: rem(10px);
		&.nav__show-listing {
			padding-bottom: rem(20px);
			@include mobileSize {
				padding-bottom: rem(100px);
			}
			&.bottom-space {
				padding-bottom: rem(80px);
				@include mobileSize {
					padding-bottom: rem(250px);
				}
			}
		}
		li {
			a {
				display: inline-block;
				position: relative;
				padding: rem(5px) 0 rem(5px) rem(20px);
				width: calc(100% - 20px);
				text-decoration: none;
				font-size: rem(14px);
				@include mobileSize {
					font-size: rem(16px);
				}
				&:hover {
					color: $clrHighlight;
				}
				&.router-link-active {
					&.nav__show-link, &.router-link-exact-active {
						color: $clrHighlight;
						font-weight: 700;
						background-image: linear-gradient(270deg, rgba(255,111,111,0) 61%, rgba(255,55,60,0.09) 100%);
						&::before {
							content: "";
							position: absolute;
							width: 2px;
							height: 100%;
							left: 0;
							top: 0;
							background-color: $clrHighlight;
						}
					}
				}
			}
		}
	}
}
.nav-open .nav {
	transform: none;
}
</style>
