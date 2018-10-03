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


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

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
			},
			user() {
				return this.$store.state.Common.user;
			}
		},
		async mounted() {
			await this.$store.dispatch('checkAuth');
			await this.$store.dispatch('getProfile', {
				pageSize: 12, offset: 0, username: this.user.username
			});
		}
	};
</script>
