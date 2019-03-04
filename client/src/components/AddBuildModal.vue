<template>
	<v-dialog v-model="show" persistent max-width="600px">
		<v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>
		<v-card>
			<v-card-title>
				<span class="headline">Upload Build</span>
			</v-card-title>
			<v-card-text>
				<v-textarea
					v-model="shipJson"
					placeholder="Journal Loadout Event"
				></v-textarea>
			</v-card-text>
			<v-text-field
				v-model="title"
				:rules="[rules.maxTitle]"
				placeholder="Ship Name / Title"
			></v-text-field>
			<v-textarea
				v-model="description"
				:counter="256"
				:rules="[rules.maxDesc]"
				placeholder="Ship Description"
			></v-textarea>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="blue darken-1" flat @click="show = false"
					>Close
				</v-btn>
				<v-btn
					color="blue darken-1"
					flat
					:loading="submitting"
					@click="submit"
					>Save</v-btn
				>
			</v-card-actions>
			<v-alert type="success" v-model="urlGotten"
				>Your new ship:
				<router-link :to="`/build/${this.url}`"
					>https://orbis.zone/build/{{ url }}</router-link
				></v-alert
			>
		</v-card>
	</v-dialog>
</template>

<script>
import { Ship } from 'ed-forge';
import _ from 'lodash';

export default {
	name: 'AddBuildModal',
	watch: {
		shipJson(newJson) {
			try {
				let json = JSON.parse(newJson);
				this.ship = new Ship(json);
			} catch (e) {
				console.error(e);
			}
			this.debouncedUpdateShip();
		}
	},
	data: () => {
		return {
			text: '',
			shipJson: null,
			url: '',
			urlGotten: false,
			submitting: false,
			rules: {
				maxDesc: val => val.length <= 256 || 'Max 256 characters',
				maxTitle: val => val.length <= 50 || 'Max 50 characters'
			},
			title: '',
			description: '',
			ship: null,
			show: false
		};
	},
	created() {
		this.debouncedUpdateShip = _.debounce(this.updateShip, 500);
	},
	methods: {
		async submit() {
			this.submitting = true;
			this.ship.setShipName(this.title);
			const post = {};
			post.Ship = this.ship._object.Ship;
			post.title = this.title;
			post.description = this.description;
			post.shipId = this.ship.getShipID();
			post.forgeShip = this.ship.compress();
			console.log(post);
			let res;
			try {
				res = await this.$axios.post('/api/builds/add', post, {
					withCredentials: true
				});
			} catch (err) {
				console.error(err);
				this.submitting = false;
			}
			if (res && res.data) {
				console.log(res);
				this.url = res.data.id;
				this.urlGotten = true;
			}
			this.submitting = false;
		},
		updateShip() {
			this.title = this.ship.getShipName();
			this.description = this.title;
		}
	}
};
</script>
