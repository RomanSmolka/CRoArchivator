<template>
	<div class="nav-toggle" @click="toggleNav">
		<div></div>
		<div></div>
		<div></div>
	</div>
</template>

<script>
export default {
	name: 'NavigationToggle',
	methods: {
		toggleNav() {
			this.$store.commit('toggleNav')
		}
	}
}
</script>

<style scoped lang="scss">
.nav-toggle {
	position: fixed;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	top: rem(10px);
	right: rem(10px);
	width: 42px;
	height: 37px;
	background-color: rgba(255, 255, 255, 0.5);
	backdrop-filter: blur(15px);
	border-radius: 3px;
	z-index: 200;
	cursor: pointer;
	@include desktopSize {
		display: none;
	}

	div {
		background: $clrBody;
		height: 3px;
		width: 70%;
		border-radius: 2px;
		transition: all 250ms ease;
		&:nth-child(2) {
			margin: 5px 0;
		}
	}
}
.nav-open .nav-toggle {
	div:first-child {
		transform: rotate(30deg) translate(7px, 5px);
		transform-origin: center right;
		width: 45%;
	}
	div:last-child {
		transform: rotate(-30deg) translate(7px, -5px);
		transform-origin: center right;
		width: 45%;
	}
}
</style>
