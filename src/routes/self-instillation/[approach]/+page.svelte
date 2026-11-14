<script lang="ts">
	import PatientApproachPage from '$lib/components/PatientApproachPage.svelte';

	let { data } = $props();
</script>

<PatientApproachPage approach={data.approach} approaches={data.approaches} />
