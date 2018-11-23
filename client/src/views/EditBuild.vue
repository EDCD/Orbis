<template>
	<v-container grid-list-md text-xs-center>
		<v-layout row justify-space-around wrap="">
			<v-flex xs12>
				<v-card color="cyan darken-2" class="white--text">
					<v-layout>
						<v-flex xs5>
							<v-img
								:lazy-src="lazyLoad(ship.proxiedImage)"
								:src="fullUrl(ship.proxiedImage)"
								height="256px"
								contain
							></v-img>
						</v-flex>
						<v-flex xs7>
							<v-card-title primary-title>
								<div>
									<div class="headline">
										{{ this.title || ship.title }}
									</div>
									<v-expansion-panel>
										<v-expansion-panel-content>
											<div slot="header">Description</div>
											<v-card>
												<v-card-text>{{
													this.description ||
														ship.description
												}}</v-card-text>
											</v-card>
										</v-expansion-panel-content>
									</v-expansion-panel>
								</div>
							</v-card-title>
						</v-flex>
					</v-layout>
				</v-card>
			</v-flex>
			<v-flex>
				<v-form ref="form" v-model="valid" lazy-validation>
					<v-text-field
						v-model="title"
						:disabled="disabled"
						label="Build Title"
					></v-text-field>
					<v-text-field
						v-model="imageURL"
						:disabled="disabled"
						label="Build image (Direct image URL)"
					></v-text-field>
					<v-select
						:items="privacyItems"
						v-model="privacy"
						:disabled="disabled"
						label="Build privacy"
					></v-select>
					<v-select
						:items="categoryItems"
						v-model="category"
						:disabled="disabled"
						label="Build category"
					></v-select>
					<v-autocomplete
						v-model="model"
						:disabled="disabled || sharedWithDisabled"
						clearable
						chips
						deletable-chips
						multiple
						:items="items"
						:loading="isLoading"
						:search-input.sync="search"
						color="white"
						hide-no-data
						hide-selected
						item-text="username"
						item-value="id"
						label="Shared with (usernames)"
						placeholder="Start typing to Search"
						return-object
					></v-autocomplete>
					<v-textarea
						v-model="description"
						:disabled="disabled"
						label="Build description"
					></v-textarea>
					<v-btn
						:loading="loading"
						:disabled="!valid || disabled"
						@click="submit"
						>{{ submitOrClose }}</v-btn
					>
					<v-btn @click="clear">clear</v-btn>
					<v-btn
						:loading="loading"
						:disabled="disabled"
						@click="deleteBuild"
						>delete</v-btn
					>
				</v-form>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import { getLanguage } from '../i18n/Language';
import { Modules } from 'coriolis-data/dist/index';
import router from '../router';

