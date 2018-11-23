<template>
	<v-container grid-list-md text-xs-center>
		<v-layout row justify-space-around wrap>
			<v-flex xs12>
				<h1>Orbis.zone contacts:</h1>
				<div>Maintainers discord: willyb321#2816</div>
				<div>
					EDCD Discord:
					<a :href="discordInvite">{{ discordInvite }}</a>
					(#coriolis-orbis)
				</div>
				<div>
					GitHub: <a :href="orbisRepo">{{ orbisRepo }}</a>
				</div>
				<div>
					Report an issue:
					<a :href="orbisIssues">{{ orbisIssues }}</a>
				</div>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
	name: 'Contact',
	data() {
		return {
			discordInvite: 'https://discord.gg/zE7daYn',
			maintainerDiscord: 'willyb321#2816',
			orbisRepo: 'https://github.com/edcd/orbis',
			orbisIssues: 'https://github.com/edcd/orbis/issues/new'
		};
	},
	methods: {}
};
</script>
