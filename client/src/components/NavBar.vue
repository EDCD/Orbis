<template>
	<header>
		<v-toolbar dark color="primary">
			<router-link to="/">
				<img alt="Orbis logo" src="@/assets/svg/Orbis.svg" />
			</router-link>
			<v-toolbar-title>Orbis.zone</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-tooltip v-if="loggedIn" bottom>
				<v-btn large :to="`/profile/${user.username}`" slot="activator">
					My Profile
				</v-btn>
				<span>My Profile</span>
			</v-tooltip>
			<v-tooltip v-if="updateAvailable" bottom>
				<v-btn large @click="update" slot="activator">
					Click to update
				</v-btn>
				<span>Click to update</span>
			</v-tooltip>
			<v-tooltip bottom>
				<v-btn
					icon
					large
					:href="loggedIn ? '/api/logout' : '/api/auth'"
					slot="activator"
				>
					<img alt="Orbis.zone logo" src="@/assets/svg/Logout.svg" />
				</v-btn>
				<span>{{ loggedIn ? 'Logout' : 'Login' }}</span>
			</v-tooltip>
		</v-toolbar>
	</header>
</template>
<script>
export default {
	name: 'NavBar',
	computed: {
		updateAvailable() {
			return this.$store.state.Common.updateAvailable;
		},
		user() {
			return this.$store.state.Common.user;
		},
		admin() {
			return this.$store.state.Common.admin;
		},
		loggedIn() {
			return (
				this.$store.state.Common.user &&
				!!Object.keys(this.$store.state.Common.user).length
			);
		}
	},
	methods: {
		async update() {
			const reg = await navigator.serviceWorker.getRegistration();
			if (!reg || !reg.waiting) {
				return;
			}
			reg.waiting.postMessage('skipWaiting');
			window.location.reload();
		}
	}
};
</script>
