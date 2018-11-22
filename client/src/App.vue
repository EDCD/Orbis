<template>
	<v-app dark>
		<nav-bar :logged-in="loggedIn" :user="user"/>
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
		<nav-footer :admin="admin" :fixed="fixed"/>
	</v-app>
</template>

<script>
	import Announcement from './components/Announcement';
	import NavBar from './components/NavBar';
	import NavFooter from './components/NavFooter';

	export default {
		name: 'App',
		components: {NavFooter, NavBar, Announcement},
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
				return this.$store.state.Common.user && !!Object.keys(this.$store.state.Common.user).length;
			}
		},
		mounted() {
			this.$store.dispatch('checkAuth');
			this.$store.dispatch('getAnnouncements');
		}
	};
</script>

