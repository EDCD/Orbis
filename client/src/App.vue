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
						<img alt="Orbis.zone logo" src="@/assets/svg/Logout.svg"/>
					</v-btn>
					<span>{{loggedIn ? 'Logout' : 'Login'}}</span>
				</v-tooltip>
			</v-toolbar>
		</header>
		<v-content>
			<v-container grid-list-md text-xs-center>
				<v-layout align-center justify-center row wrap fill-height>
					<v-flex :key="announce.id" v-for="announce in announcements" xs12 sm6>
						<announcement type="success"
													:display="Date.parse(announce.expiresAt) > Date.now()"
													:text="announce.message"></announcement>
					</v-flex>
				</v-layout>
			</v-container>
			<router-view></router-view>
		</v-content>
		<v-footer height="auto" :fixed="fixed" color="primary lighten-1" app>
			<v-layout
				justify-center
				row
				wrap
			>
				<v-flex
					primary
					lighten-2
					py-3
					text-xs-center
					white--text
					xs12
				>
					&copy; {{new Date().getFullYear()}} <strong>EDCD</strong>
					<v-btn v-if="admin" to="/admin">Admin</v-btn>
					<v-btn to="/about">About</v-btn>
					<v-btn to="/contact">Contact</v-btn>
				</v-flex>

			</v-layout>
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
			admin() {
				return this.$store.state.Common.admin;
			},
			loggedIn() {
				return !!Object.keys(this.$store.state.Common.user).length;
			}
		},
		async mounted() {
			await this.$store.dispatch('getAnnouncements');
			await this.$store.dispatch('checkAuth');
		}
	};
</script>

<style>

</style>
