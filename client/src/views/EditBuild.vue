<template>
	<v-container grid-list-md text-xs-center>
		<v-layout row justify-space-around wrap>
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
									<div class="headline">{{this.title || ship.title}}</div>
									<v-expansion-panel>
										<v-expansion-panel-content
										>
											<div slot="header">Description</div>
											<v-card>
												<v-card-text>{{this.description || ship.description}}</v-card-text>
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
					<v-textarea
						v-model="description"
						:disabled="disabled"
						label="Build description"
					></v-textarea>
					<v-btn
						:disabled="!valid || disabled"
						@click="submit"
					>
						submit
					</v-btn>
					<v-btn @click="clear">clear</v-btn>
				</v-form>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	import {getLanguage} from '../i18n/Language';
	import {Modules} from 'coriolis-data/dist/index';

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
				imageURL: '',
				description: '',
				title: ''
			};
		},
		methods: {
			lazyLoad(url) {
				if (!url) {
					return url;
				}
				return url.replace('{OPTIONS}', '10x');
			},
			fullUrl(url) {
				if (!url) {
					return url;
				}
				return url.replace('{OPTIONS}', '1280x');
			},

			submit() {
				if (this.$refs.form.validate()) {
					// Native form submission is not yet supported
					this.$axios.post('/api/builds/update', {
						updates: this.updates
					});
				}
			},
			clear() {
				this.$refs.form.reset();
			}
		},
		computed: {
			ship() {
				return this.$store.state.Build.build;
			},

			updates() {
				const updates = {};
				if (this.title) {
					updates.title = this.title;
				}
				if (this.imageURL) {
					updates.imageURL = this.imageURL;
				}
				if (this.description) {
					updates.description = this.description;
				}
				return updates;
			}
		},
		async mounted() {
			await this.$store.dispatch('getBuild', this.$route.params.id);
			this.imageURL = this.ship.imageURL;
			this.description = this.ship.description;
			this.title = this.ship.title;
			this.disabled = false;
		}
	};
</script>
