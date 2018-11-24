<template>
	<v-container grid-list-md text-xs-center>
		<v-layout row justify-space-around wrap="">
			<v-snackbar v-model="snackbar" :timeout="6000" :top="true">
				{{ buildSavedText }}
				<v-btn color="pink" flat @click="snackbar = false;">
					Close
				</v-btn>
			</v-snackbar>
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
									<div class="headline">{{ ship.title }}</div>
									<div>By {{ ship.username }}</div>
									<div>
										<v-btn
											color="primary"
											target="_blank"
											rel="noopener noreferrer"
											v-if="
												ship.coriolisShip &&
													ship.coriolisShip.url
											"
											:href="ship.coriolisShip.url"
										>
											Edit build on Coriolis.io
										</v-btn>
										<v-btn
											v-if="shipCode"
											:loading="saving"
											@click="saveBuildToCoriolis"
											>Save build to Coriolis</v-btn
										>
									</div>
									<div>
										<v-btn
											color="primary"
											v-if="ship.allowedToEdit"
											:to="`/edit/${$route.params.id}`"
										>
											Edit build details
										</v-btn>
									</div>
									<v-expansion-panel>
										<v-expansion-panel-content>
											<div slot="header">Description</div>
											<v-card>
												<v-card-text>{{
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
			<v-flex v-if="ship">
				<div class="build">
					<v-container grid-list-small fluid>
						<v-layout
							v-if="ship && ship.coriolisShip && ship.coriolisShip.armour"
							row
							wrap
							justify-center
						>
							<v-flex xs4
								>Armour:
								{{
									formats.int(ship.coriolisShip.armour)
								}}</v-flex
							>
							<v-flex xs4
								>Shield:
								{{ formats.int(ship.coriolisShip.shield) }}
								{{ units.MJ }}</v-flex
							>
							<v-flex xs4
								>Top Speed:
								{{ formats.int(ship.coriolisShip.topBoost) }}
								{{ units['m/s'] }}</v-flex
							>
							<v-flex xs4>
								Hull Thermal Res:
								{{
									formats.pct1(ship.coriolisShip.hullThermRes)
								}}
							</v-flex>
							<v-flex xs4>
								Hull Explosive Res:
								{{
									formats.pct1(ship.coriolisShip.hullExplRes)
								}}
							</v-flex>
							<v-flex xs4>
								Hull Kinetic Res:
								{{ formats.pct1(ship.coriolisShip.hullKinRes) }}
							</v-flex>
							<v-flex xs4>
								Hull Caustic Res:
								{{
									formats.pct1(ship.coriolisShip.hullCausRes)
								}}
							</v-flex>
							<v-flex xs4>
								Shield Thermal Res:
								{{
									formats.pct1(
										ship.coriolisShip.shieldThermRes
									)
								}}
							</v-flex>
							<v-flex xs4>
								Shield Explosive Res:
								{{
									formats.pct1(
										ship.coriolisShip.shieldExplRes
									)
								}}
							</v-flex>
							<v-flex xs4>
								Shield Explosive Res:
								{{
									formats.pct1(ship.coriolisShip.shieldKinRes)
								}}
							</v-flex>
						</v-layout>
					</v-container>
					<v-card :key="idx" v-for="(mod, idx) in modules">
						<Module
							:formats="
								formats.pct1(
									mod.power / ship.coriolisShip.powerAvailable
								)
							"
							:mod="mod"
							:ship="ship"
							:translate="translate(mod.grp)"
							:units="units"
						/>
					</v-card>
				</div>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import { getLanguage } from '../i18n/Language';
import { Modules } from 'coriolis-data/dist/index';
import Module from '../components/Module';

const lang = getLanguage();
export default {
	name: 'Build',
	components: { Module },
	data: () => {
		return {
			formats: lang.formats,
			units: lang.units,
			saving: false,
			snackbar: false,
			buildSavedText: 'Build has been saved to coriolis.io',
			coriolisBuilds: null,
			translate: lang.translate
		};
	},
	methods: {
		generateModuleObj(module) {
			if (!module || !module.m || module.type === 'SHIP') {
				return undefined;
			}
			return Object.assign(
				{},
				findModule(module.m.grp, module.m.id),
				module
			);
		},

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

		saveBuildToCoriolis() {
			this.saving = true;
			let builds = JSON.parse(JSON.stringify(this.coriolisBuilds));
			if (!builds) {
				builds = {};
			}
			if (!builds[this.ship.coriolisShip.id]) {
				builds[this.ship.coriolisShip.id] = {};
			}
			builds[this.ship.coriolisShip.id][this.ship.title] = this.shipCode;
			xdLocalStorage.setItem('builds', JSON.stringify(builds), data => {
				console.log(data);
				this.snackbar = true;
				this.saving = false;
			});
		},

		/**
		 * Finds the module with the specific group and ID
		 * @param  {String} grp           Module group (pp - power plant, pl - pulse laser etc)
		 * @param  {String} id            The module ID
		 * @return {Object}               The module or null
		 */
		findModule(grp, id) {
			// See if it's a standard module
			if (Modules.standard[grp]) {
				let standardmod = Modules.standard[grp].find(e => e.id === id);
				if (standardmod !== null) {
					return standardmod;
				}
			}

			// See if it's an internal module
			if (Modules.internal[grp]) {
				let internalmod = Modules.internal[grp].find(e => e.id === id);
				if (internalmod !== null) {
					return internalmod;
				}
			}

			// See if it's a hardpoint module
			if (Modules.hardpoints[grp]) {
				let hardpointmod = Modules.hardpoints[grp].find(
					e => e.id === id
				);
				if (hardpointmod !== null) {
					return hardpointmod;
				}
			}

			return null;
		}
	},
	computed: {
		ship() {
			return this.$store.state.Build.build;
		},
		shipCode() {
			if (
				!this.ship ||
				!this.ship.coriolisShip ||
				!this.ship.coriolisShip.serialized
			) {
				return '';
			}
			return [
				'A',
				this.ship.coriolisShip.serialized.standard,
				this.ship.coriolisShip.serialized.hardpoints,
				this.ship.coriolisShip.serialized.internal,
				'.',
				this.ship.coriolisShip.serialized.enabled,
				'.',
				this.ship.coriolisShip.serialized.priorities,
				'.',
				this.ship.coriolisShip.serialized.modifications
			].join('');
		},
		modules() {
			if (
				!this.ship ||
				!this.ship.coriolisShip ||
				!this.ship.coriolisShip.costList
			) {
				return;
			}
			return this.ship.coriolisShip.costList
				.filter(module => module || module.m || module.type !== 'SHIP')
				.map(e => {
					if (!e || !e.m) {
						return undefined;
					}
					return Object.assign(
						{},
						this.findModule(e.m.grp, e.m.id),
						e
					);
				})
				.filter(mod => !!mod);
		}
	},
	async beforeMount() {
		await this.$store.dispatch('getBuild', this.$route.params.id);
		console.log(window.xdLocalStorage);
		if (window.xdLocalStorage.wasInit()) {
			console.log('Got iframe ready');
			window.xdLocalStorage.getItem('builds', builds => {
				this.coriolisBuilds = JSON.parse(builds.value);
			});
		} else {
			window.xdLocalStorage.init({
				/* required */
				iframeUrl: 'https://coriolis.io/iframe.html',
				//an option function to be called right after the iframe was loaded and ready for action
				initCallback: () => {
					console.log('Got iframe ready');
					window.xdLocalStorage.getItem('builds', builds => {
						this.coriolisBuilds = JSON.parse(builds.value);
					});
				}
			});
		}
	}
};
</script>
