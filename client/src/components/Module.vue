<template>
	<v-layout row wrap>
		<v-flex v-if="mod.readMeta('ukName')" align-center xs12>
			<v-card color="blue-grey darken-2" class="white--text">
				<v-card-title primary-title>
					<div class="headline">
						{{ mod.getClass() === 0 ? '' : mod.getClass()
						}}{{ mod.getRating() }}
						{{ mod.readMeta('ukName') || translate }}
					</div>
				</v-card-title>
				<v-card-title>
					<div>
						<span
							>Enabled:
							{{ mod.isEnabled() === true ? 'Yes' : 'No' }}<br
						/></span>
						<span v-if="mod.get('power') > 0">
							Power usage: {{ mod.get('PowerDraw') }}
							{{ units.MW }} ({{ formats }})<br
						/></span>

						<span v-if="mod.mass">
							Mass: {{ mod.mass }}{{ units.T }} <br />
						</span>
						<span v-if="mod.priority">
							Priority: {{ mod.priority }} <br />
						</span>
						<span v-if="eng && eng.BlueprintName && eng.Level"
							>Engineering: {{ eng.BlueprintName }} @ grade
							{{ eng.Level }} <br />
						</span>
						<span v-else> No engineering <br /> </span>
					</div>
				</v-card-title>
			</v-card>
		</v-flex>
	</v-layout>
</template>
<script>
export default {
	name: 'Module',
	props: {
		formats: {},
		mod: {},
		ship: {},
		translate: {},
		units: {}
	},
	computed: {
		eng() {
			return this.mod.read('Engineering');
		}
	}
};
</script>
