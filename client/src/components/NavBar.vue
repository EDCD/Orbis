<template>
	<header>
		<v-toolbar dark color="primary">
			<router-link to="/">
				<img src="@/assets/svg/Orbis.svg"/>
			</router-link>
			<v-toolbar-title>Orbis.zone</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-tooltip v-if="loggedIn" bottom>
				<v-btn
					large
					:href="`/profile/${user.username}`"
					slot="activator"
				>
					My Profile
				</v-btn>
				<span>My Profile</span>
			</v-tooltip>
			<v-tooltip bottom>
				<v-btn
					icon
					large
					:href="loggedIn ? '/api/logout' : '/api/auth'"
					slot="activator"
				>
					<img alt="Orbis.zone logo" src="@/assets/svg/Logout.svg"/>
				</v-btn>
				<span>{{loggedIn ? 'Logout' : 'Login'}}</span>
			</v-tooltip>
		</v-toolbar>
	</header>
</template>
<script>
	export default {
		name: 'NavBar',
		props: {
			loggedIn: {},
			user: {}
		}
	};
</script>
