<template>
	<v-layout row wrap>
		<v-flex align-center xs12>
			<v-card color="blue-grey darken-2" class="white--text">
				<v-card-title primary-title>
					<div class="headline">{{mod.class}}{{mod.rating}} {{mod.m.name || translate}}</div>
				</v-card-title>
				<v-card-title>
					<div>
						<span>Enabled: {{mod.enabled === 1 || mod.m.grp === 'bh' ? 'Yes' : 'No'}}<br></span>
						<span v-if="mod.power">
											Power usage: {{mod.power}} {{units.MW}} ({{formats}})<br></span>
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
		}
	};
</script>
