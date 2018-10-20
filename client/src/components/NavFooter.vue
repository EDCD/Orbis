<template>
	<v-footer height="auto" :fixed="fixed" color="primary lighten-1" app>
		<v-layout
			justify-center
			row
			wrap
		>
			<v-flex
				primary
				lighten-2
				py-3
				text-xs-center
				white--text
				xs12
			>
				&copy; {{new Date().getFullYear()}} <strong>EDCD</strong>
				<v-btn v-if="admin" to="/admin">Admin</v-btn>
				<v-btn to="/about">About</v-btn>
				<v-btn to="/contact">Contact</v-btn>
			</v-flex>

		</v-layout>
	</v-footer>
</template>
<script>
	export default {
		name: 'NavFooter',
		props: {
			admin: {},
			fixed: {}
		}
	};
</script>
