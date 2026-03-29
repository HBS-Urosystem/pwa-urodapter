<script lang="ts">
	import InstructionsPatientPage from '$lib/components/InstructionsPatientPage.svelte';
	import { siteContent } from '$lib/content';
</script>

<InstructionsPatientPage
	storageKey="urodapter-instructions-male-v1"
	pack={siteContent.maleInstructions}
/>
