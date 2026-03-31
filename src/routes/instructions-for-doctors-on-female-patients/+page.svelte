<script lang="ts">
	import InstructionsPatientPage from '$lib/components/InstructionsPatientPage.svelte';
	import { siteContent } from '$lib/content';
</script>

<InstructionsPatientPage
	storageKey="urodapter-instructions-female-v1"
	pack={siteContent.femaleInstructions}
	seoPath="/instructions-for-doctors-on-female-patients"
	activeGender="female"
/>
