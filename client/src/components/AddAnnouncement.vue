<template>
	<v-form ref="form" lazy-validation>
		<v-menu
			ref="menu"
			v-model="menu"
			:close-on-content-click="false"
			:nudge-right="40"
			lazy
			transition="scale-transition"
			offset-y
			full-width
			max-width="290px"
			min-width="290px"
		>
			<v-text-field
				slot="activator"
				v-model="date"
				label="Choose date"
				prepend-icon="event"
				readonly
			></v-text-field>
			<v-date-picker v-model="date" no-title @input="menu = false"></v-date-picker>
		</v-menu>
		<v-text-field
			v-model="message"
			label="Announcement text"
		></v-text-field>
		<v-btn
			@click="submit"
		>
			submit
		</v-btn>
		<v-btn @click="clear">clear</v-btn>
	</v-form>
</template>
<script>
	export default {
		name: 'AddAnnouncement',
		data() {
			return {
				date: '',
				message: '',
				menu: false
			};
		},
		methods: {
			async submit() {
				await this.$store.dispatch('postAnnouncement', {expiresAt: this.date, message: this.message});
				await this.$store.dispatch('getAnnouncements');
			},
			clear() {
				this.$refs.form.reset();
			}
		}
	};
</script>
