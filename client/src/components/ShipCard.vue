<template>
	<v-card>
		<v-img
			class="white--text"
			:lazy-src="lazyLoad(imageURL)"
			:src="fullUrl(imageURL)"
		>
		</v-img>
		<v-card-title primary-title>
			<v-layout column justify-start>
				<v-flex justify-start align-content-start align-start>
					<div class="headline">{{ title }}</div>
					<div class="grey--text">
						{{ truncateText(description, 50) }}
					</div>
					<div class="grey--text">
						By
						<router-link :to="profile">{{ username }}</router-link>
					</div>
				</v-flex>
			</v-layout>
		</v-card-title>

		<v-card-actions>
			<v-flex column>
				<v-btn :to="orbisLink(id)" flat color="orange">View</v-btn>
				<v-btn flat color="orange" target="_blank" :href="coriolisLink"
					>View on Coriolis</v-btn
				>
			</v-flex>
			<v-flex column>
				<v-btn
					:disabled="!loggedIn"
					flat
					@click="sendVote({ id: dbId, type: 1 });"
					color="orange"
					>Upvote
				</v-btn>
				<v-btn flat color="orange" disabled outline
					>Score: {{ score }}</v-btn
				>
				<v-btn
					:disabled="!loggedIn"
					@click="sendVote({ id: dbId, type: -1 });"
					flat
					color="blue"
					>Downvote
				</v-btn>
			</v-flex>
		</v-card-actions>
	</v-card>
</template>

<script>
import _ from 'lodash';

export default {
	name: 'ShipCard',
	computed: {
		votes() {
			return this.$store.state.Vote.votes;
		},
		profile() {
			return `/profile/${this.username}`;
		},
		loggedIn() {
			return (
				Boolean(this.$store.state.Common.user) &&
				!_.isEmpty(this.$store.state.Common.user)
			);
		}
	},
	data() {
		return {
			score: this.likes
		};
	},
	methods: {
		orbisLink(id) {
			return `/build/${id}`;
		},
		truncateText(str, num) {
			return str.length > num
				? str.slice(0, num > 3 ? num - 3 : num) + '...'
				: str;
		},
		lazyLoad(url) {
			return `${url.replace('{{WIDTH}}', '10')}&height=10`;
		},
		fullUrl(url) {
			return `${url.replace('{{WIDTH}}', '1280')}&height=720`;
		},
		getVote(id) {
			const vote = this.votes[id];
			if (vote) {
				return vote.vote;
			}
			return undefined;
		},
		async sendVote({ id, type }) {
			await this.$store.dispatch('postVote', { id, vote: type });
			this.score = this.$store.state.Vote.counts[id];
		}
	},
	props: {
		title: String,
		coriolisLink: String,
		imageURL: String,
		id: String,
		username: String,
		likes: Number,
		dbId: String,
		description: String
	}
};
</script>
