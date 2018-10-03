<template>
	<v-container grid-list-md text-xs-center>
		<v-layout row justify-space-around wrap>
			<v-flex :key="ship.id" x12 sm4 v-for="ship in builds">
				<ship-card :description="ship.description" :coriolis-link="ship.url" :imageURL="ship.proxiedImage"
									 :title="ship.title" :id="ship.shortid" :db-id="ship.id" :likes="ship.likes"></ship-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	import ShipCard from '../components/ShipCard';

	export default {
		components: {ShipCard},
		data: () => {
			return {
				alert: true
			};
		},
		computed: {
			builds() {
				return this.$store.state.Common.builds.rows;
			}
		},
		mounted() {
			this.$store.dispatch('getBuilds', {pageSize: 12, offset: 0});
		}
	};
</script>
