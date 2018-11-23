<template>
	<v-container fluid grid-list-xl>
		<v-layout align-center justify-center row wrap fill-height>
			<v-text-field
				v-model="searchByVal"
				@keyup.enter="$emit('searchUpdate', search);"
				label="Search query"
			></v-text-field>
			<v-flex xs6 sm6>
				<v-select
					@change="$emit('searchUpdate', search);"
					:items="searchByKeys"
					v-model="searchByKey"
					label="Search for"
				></v-select>
			</v-flex>
			<v-flex xs6 sm6>
				<v-select
					@change="$emit('searchUpdate', search);"
					:items="shipNames"
					v-model="shipFilter"
					label="Ship Filter"
				></v-select>
			</v-flex>
			<v-flex xs6 sm6>
				<v-select
					@change="$emit('searchUpdate', search);"
					:items="categoryNames"
					v-model="category"
					label="Category"
				></v-select>
			</v-flex>
			<v-flex xs6 sm6>
				<v-select
					@change="$emit('searchUpdate', search);"
					:items="sortByOrders"
					v-model="sortByOrder"
					label="Sort Order"
				></v-select>
			</v-flex>
			<v-flex xs6 sm6>
				<v-select
					@change="$emit('searchUpdate', search);"
					:items="sortByKeys"
					v-model="sortByKey"
					label="Sort by"
				></v-select>
			</v-flex>
			<v-btn :loading="loading" @click="$emit('searchUpdate', search);"
				>Search</v-btn
			>
		</v-layout>
	</v-container>
</template>

<script>
const sortMap = {
	Ascending: 'ASC',
	Descending: 'DESC'
};

const sortKeyMap = {
	'Created Date': 'createdAt',
	'Updated Date': 'updatedAt',
	Title: 'title'
};

const searchKeyMap = {
	Title: 'title',
	Description: 'description'
};

const shipNameMap = {
	'No Filter': '',
	Adder: 'adder',
	'Alliance Challenger': 'alliance_challenger',
	'Alliance Chieftain': 'alliance_chieftain',
	'Alliance Crusader': 'alliance_crusader',
	Anaconda: 'anaconda',
	'Asp Explorer': 'asp',
	'Asp Scout': 'asp_scout',
	Beluga: 'beluga',
	'Cobra Mk III': 'cobra_mk_iii',
	'Cobra Mk IV': 'cobra_mk_iv',
	'Diamondback Explorer': 'diamondback_explorer',
	'Diamondback Scout': 'diamondback_scout',
	Dolphin: 'dolphin',
	Eagle: 'eagle',
	'Federal Assault Ship': 'federal_assault_ship',
	'Federal Corvette': 'federal_corvette',
	'Federal Dropship': 'federal_dropship',
	'Federal Gunship': 'federal_gunship',
	'Fer De Lance': 'fer_de_lance',
	Hauler: 'hauler',
	'Imperial Clipper': 'imperial_clipper',
	'Imperial Courier': 'imperial_courier',
	'Imperial Cutter': 'imperial_cutter',
	'Imperial Eagle': 'imperial_eagle',
	Keelback: 'keelback',
	'Krait Mk II': 'krait_mkii',
	'Krait Phantom': 'krait_phantom',
	Mamba: 'mamba',
	Orca: 'orca',
	Python: 'python',
	Sidewinder: 'sidewinder',
	'Type 10 Defender': 'type_10_defender',
	'Type 6 Transporter': 'type_6_transporter',
	'Type 7 Transport': 'type_7_transport',
	'Type 9 Heavy': 'type_9_heavy',
	'Viper Mk III': 'viper',
	'Viper Mk IV': 'viper_mk_iv',
	Vulture: 'vulture'
};

export default {
	name: 'Search',
	data() {
		return {
			searchByKeys: ['Title', 'Description'],
			searchByKey: 'Title',
			shipFilter: 'No Filter',
			shipNames: Object.keys(shipNameMap),
			categoryNames: [
				'No Filter',
				'Combat',
				'Mining',
				'Trading',
				'Exploration',
				'Smuggling',
				'Passenger Liner',
				'PvP'
			],
			category: 'No Filter',
			searchByVal: '',
			sortByOrders: ['Ascending', 'Descending'],
			sortByOrder: 'Descending',
			sortByKeys: ['Created Date', 'Updated Date', 'Title'],
			sortByKey: 'Created Date'
		};
	},
	computed: {
		search() {
			return {
				ship: shipNameMap[this.shipFilter],
				category: this.category === 'No Filter' ? '' : this.category,
				order: sortMap[this.sortByOrder],
				field: sortKeyMap[this.sortByKey],
				search: {
					key: searchKeyMap[this.searchByKey],
					value: this.searchByVal.toLowerCase()
				}
			};
		}
	},
	props: {
		loading: Boolean
	},
	methods: {}
};
</script>

<style scoped></style>
