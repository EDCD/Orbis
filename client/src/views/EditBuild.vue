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
									<div class="headline">{{ship.title}}</div>
									<div>By {{ship.username}}</div>
									<div>
										<v-btn color="primary" target="_blank" rel="noopener noreferrer" v-if="ship.url" :href="ship.url">
											Edit build on
											Coriolis.io
										</v-btn>
									</div>
									<div>
										<v-btn color="primary" :to="`/builds/${$route.params.id}/edit`">Edit build details</v-btn>
									</div>
									<v-expansion-panel>
										<v-expansion-panel-content
										>
											<div slot="header">Description</div>
											<v-card>
												<v-card-text>{{ship.description}}</v-card-text>
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
				<div class="build">
					<v-container grid-list-small fluid>
						<v-layout row wrap justify-center>
							<v-flex xs4>Armour: {{formats.int(ship.coriolisShip.armour)}}</v-flex>
							<v-flex xs4>Shield: {{formats.int(ship.coriolisShip.shield)}} {{units.MJ}}</v-flex>
							<v-flex xs4>Top Speed: {{formats.int(ship.coriolisShip.topBoost)}} {{units['m/s']}}</v-flex>
							<v-flex xs4>
								Hull Thermal Res:
								{{formats.pct1(ship.coriolisShip.hullThermRes)}}
							</v-flex>
							<v-flex xs4>
								Hull Explosive Res:
								{{formats.pct1(ship.coriolisShip.hullExplRes)}}
							</v-flex>
							<v-flex xs4>
								Hull Kinetic Res:
								{{formats.pct1(ship.coriolisShip.hullKinRes)}}
							</v-flex>
							<v-flex xs4>
								Hull Caustic Res:
								{{formats.pct1(ship.coriolisShip.hullCausRes)}}
							</v-flex>
							<v-flex xs4>
								Shield Thermal Res:
								{{formats.pct1(ship.coriolisShip.shieldThermRes)}}
							</v-flex>
							<v-flex xs4>
								Shield Explosive Res:
								{{formats.pct1(ship.coriolisShip.shieldExplRes)}}
							</v-flex>
							<v-flex xs4>
								Shield Explosive Res:
								{{formats.pct1(ship.coriolisShip.shieldKinRes)}}
							</v-flex>
						</v-layout>
					</v-container>
					<v-card :key="idx" v-for="(mod,idx) in modules">

						<v-layout row wrap>
							<v-flex xs12>
								<v-card color="blue-grey darken-2" class="white--text">
									<v-card-title primary-title>
										<div class="headline">{{mod.class}}{{mod.rating}} {{mod.m.name || translate(mod.grp)}}</div>
									</v-card-title>
									<v-card-title>
										<div>
											<span>Enabled: {{mod.enabled === 1 || mod.m.grp === 'bh' ? 'Yes' : 'No'}}<br></span>
											<span v-if="mod.power">
											Power usage: {{mod.power}} {{units.MW}} ({{formats.pct1(mod.power /
											ship.coriolisShip.powerAvailable)}})<br></span>
											<span v-if="mod.mass">
											Mass: {{mod.mass}}{{units.T}}
												<br>
										</span>
											<span v-if="mod.priority">
											Priority: {{mod.priority}}
										<br>
											</span>
											<span v-if="mod.m.blueprint && mod.m.blueprint.name && mod.m.blueprint.grade">Engineering:
											{{mod.m.blueprint.name}} @ grade {{mod.m.blueprint.grade}}
											<br>
											</span>
											<span v-else>
											No engineering
												<br>
										</span>
										</div>
									</v-card-title>
								</v-card>
							</v-flex>
						</v-layout>
					</v-card>
				</div>
			</v-flex>
		</v-layout>
	</v-container>
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

	.module-container {
		padding: 10px;
		border: 1px #FF8C0D solid;
		& > * {
			border: 1px #FF8C0D dotted;
			padding: 20px;
		}
	}

</style>

<script>
	import {getLanguage} from '../i18n/Language';
	import {Modules} from 'coriolis-data/dist/index';

	const lang = getLanguage();
	export default {
		components: {},
		data: () => {
			return {
				formats: lang.formats,
				units: lang.units,
				translate: lang.translate
			};
		},
		methods: {
			generateModuleObj(module) {
				if (!module || !module.m || module.type === 'SHIP') {
					return undefined;
				}
				return Object.assign({}, findModule(module.m.grp, module.m.id), module);
			},

			lazyLoad(url) {
				return url.replace('{OPTIONS}', '10x');
			},
			fullUrl(url) {
				return url.replace('{OPTIONS}', '1280x');
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
					let hardpointmod = Modules.hardpoints[grp].find(e => e.id === id);
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
			modules() {
				return this.ship.coriolisShip.costList.filter(module => module || module.m || module.type !== 'SHIP')
					.map((e) => {
						return Object.assign({}, this.findModule(e.m.grp, e.m.id), e);
					});
			}
		},
		mounted() {
			this.$store.dispatch('getBuild', this.$route.params.id);
		}
	};
</script>