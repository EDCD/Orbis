<template>
	<v-container grid-list-md text-xs-center>
		<v-layout row justify-space-around wrap>
			<v-flex xs12>
				<h1>About Orbis.zone:</h1>
				<div>
					The Orbis project was created to provide a build repository
					for Coriolis.io
				</div>
				<div :key="idx" v-for="(link, idx) in links">
					<a class="link" :href="link.href"> {{ link.text }} </a>
				</div>
				<div>WIP</div>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
	name: 'About',
	data() {
		return {
			links: [
				{
					href: 'https://edassets.org/#/',
					text: 'Logo and more by EDAssets'
				},
				{
					href: 'https://www.edsm.net/',
					text: 'Default ship images by EDSM'
				},
				{
					href: 'https://fontawesome.com/license',
					text: 'Other icons by FontAwesome'
				},
				{
					href: 'https://l.willb.info/requestfeat',
					text: 'Request a feature'
				},
				{
					href: 'https://l.willb.info/orbisplanned',
					text: 'Requested features list'
				}
			]
		};
	},
	methods: {}
};
</script>
