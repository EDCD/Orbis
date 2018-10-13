<template>
	<v-container fluid grid-list-xl>
		<v-layout align-center justify-center column wrap fill-height>
			<v-flex xs12 sm6>
				<v-text-field v-model="searchByVal" @keyup.enter="$emit('searchUpdate', search)"
											label="Search query"></v-text-field>
				<v-spacer></v-spacer>
				<v-select
					@change="$emit('searchUpdate', search)"
					:items="searchByKeys"
					v-model="searchByKey"
					label="Search for"
				></v-select>
				<v-select
					@change="$emit('searchUpdate', search)"
					:items="sortByOrders"
					v-model="sortByOrder"
					label="Sort Order"
				></v-select>
				<v-select
					@change="$emit('searchUpdate', search)"
					:items="sortByKeys"
					v-model="sortByKey"
					label="Sort by"
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
				searchByKeys: ['Title', 'Description'],
				searchByKey: 'Title',
				searchByVal: '',
				sortByOrders: ['ASC', 'DESC'],
				sortByOrder: 'DESC',
				sortByKeys: ['createdAt', 'updatedAt', 'title'],
				sortByKey: 'createdAt'
			};
		},
		computed: {
			search() {
				return {
					order: this.sortByOrder,
					field: this.sortByKey,
					search: {key: this.searchByKey.toLowerCase(), value: this.searchByVal.toLowerCase()}
				};
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
