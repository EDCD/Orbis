<template>
	<v-layout row wrap>
		<v-flex xs12 sm6>
			<v-text-field
				v-model="startFeature"
				label="Build ID to feature"
			></v-text-field>
			<v-btn
				:loading="loading"
				@click="$emit('startFeaturing', startFeature)"
				>Start feature for 7 days</v-btn
			>
		</v-flex>
		<v-flex xs12 sm6>
			<v-text-field
				v-model="stopFeature"
				label="Build ID to stop featuring"
			></v-text-field>
			<v-btn
				:loading="loading"
				@click="$emit('stopFeaturing', stopFeature)"
				>Stop feature prematurely</v-btn
			>
		</v-flex>
	</v-layout>
</template>
<script>
export default {
	name: 'AdminFeatureBuilds',
	data() {
		return {
			startFeature: '',
			stopFeature: ''
		};
	},
	props: {
		loading: Boolean
	}
};
</script>
