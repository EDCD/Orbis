<template>
	<v-container grid-list-md text-xs-center>
		<!--<search v-show="builds" :loading="loading" @searchUpdate="search"></search>-->
		<!--<v-layout row justify-space-around wrap>-->
			<!--<v-flex :key="ship.id" x12 sm4 v-for="ship in builds">-->
				<!--<ship-card :description="ship.description" :username="ship.username" :coriolis-link="ship.url"-->
									 <!--:imageURL="ship.proxiedImage"-->
									 <!--:title="ship.title" :id="ship.shortid" :db-id="ship.id" :likes="ship.likes"></ship-card>-->
			<!--</v-flex>-->
		<!--</v-layout>-->
		<add-announcement/>
		<!--<v-pagination-->
			<!--v-show="builds"-->
			<!--v-model="page"-->
			<!--:length="pages"-->
			<!--@input="paginate"-->
			<!--:total-visible="7"-->
		<!--&gt;</v-pagination>-->
	</v-container>
</template>

<script>
	import ShipCard from '../components/ShipCard';
	import Search from '../components/Search';
	import AddAnnouncement from '../components/AddAnnouncement';

	export default {
		components: {AddAnnouncement, Search, ShipCard},
		data: () => {
			return {
				alert: true,
				page: 1,
				pageSize: 10,
				menu: false,
				announcementPickerVisible: false,
				announcementText: '',
				date: null,
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
			async search(value) {
				this.loading = true;
				this.searchData = value;
				await this.$store.dispatch('getBuilds', {pageSize: this.pageSize, offset: 0, search: value});
				this.loading = false;
			},
			async paginate() {
				await this.$store.dispatch('getBuilds', {
					pageSize: this.pageSize,
					offset: this.offset,
					search: this.searchData
				});
			}
		},
		async mounted() {
			// await this.$store.dispatch('getBuilds', {pageSize: this.pageSize, offset: 0});
		}
	};
</script>
