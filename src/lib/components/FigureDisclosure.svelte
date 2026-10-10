<script lang="ts">
	/** An illustration that stays closed until the reader opens it. */
	let {
		label,
		figure
	}: {
		label: string;
		figure: { src: string; alt: string; width: number; height: number };
	} = $props();
</script>

<details class="not-prose collapse-arrow collapse my-6 border border-base-300 bg-base-100">
	<summary class="collapse-title min-h-12 font-semibold">{label}</summary>
	<div class="collapse-content">
		<img
			src={figure.src}
			alt={figure.alt}
			width={figure.width}
			height={figure.height}
			loading="lazy"
			class="h-auto w-full rounded-box bg-white"
		/>
	</div>
</details>
