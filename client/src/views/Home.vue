<template>
	<v-container grid-list-md text-xs-center>
		<search v-show="builds" :loading="loading" @searchUpdate="search"></search>
		<v-pagination
			v-show="builds"
			v-model="page"
			:length="pages"
			@input="paginate"
			:total-visible="7"
		></v-pagination>
		<v-layout row justify-center wrap>
			<v-flex :key="ship.id" xs12 lg4 xl4 sm6 md6 v-for="ship in builds">
				<ship-card :description="ship.description" :username="ship.username" :coriolis-link="ship.url"
									 :imageURL="ship.proxiedImage"
									 :title="ship.title" :id="ship.shortid" :db-id="ship.id" :likes="ship.likes"></ship-card>
			</v-flex>
      <v-flex xs12 lg4 xl4 sm6 md6 v-if="builds.length === 0 && !loading">
        No results. Please try widening your search.
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
				pageSize: 9,
				searchData: {},
				loading: true
			};
		},
		computed: {
			builds() {
				return this.$store.state.Common.builds.rows;
			},
			loggedIn() {
				return Boolean(this.$store.state.Common.user) && !_.isEmpty(this.$store.state.Common.user);
			},
			pages() {
				if (!this.$store.state.Common.builds.count) {
					return 1;
				}
				return Math.ceil(this.$store.state.Common.builds.count / this.pageSize);
			},
			offset() {
				return (this.page - 1) * this.pageSize + 1;
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
				this.scrollToTop();
        this.loading = true;
				await this.$store.dispatch('getBuilds', Object.assign({}, this.searchData, {
					pageSize: this.pageSize,
					offset: this.offset
				}));
				const buildIds = [];
				this.builds.forEach(e => buildIds.push(e.id));
				await this.$store.dispatch('getVote', buildIds);
				this.loading = false;
			},
			scrollToTop() {
				window.scrollTo(0,0);
			}
		},
		async mounted() {
			await this.$store.dispatch('getBuilds', {pageSize: this.pageSize, offset: 0});
			this.loading = false;
			const buildIds = [];
			this.builds.forEach(e => buildIds.push(e.id));
			await this.$store.dispatch('getVote', buildIds);
		}
	};
</script>
