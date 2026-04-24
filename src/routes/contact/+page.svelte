<script lang="ts">
	import { resolve } from '$app/paths';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { siteContent } from '$lib/content';
	import { formatInlineMarkdown } from '$lib/markdown-inline';

	const c = siteContent.pageCopy.contact;
	const pageTitle = `${c.title} | Urodapter`;
	const privacyIdx = c.legalCheckboxLabel.indexOf('Privacy Policy');
	const beforePrivacy =
		privacyIdx >= 0 ? c.legalCheckboxLabel.slice(0, privacyIdx) : c.legalCheckboxLabel;
	const afterPrivacy =
		privacyIdx >= 0 ? c.legalCheckboxLabel.slice(privacyIdx + 'Privacy Policy'.length) : '';

	const [companyMainParagraph, ...cliniciansSampleParagraphs] = c.companyParagraphs;
</script>

<svelte:head>
	<title>{c.title} | Urodapter</title>
	<meta name="description" content={c.formIntroParagraphs.join(' ')} />
</svelte:head>

<section class="bg-primary/20 px-4 py-8">
	<div class="mx-auto max-w-xl">
		<h1 class="mb-8 text-3xl">{c.title}</h1>

		<div
			class="prose max-w-none text-center text-base-content max-sm:prose-sm {cliniciansSampleParagraphs.length
				? 'mb-4'
				: 'mb-10'}"
			aria-label="Company details"
		>
			{#if companyMainParagraph}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<p>{@html formatInlineMarkdown(companyMainParagraph).replace(/\n/g, '<br/>')}</p>
			{/if}
		</div>

		{#if cliniciansSampleParagraphs.length > 0}
			<div
				class="mb-10 alert w-full items-start text-left alert-info"
				role="status"
				aria-label="Clinicians sample order"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="h-6 w-6 shrink-0 stroke-current"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<div class="min-w-0 flex-1">
					{#each cliniciansSampleParagraphs as para, i (`clinicians-${i}`)}
						<div class="w-full {i > 0 ? 'mt-2' : ''}">
							<p class="m-0 text-sm">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -->
								{@html formatInlineMarkdown(
									para,
									'link font-medium !text-base-content underline decoration-2'
								).replace(/\n/g, '<br/>')}
							</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<hr class="mb-10 border-base-300" />

		<form
			name="contact"
			method="POST"
			data-netlify="true"
			netlify-honeypot="bot-field"
			class="flex flex-col gap-4"
		>
			{#each c.formIntroParagraphs as para, i (`formintro-${i}`)}
				{#if i === 0}
					<legend class="font-semibold">{para}</legend>
				{:else}
					<p class="text-base-content/90">{para}</p>
				{/if}
			{/each}
			<input type="hidden" name="form-name" value="contact" />
			<p class="hidden">
				<label>
					Do not fill this out: <input name="bot-field" />
				</label>
			</p>

			<input
				type="text"
				name="contact_name"
				class="input-bordered input w-full"
				placeholder="Name*"
				required
			/>

			<input
				type="email"
				name="contact_email"
				class="input-bordered input w-full"
				placeholder="Email*"
				required
			/>

			<input
				type="text"
				name="contact_company"
				class="input-bordered input w-full"
				placeholder="Company/Institution"
			/>

			<textarea
				name="contact_message"
				class="textarea-bordered textarea min-h-28 w-full"
				placeholder="Text*"
				required
			></textarea>

			<label class="label cursor-pointer items-center gap-3">
				<input type="checkbox" name="contact_legal" class="checkbox checkbox-primary" required />
				<span class="label-text text-sm">
					{beforePrivacy}
					{#if privacyIdx >= 0}
						<a href={resolve('/privacy-policy')} class="link link-primary">Privacy Policy</a>
					{/if}
					{afterPrivacy}
				</span>
			</label>

			<button type="submit" class="btn self-end btn-primary">Submit</button>
		</form>
	</div>
</section>
