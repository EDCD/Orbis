<template>
	<v-container grid-list-md text-xs-center>
		<search v-show="builds" :loading="loading" @searchUpdate="search"></search>
		<v-layout row justify-space-around wrap>
			<v-flex :key="ship.id" x12 sm4 v-for="ship in builds">
				<ship-card :description="ship.description" :username="ship.username" :coriolis-link="ship.url"
									 :imageURL="ship.proxiedImage"
									 :title="ship.title" :id="ship.shortid" :db-id="ship.id" :likes="ship.likes"></ship-card>
			</v-flex>
		</v-layout>
		<v-pagination
			v-show="builds"
			v-model="page"
			:length="pages"
			@input="paginate"
			:total-visible="7"
		></v-pagination>
	</v-container>
</template>

<script>
	import ShipCard from '../components/ShipCard';
	import Search from '../components/Search';

	export default {
		components: {Search, ShipCard},
		data: () => {
			return {
				alert: true,
				page: 1,
				pageSize: 10,
				searchData: {},
				loading: false
			};
		},
		computed: {
			builds() {
				return this.$store.state.Common.builds.rows;
			},
			pages() {
				if (!this.$store.state.Common.builds.count) {
					return 1;
				}
				return Math.ceil(this.$store.state.Common.builds.count / this.pageSize);
			},
			offset() {
				return Math.ceil(this.page * this.pageSize);
			}
		},
		methods: {
			async search(search) {
				this.loading = true;
				this.searchData = search;

				await this.$store.dispatch('getBuilds', Object.assign({}, search, {pageSize: this.pageSize, offset: 0}));
				this.loading = false;
			},
			async paginate() {
				await this.$store.dispatch('getBuilds', Object.assign({}, this.searchData, {
					pageSize: this.pageSize,
					offset: this.offset
				}));
			}
		},
		async mounted() {
			await this.$store.dispatch('getBuilds', {pageSize: this.pageSize, offset: 0});
		}
	};
</script>
