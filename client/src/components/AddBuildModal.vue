<template>
	<v-dialog v-model="show" persistent max-width="600px">
		<v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>
		<v-card>
			<v-card-title>
				<span class="headline">Upload Build</span>
			</v-card-title>
			<v-card-text>
				<v-textarea v-model="text" placeholder="Journal Loadout Event">
				</v-textarea>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="blue darken-1" flat @click="show = false"
					>Close</v-btn
				>
				<v-btn color="blue darken-1" flat @click="submit">Save</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import { Ship } from 'ed-forge';

export default {
	name: 'AddBuildModal',
	data: () => {
		return {
			text: '',
			show: false
		};
	},
	methods: {
		async submit() {
			let json;
			let ship;
			try {
				json = JSON.parse(this.text);
			} catch (e) {
				console.error(e);
			}
			if (json) {
				console.log(json);
				ship = new Ship(json);
				console.log(ship);
			} else {
				ship = new Ship(this.text);
				console.log(ship);
			}
			const post = {};
			post.Ship = ship._object.Ship;
			post.title = ship.getShipName();
			post.description = ship.getShipName();
			post.shipId = ship.getShipID();
			post.forgeShip = ship.compress();
			console.log(post);
			await this.$axios.post('/api/builds/add', post);
			this.$emit('close');
		}
	}
};
</script>
