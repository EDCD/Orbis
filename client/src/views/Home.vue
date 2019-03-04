<template>
	<v-container grid-list-md text-xs-center>
		<v-layout row wrap>
			<v-flex xs12><h1>Featured builds</h1></v-flex>
			<v-flex xs4>
				<v-item-group
					class="shrink mr-4"
					v-model="featuredWindow"
					mandatory
					tag="v-flex"
				>
					<v-item light v-for="n in featured.length" :key="n">
						<div slot-scope="{ active, toggle }">
							<v-btn
								flat
								outline
								color="white"
								:input-value="active"
								icon
								@click="toggle"
							>
								<v-icon>mdi-record</v-icon>
							</v-btn>
						</div>
					</v-item>
				</v-item-group>
			</v-flex>
			<v-flex sm4>
				<v-window dense v-model="featuredWindow" vertical>
					<v-window-item v-for="(ship, i) in featured" :key="i">
						<ship-card
							:description="ship.description"
							:username="ship.User.nickname"
							:coriolis-link="ship.url"
							:shipImage="ship.Ship.toLowerCase()"
							:title="ship.title"
							:id="ship.shortid"
							:db-id="ship.id"
							:likes="ship.likes"
						></ship-card>
					</v-window-item>
				</v-window>
			</v-flex>
		</v-layout>
		<v-flex
			xs12
			lg4
			xl4
			sm6
			md6
			v-if="builds && builds.length === 0 && !loading"
		>
			No results. Please try widening your search.
		</v-flex>
		<hr />
		<search
			v-show="builds"
			:loading="loading"
			@searchUpdate="search"
		></search>
		<v-pagination
			v-show="builds"
			v-model="page"
			:length="pages"
			@input="paginate"
			:total-visible="7"
		></v-pagination>
		<v-layout row justify-center wrap>
			<v-flex :key="ship.id" xs12 lg4 xl4 sm6 md6 v-for="ship in builds">
				<ship-card
					:description="ship.description"
					:username="ship.User.nickname"
					:coriolis-link="ship.url"
					:forge-ship="ship.forgeShip"
					:shipImage="ship.Ship"
					:title="ship.title"
					:id="ship.shortid"
					:db-id="ship.id"
					:likes="ship.likes"
				></ship-card>
			</v-flex>
			<v-flex
				xs12
				lg4
				xl4
				sm6
				md6
				v-if="builds && builds.length === 0 && !loading"
			>
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
	components: { Search, ShipCard },
	data: () => {
		return {
			alert: true,
			page: 1,
			pageSize: 9,
			featuredWindow: 0,
			searchData: {},
			loading: true
		};
	},
	computed: {
		builds() {
			return this.$store.state.Common.builds.rows;
		},
		featured() {
			return this.$store.state.Common.featuredBuilds;
		},
		loggedIn() {
			return (
				Boolean(this.$store.state.Common.user) &&
				!_.isEmpty(this.$store.state.Common.user)
			);
		},
		pages() {
			if (!this.$store.state.Common.builds.count) {
				return 1;
			}
			return Math.ceil(
				this.$store.state.Common.builds.count / this.pageSize
			);
		},
		offset() {
			return (this.page - 1) * this.pageSize + 1;
		}
	},
	methods: {
		async search(search) {
			this.loading = true;
			this.searchData = search;

			await this.$store.dispatch(
				'getBuilds',
				Object.assign({}, search, {
					pageSize: this.pageSize,
					offset: 0
				})
			);
			this.loading = false;
		},
		async paginate() {
			this.scrollToTop();
			this.loading = true;
			await this.$store.dispatch(
				'getBuilds',
				Object.assign({}, this.searchData, {
					pageSize: this.pageSize,
					offset: this.offset
				})
			);
			const buildIds = [];
			this.builds.forEach(e => buildIds.push(e.id));
			await this.$store.dispatch('getVote', buildIds);
			this.loading = false;
		},
		scrollToTop() {
			window.scrollTo(0, 0);
		}
	},
	async mounted() {
		await this.$store.dispatch('getBuilds', {
			pageSize: this.pageSize,
			offset: 0
		});
		await this.$store.dispatch('getFeaturedBuilds');
		this.loading = false;
		const buildIds = [];
		this.builds.forEach(e => buildIds.push(e.id));
		await this.$store.dispatch('getVote', buildIds);
	}
};
</script>
