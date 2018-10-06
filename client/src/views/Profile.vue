<template>
	<v-container grid-list-md text-xs-center>
		<search :loading="loading" @searchUpdate="search"></search>
		<v-layout row justify-space-around wrap>
			<v-flex :key="ship.id" x12 sm4 v-for="ship in builds">
				<ship-card :description="ship.description" :username="ship.username" :coriolis-link="ship.url"
									 :imageURL="ship.proxiedImage"
									 :title="ship.title" :id="ship.shortid"
									 :db-id="ship.id" :likes="ship.likes"></ship-card>
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
				loading: false,
				page: 1,
				pageSize: 10,
				searchData: {}
			};
		},
		computed: {
			builds() {
				return this.$store.state.Common.builds.rows;
			},
			user() {
				return this.$store.state.Common.user;
			},
			pages() {
				if (!this.$store.state.Common.builds.count) {
					return 1;
				}
				return Math.ceil(this.$store.state.Common.builds.count / this.pageSize);
			},
			offset() {
				if (this.page === 1) {
					return 0;
				}
				return Math.ceil(this.page * this.pageSize);
			}
		},
		methods: {
			async search(value) {
				this.loading = true;
				this.searchData = value;
				await this.$store.dispatch('getProfile', {
					pageSize: this.pageSize,
					offset: this.offset,
					search: value,
					username: this.user.username
				});
				this.loading = false;
			},
			async paginate() {
				await this.$store.dispatch('getProfile', {
					pageSize: this.pageSize,
					offset: this.offset,
					search: this.searchData,
					username: this.$route.params.username
				});
			}
		},
		async mounted() {
			await this.$store.dispatch('getProfile', {
				pageSize: this.pageSize, offset: this.offset, username: this.$route.params.username
			});
		}
	};
</script>
