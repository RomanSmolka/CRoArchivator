import Vue from 'vue'

export const clickOutside = Vue.directive('click-outside', {
	bind: function (el, binding) {
		el.clickOutsideEvent = function (event) {
			const elClasses = event.target.classList
			const parentElClasses = event.target.parentElement.classList
			const targetExcluded = binding.value.excludeClasses ? binding.value.excludeClasses.some(value => {
				return elClasses.contains(value) || parentElClasses.contains(value)
			}) : false

			if (!targetExcluded && !(el == event.target || el.contains(event.target))) {
				binding.value.callback(event)
			}
		}
	document.body.addEventListener('click', el.clickOutsideEvent)
	},
	unbind: function (el) {
		document.body.removeEventListener('click', el.clickOutsideEvent)
	}
})