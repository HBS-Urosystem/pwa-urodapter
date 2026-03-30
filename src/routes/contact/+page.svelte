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
</script>

<svelte:head>
	<title>{c.title} | Urodapter</title>
	<meta name="description" content={c.formIntro} />
</svelte:head>

<section class="min-h-full bg-base-200/40 px-4 py-8">
	<div class="mx-auto max-w-xl">
		<h1 class="mb-8 text-3xl font-bold">{c.title}</h1>

		<div
			class="prose prose-sm mb-10 max-w-none text-center text-base-content"
			aria-label="Company details"
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html formatInlineMarkdown(c.companyMarkdown).replace(/\n/g, '<br/>')}
		</div>

		<hr class="mb-10 border-base-300" />

		<h2 class="mb-4 text-xl font-semibold">{c.formIntro}</h2>

		<form
			name="contact"
			method="POST"
			data-netlify="true"
			netlify-honeypot="bot-field"
			class="flex flex-col gap-4"
		>
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

			<label class="label cursor-pointer items-start justify-start gap-3">
				<input
					type="checkbox"
					name="contact_legal"
					class="checkbox mt-1 checkbox-primary"
					required
				/>
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
