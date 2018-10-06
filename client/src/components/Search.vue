<template>
	<v-container fluid grid-list-xl>
		<v-layout align-center justify-center row fill-height>
			<v-flex xs12 sm6>
				<v-text-field v-model="value" @keyup.enter="$emit('searchUpdate', search)" label="Search query"></v-text-field>
				<v-spacer></v-spacer>
				<v-select
					:items="keys"
					v-model="key"
					label="Search for"
				></v-select>
				<v-btn :loading="loading" @click="$emit('searchUpdate', search)">Search</v-btn>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	export default {
		name: 'Search',
		data() {
			return {
				keys: ['Title', 'Description'],
				key: 'Title',
				value: ''
			};
		},
		computed: {
			search() {
				return {key: this.key.toLowerCase(), value: this.value.toLowerCase()};
			}
		},
		props: {
			loading: Boolean
		},
		methods: {}
	};
</script>

<style scoped>

</style>
