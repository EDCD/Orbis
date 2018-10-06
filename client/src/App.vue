<template>
	<v-app dark>
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
						<img src="@/assets/svg/Logout.svg"/>
					</v-btn>
					<span>{{loggedIn ? 'Logout' : 'Login'}}</span>
				</v-tooltip>
			</v-toolbar>
		</header>
		<v-content>
			<v-container grid-list-md text-xs-center>
				<v-flex xs12>
					<announcement :key="announce.id" v-for="announce in announcements" type="success"
												:display="Date.parse(announce.expiresAt) > Date.now()"
												:text="announce.message"></announcement>
				</v-flex>
			</v-container>
			<router-view></router-view>
		</v-content>
		<v-footer :fixed="fixed" app>
			<span>&copy; EDCD 2017</span>
		</v-footer>
	</v-app>
</template>

<script>
	import Announcement from './components/Announcement';

	export default {
		name: 'App',
		components: {Announcement},
		data() {
			return {
				fixed: true
			};
		},
		computed: {
			announcements() {
				return this.$store.state.Common.announcements;
			},
			user() {
				return this.$store.state.Common.user;
			},
			loggedIn() {
				return Boolean(this.$store.state.Common.user.username);
			}
		},
		mounted() {
			this.$store.dispatch('getAnnouncements');
			this.$store.dispatch('checkAuth');
		}
	};
</script>

<style>

</style>
