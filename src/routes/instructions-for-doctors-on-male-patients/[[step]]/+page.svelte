<script lang="ts">
	import { page } from '$app/state';
	import InstructionsPatientPage from '$lib/components/InstructionsPatientPage.svelte';
	import { siteContent } from '$lib/content';
</script>

<InstructionsPatientPage
	storageKey="urodapter-instructions-male-v1"
	pack={siteContent.maleInstructions}
	seoPath="/instructions-for-doctors-on-male-patients"
	activeGender="male"
	stepId={page.params.step}
/>
