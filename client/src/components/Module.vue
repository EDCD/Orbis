<template>
	<v-layout row wrap>
		<v-flex v-if="mod.readMeta('ukName')" xs12>
			<v-card color="blue-grey darken-2" class="white--text">
				<v-card-title primary-title>
					<div class="headline">
						{{ name }}
					</div>
				</v-card-title>
				<v-card-text>
					<span
						>Enabled: {{ mod.isEnabled() === true ? 'Yes' : 'No'
						}}<br
					/></span>
					<span v-if="mod.get('power')">
						Power usage:
						{{
							formats.f2(mod.get('PowerDraw') || mod.get('power'))
						}}
						{{ units.MW }} ({{ powerFormat }})<br
					/></span>
					<span v-if="mod.get('pgen')">
						Power Generation: {{ mod.get('pgen') }} {{ units.MW
						}}<br
					/></span>
					<span v-if="eng && eng.BlueprintName && eng.Level"
						>Engineering: {{ eng.BlueprintName }} @ grade
						{{ eng.Level }} <br />
					</span>
					<span v-else> No engineering <br /> </span>
				</v-card-text>
			</v-card>
		</v-flex>
	</v-layout>
</template>
<script>
import * as _ from 'lodash';
import { getLanguage } from '../i18n/Language';

const lang = getLanguage();
const formats = lang.formats;
export default {
	name: 'Module',
	props: {
		mod: {},
		ship: {},
		translate: {},
		units: {}
	},
	data() {
		return {
			formats
		};
	},
	computed: {
		eng() {
			return this.mod.read('Engineering');
		},
		name() {
			return `${
				this.mod.getClass() === 0 ? '' : this.mod.getClass()
			}${this.mod.getRating()} ${_.startCase(
				_.camelCase(this.mod.readMeta('ukName'))
			)}`;
		},
		powerFormat() {
			if (this.mod.get('pgen')) {
				return 'N/A';
			}
			return formats.pct1(
				this.mod.get('power') /
					this.ship.getPowerPlant().get('PowerCapacity')
			);
		}
	}
};
</script>