const lang = getLanguage();
export default {
	name: 'EditBuild',
	components: {},
	data: () => {
		return {
			formats: lang.formats,
			units: lang.units,
			translate: lang.translate,
			valid: true,
			disabled: true,
			loading: false,
			imageURL: '',
			privacyItems: ['public', 'owner', 'shared'],
			categoryItems: [
				'Combat',
				'Mining',
				'Trading',
				'Exploration',
				'Smuggling',
				'Passenger Liner',
				'PvP'
			],
			category: '',
			updated: false,
			description: '',
			sharedAccounts: [],
			privacy: '',
			entries: [],
			isLoading: false,
			model: [],
			fetched: false,
			search: null,
			title: ''
		};
	},
	methods: {
		lazyLoad(url) {
			if (!url) {
				return url;
			}
			return `${url.replace('{{WIDTH}}', '10')}&height=10`;
		},
		fullUrl(url) {
			if (!url) {
				return url;
			}
			return `${url.replace('{{WIDTH}}', '1280')}&height=720`;
		},

		async deleteBuild() {
			this.loading = true;
			try {
				await this.$axios.delete(
					`/api/builds/${this.ship.id}`,
					{},
					{
						withCredentials: true
					}
				);
			} catch (e) {
				console.error(e);
			}

			this.loading = false;
			return router.push('/');
		},

		async submit() {
			if (this.submitOrClose === 'Close') {
				return window.history.length > 1
					? this.$router.go(-1)
					: this.$router.push('/');
			}
			if (this.$refs.form.validate()) {
				// Native form submission is not yet supported
				this.loading = true;
				try {
					await this.$axios.post(
						'/api/builds/update',
						{
							updates: this.updates,
							id: this.ship.id
						},
						{
							withCredentials: true
						}
					);
				} catch (e) {
					console.error(e);
				} finally {
					await this.$store.dispatch(
						'getBuild',
						this.$route.params.id
					);
				}

				this.loading = false;
				this.updated = true;
			}
		},
		clear() {
			this.$refs.form.reset();
		}
	},
	watch: {
		search(val) {
			// Items have already been loaded
			if (this.items.length > 0 && this.fetched) return;

			// Items have already been requested
			if (this.isLoading) return;

			this.isLoading = true;

			// Lazily load input items
			this.axios
				.get('/api/users/list')
				.then(res => {
					const { count, rows } = res.data;
					this.count = count;
					this.entries = rows;
				})
				.catch(err => {
					console.log(err);
				})
				.finally(() => {
					this.isLoading = false;
					this.fetched = true;
				});
		}
	},
	computed: {
		fields() {
			if (!this.model) return [];

			return Object.keys(this.model).map(key => {
				return {
					key,
					value: this.model[key]
				};
			});
		},
		sharedWithDisabled() {
			return this.privacy !== 'shared';
		},
		items() {
			return this.entries.map(entry => {
				return Object.assign({}, entry);
			});
		},
		ship() {
			return this.$store.state.Build.build;
		},

		ids() {
			let ids = [];
			for (const i of this.fields) {
				ids.push(i.value.id);
			}
			return ids;
		},

		usernames() {
			let usernames = [];
			for (const i of this.fields) {
				usernames.push(i.value.username);
			}
			return usernames;
		},

		updates() {
			const updates = {};
			if (this.title && this.title !== this.ship.title) {
				updates.title = this.title;
			}
			if (this.imageURL && this.imageURL !== this.ship.imageURL) {
				updates.imageURL = this.imageURL;
			}
			if (
				this.description &&
				this.description !== this.ship.description
			) {
				updates.description = this.description;
			}
			if (this.privacy && this.privacy !== this.ship.privacy) {
				updates.privacy = this.privacy;
			}
			if (this.ids && this.ids !== this.ship.sharedAccounts) {
				updates.sharedAccounts = this.ids;
			}
			if (this.category && this.category !== this.ship.category) {
				updates.category = this.category;
			}
			if (
				this.usernames &&
				this.usernames !== this.usernames.sharedAccountUsernames
			) {
				updates.sharedAccountUsernames = this.usernames;
			}

			return updates;
		},
		submitOrClose() {
			if (this.updated) {
				return 'Close';
			}
			if (Object.keys(this.updates).length === 0) {
				return 'Close';
			}
			return 'Submit';
		}
	},
	async mounted() {
		await this.$store.dispatch('getBuild', this.$route.params.id);
		this.imageURL = this.ship.imageURL;
		this.description = this.ship.description;
		this.title = this.ship.title;
		this.sharedAccounts = this.ship.sharedAccountUsernames;
		this.category = this.ship.category;
		for (const id in this.ship.sharedAccounts) {
			this.entries.push({
				id: this.ship.sharedAccounts[id],
				username: this.ship.sharedAccountUsernames[id]
			});
			this.model.push({
				id: this.ship.sharedAccounts[id],
				username: this.ship.sharedAccountUsernames[id]
			});
		}
		this.privacy = this.ship.privacy;
		this.title = this.ship.title;
		this.disabled = false;
	}
};
</script>
