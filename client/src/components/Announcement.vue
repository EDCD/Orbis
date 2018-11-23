<template>
	<v-alert :type="type" :value="display"> {{ text }} </v-alert>
</template>

<script>
export default {
	name: 'Announcement',
	props: {
		text: String,
		type: String,
		display: Boolean
	}
};
</script>
