<script lang="ts">
	import PatientApproachPage from '$lib/components/PatientApproachPage.svelte';
	import { siteContent } from '$lib/content';

	/** Entry address of "Self-instillation at home": the first approach tab, with the "Read first" text open. */
	const approaches = siteContent.patient.approaches;
</script>

<PatientApproachPage approach={approaches[0]} {approaches} entry />
