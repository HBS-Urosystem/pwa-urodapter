<script lang="ts">
	import Close from './icons/Close.svelte';
	import Sun from './icons/Sun.svelte';
	import type { HaloLevel } from './config';
	import { fill, formatZoom, type Strings } from './i18n';

	let {
		t,
		level,
		zoom,
		onlight,
		onzoomreset,
		onexit
	}: {
		t: Strings;
		level: HaloLevel;
		zoom: number;
		onlight: () => void;
		onzoomreset: () => void;
		onexit: () => void;
	} = $props();

	/** The label carries the state, because the button itself is just a sun. */
	const lightLabel = $derived({ off: t.lightOff, soft: t.lightSoft, bright: t.lightBright }[level]);
</script>

<div class="glass-smoke flex items-center gap-0.5 rounded-full p-1">
	<button class="pill" type="button" aria-label={lightLabel} onclick={onlight}>
		<Sun {level} />
	</button>
	<button
		class="pill readout"
		type="button"
		aria-label={fill(t.zoomReset, { n: formatZoom(zoom) })}
		onclick={onzoomreset}
	>
		{formatZoom(zoom)}×
	</button>
	<button class="pill" type="button" aria-label={t.exit} onclick={onexit}>
		<Close />
	</button>
</div>

<style>
	/*
		Smoked glass (app.urostill's `glass-smoke` utility). Floats over live video
		only. Lighter than daisyUI's .glass: its 40px blur is too expensive over
		live video on low-end phones and too low-contrast over bright skin.
	*/
	.glass-smoke {
		color: #fff;
		background-color: rgb(22 33 43 / 0.66);
		background-image: linear-gradient(135deg, rgb(255 255 255 / 0.1) 0%, rgb(255 255 255 / 0) 60%);
		-webkit-backdrop-filter: blur(16px) saturate(130%);
		backdrop-filter: blur(16px) saturate(130%);
		box-shadow:
			inset 0 0 0 1px rgb(255 255 255 / 0.18),
			0 8px 24px rgb(0 0 0 / 0.25);
	}

	@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
		.glass-smoke {
			background-color: rgb(22 33 43 / 0.88);
		}
	}

	.pill {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 48px;
		min-height: 48px;
		border-radius: 9999px;
		color: #fff;
	}

	.readout {
		padding-inline: 0.75rem;
		font-size: 1.125rem;
		line-height: 1.5rem;
		font-weight: 600;
		/* Tabular figures, so the pill does not twitch as the zoom changes. */
		font-variant-numeric: tabular-nums;
	}

	/* Lagoon is the focus ring for light surfaces; on smoked glass it is white. */
	.pill:focus-visible {
		outline: 3px solid #fff;
		outline-offset: 2px;
	}
</style>
