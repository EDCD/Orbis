<template>
	<v-container v-if="this.forgeShipCode" grid-list-md text-xs-center>
		<v-layout row justify-space-around wrap="">
			<v-snackbar v-model="snackbar" :timeout="6000" :top="true">
				{{ buildSavedText }}
				<v-btn color="pink" flat @click="snackbar = false">
					Close
				</v-btn>
			</v-snackbar>
			<v-flex xs12>
				<v-card color="cyan darken-2" class="white--text">
					<v-layout>
						<v-flex xs5>
							<v-img
								:lazy-src="lazyLoad(forgeShipCode.proxiedImage)"
								:src="fullUrl(forgeShipCode.proxiedImage)"
								height="256px"
								contain
							></v-img>
						</v-flex>
						<v-flex xs7>
							<v-card-title primary-title>
								<div>
									<div class="headline">
										{{ forgeShipCode.title }}
									</div>
									<div>By {{ forgeShipCode.username }}</div>
									<div>
										<v-btn
											color="primary"
											target="_blank"
											rel="noopener noreferrer"
											v-if="
												forgeShipCode.coriolisShip &&
													forgeShipCode.url
											"
											:href="forgeShipCode.url"
										>
											Edit build on Coriolis.io
										</v-btn>
										<v-btn
											v-if="shipCode"
											:loading="saving"
											@click="saveBuildToCoriolis"
											>Save build to Coriolis
										</v-btn>
									</div>
									<div>
										<v-btn
											color="primary"
											v-if="forgeShipCode.allowedToEdit"
											:to="`/edit/${$route.params.id}`"
										>
											Edit build details
										</v-btn>
									</div>
									<div>Description</div>
									<v-textarea
										:value="forgeShipCode.description"
										readonly
									></v-textarea>
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
							v-if="
								ship &&
									forgeShipCode.coriolisShip &&
									forgeShipCode.armour
							"
							row
							wrap
							justify-center
						>
							<v-flex xs4
								>Armour:
								{{
									formats.int(
										forgeShipCode.coriolisforgeShipCode
											.armour
									)
								}}
							</v-flex>
							<v-flex xs4
								>Shield:
								{{
									formats.int(
										forgeShipCode.coriolisforgeShipCode
											.shield
									)
								}}
								{{ units.MJ }}
							</v-flex>
							<v-flex xs4
								>Top Speed:
								{{
									formats.int(
										forgeShipCode.coriolisforgeShipCode
											.topBoost
									)
								}}
								{{ units['m/s'] }}
							</v-flex>
							<v-flex xs4>
								Hull Thermal Res:
								{{
									formats.pct1(
										forgeShipCode.coriolisforgeShipCode
											.hullThermRes
									)
								}}
							</v-flex>
							<v-flex xs4>
								Hull Explosive Res:
								{{
									formats.pct1(
										forgeShipCode.coriolisforgeShipCode
											.hullExplRes
									)
								}}
							</v-flex>
							<v-flex xs4>
								Hull Kinetic Res:
								{{
									formats.pct1(
										forgeShipCode.coriolisforgeShipCode
											.hullKinRes
									)
								}}
							</v-flex>
							<v-flex xs4>
								Hull Caustic Res:
								{{
									formats.pct1(
										forgeShipCode.coriolisforgeShipCode
											.hullCausRes
									)
								}}
							</v-flex>
							<v-flex xs4>
								Shield Thermal Res:
								{{
									formats.pct1(
										forgeShipCode.coriolisforgeShipCode
											.shieldThermRes
									)
								}}
							</v-flex>
							<v-flex xs4>
								Shield Explosive Res:
								{{
									formats.pct1(
										forgeShipCode.coriolisforgeShipCode
											.shieldExplRes
									)
								}}
							</v-flex>
							<v-flex xs4>
								Shield Explosive Res:
								{{
									formats.pct1(
										forgeShipCode.coriolisforgeShipCode
											.shieldKinRes
									)
								}}
							</v-flex>
						</v-layout>
					</v-container>
					<v-card :key="idx" v-for="(mod, idx) in modules">
						<Module
							:formats="
								formats.pct1(
									mod.get('power') /
										ship
											.getPowerPlant()
											.get('PowerCapacity')
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
import { Ship } from 'ed-forge';

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
			ship: null,
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
			return module;
			// return Object.assign(
			// {},
			// findModule(module.m.grp, module.m.id),
			// module
			// );
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
			if (!builds[this.forgeShipCode.coriolisShip.id]) {
				builds[this.forgeShipCode.coriolisShip.id] = {};
			}
			builds[this.forgeShipCode.coriolisShip.id][
				this.forgeShipCode.title
			] = this.forgeShipCodeCode;
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
		forgeShipCode() {
			return this.$store.state.Build.build;
		},
		shipCode() {
			if (
				!this.forgeShipCode ||
				!this.forgeShipCode.coriolisShip ||
				!this.forgeShipCode.coriolisShip.serialized
			) {
				return '';
			}
			return [
				'A',
				this.forgeShipCode.coriolisShip.serialized.standard,
				this.forgeShipCode.coriolisShip.serialized.hardpoints,
				this.forgeShipCode.coriolisShip.serialized.internal,
				'.',
				this.forgeShipCode.coriolisShip.serialized.enabled,
				'.',
				this.forgeShipCode.coriolisShip.serialized.priorities,
				'.',
				this.forgeShipCode.coriolisShip.serialized.modifications
			].join('');
		},
		modules() {
			if (!this.ship) {
				return;
			}

			console.log(
				this.ship
					.getCoreModules()
					.concat(this.ship.getInternals())
					.concat(this.ship.getHardpoints())
					.concat(this.ship.getUtilities())
					.concat(this.ship.getHardpoints())
			);
			return this.ship
				.getCoreModules()
				.concat(this.ship.getInternals())
				.concat(this.ship.getHardpoints())
				.concat(this.ship.getUtilities())
				.concat(this.ship.getHardpoints());
		}
	},
	async beforeMount() {
		await this.$store.dispatch('getBuild', this.$route.params.id);
		try {
			this.ship = new Ship(this.forgeShipCode.forgeShip);
		} catch (e) {
			console.error(e);
		}
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
