<template>
	<v-container grid-list-md text-xs-center>
		<v-layout row justify-space-around wrap>
			<v-flex xs12>
				<h1>404! Don't panic!</h1>
				<router-link to="/">Return home</router-link>
				<v-btn @click="getRandomImage">Load a random /r/elitedangerous post?</v-btn>
				<h2 v-if="imageURL">Enjoy a post from /r/elitedangerous</h2>
				<hr v-if="imageURL">
				<h3 v-if="imageURL">{{imageTitle}}</h3>
				<v-img v-if="imageURL" max-height="75vh" contain :src="imageURL"></v-img>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	export default {
		name: 'FourOhFor',
		data() {
			return {
				imageURL: '',
				imageTitle: ''
			};
		},
		methods: {
			async getRandomImage() {
				let data;
				try {
					data = await this.$axios.get(`https://api.imgur.com/3/gallery/r/elitedangerous`, {
						headers: {
							Authorization: 'Client-ID 746dbc0418a149b'
						}
					});
				} catch (e) {
					console.log(e);
				}
				if (data && data.data) {
					const random = data.data.data[Math.random() * data.data.data.length >> 0];
					this.imageURL = random.link;
					this.imageTitle = random.title;
				}
			}
		}
	};
</script>
