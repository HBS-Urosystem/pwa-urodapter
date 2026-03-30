/**
 * Reads `content/**`, validates with Zod, writes `src/lib/content/generated.ts`.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const contentDir = join(root, 'content');
const outDir = join(root, 'src/lib/content');
const outFile = join(outDir, 'generated.ts');

const StepSchema = z.object({
	id: z.string(),
	title: z.string(),
	video: z.number().nullable(),
	body: z.string(),
	plusModalId: z.union([z.literal(1), z.literal(3), z.literal(6), z.literal(9)]).optional(),
	plusLabel: z.string().optional()
});

const StepsFileSchema = z.object({
	steps: z.array(StepSchema)
});

/** @param {number | null} videoId */
function toVideoPoster(videoId) {
	return videoId == null ? null : `/assets/video/${videoId}.jpg`;
}

const ModalButtonsSchema = z.object({
	modalButtons: z.array(
		z.object({
			label: z.string(),
			modal: z.enum(['emptyingTheBladder', 'disinfection']),
			placement: z.literal('afterLetter'),
			letter: z.string()
		})
	)
});

function readText(rel) {
	return readFileSync(join(contentDir, rel), 'utf8').replace(/^\uFEFF/, '');
}

function readYaml(rel) {
	return parseYaml(readFileSync(join(contentDir, rel), 'utf8'));
}

/** @param {string} md */
function parseH2Sections(md) {
	const lines = md.trim();
	const re = /^##\s+(.+)$/gm;
	const matches = [...lines.matchAll(re)];
	const sections = [];
	for (let i = 0; i < matches.length; i++) {
		const start = matches[i].index + matches[i][0].length;
		const end = i + 1 < matches.length ? matches[i + 1].index : lines.length;
		const key = matches[i][1].trim().toLowerCase();
		const body = lines.slice(start, end).trim();
		sections.push({ key, body });
	}
	return sections;
}

/** @param {string} body */
function bodyToParagraphs(body) {
	return body
		.split(/\n\s*\n/)
		.map((p) => p.trim())
		.filter(Boolean);
}

/** @param {string} md */
function parseBeforeStarting(md) {
	return parseH2Sections(md)
		.filter((s) => /^[abc]$/i.test(s.key))
		.map((s) => ({
			letter: s.key.toUpperCase(),
			body: s.body.trim()
		}));
}

/** @param {string} body */
function parsePlus9(body) {
	const subRe = /^###\s+([ABC])\s*$/gm;
	const matches = [...body.matchAll(subRe)];
	if (matches.length === 0) {
		return { subsections: [{ label: 'A', paragraphs: bodyToParagraphs(body) }] };
	}
	const subsections = [];
	for (let i = 0; i < matches.length; i++) {
		const label = matches[i][1];
		const start = matches[i].index + matches[i][0].length;
		const end = i + 1 < matches.length ? matches[i + 1].index : body.length;
		subsections.push({ label, paragraphs: bodyToParagraphs(body.slice(start, end)) });
	}
	return { subsections };
}

/**
 * @param {string} md
 * @param {'female' | 'male'} gender
 */
function parseModals(md, gender) {
	const sections = parseH2Sections(md);
	/** @type {Record<string, string[]>} */
	const flat = {};
	for (const s of sections) {
		flat[s.key] = s.body;
	}

	const emptyingTheBladder = bodyToParagraphs(flat['emptying-the-bladder'] ?? '');
	const disinfection = bodyToParagraphs(flat['disinfection'] ?? '');

	if (gender === 'male') {
		return { emptyingTheBladder, disinfection };
	}

	const plus1 = { paragraphs: bodyToParagraphs(flat['plus-1'] ?? '') };
	const plus3 = { paragraphs: bodyToParagraphs(flat['plus-3'] ?? '') };
	const plus6 = { paragraphs: bodyToParagraphs(flat['plus-6'] ?? '') };
	const plus9 = parsePlus9(flat['plus-9'] ?? '');

	return {
		emptyingTheBladder,
		disinfection,
		plus1,
		plus3,
		plus6,
		plus9
	};
}

/** @param {string} md */
function parseFaq(md) {
	const trimmed = md.trim();
	const titleMatch = trimmed.match(/^#\s+(.+)$/m);
	const title = titleMatch ? titleMatch[1].trim() : 'FAQ';
	const afterTitle = titleMatch
		? trimmed.slice(titleMatch.index + titleMatch[0].length).trim()
		: trimmed;
	const re = /^##\s+(.+)$/gm;
	const matches = [...afterTitle.matchAll(re)];
	if (matches.length === 0) {
		return { title, intro: afterTitle, items: [] };
	}
	const intro = afterTitle.slice(0, matches[0].index).trim();
	const items = [];
	for (let i = 0; i < matches.length; i++) {
		const question = matches[i][1].trim();
		const start = matches[i].index + matches[i][0].length;
		const end = i + 1 < matches.length ? matches[i + 1].index : afterTitle.length;
		const answer = afterTitle.slice(start, end).trim();
		items.push({ question, answer });
	}
	return { title, intro, items };
}

/** @param {string} md */
function parseSimplePage(md) {
	const trimmed = md.trim();
	const titleMatch = trimmed.match(/^#\s+(.+)$/m);
	const title = titleMatch ? titleMatch[1].trim() : '';
	const body = titleMatch ? trimmed.slice(titleMatch.index + titleMatch[0].length).trim() : trimmed;
	return { title, body };
}

/** @param {string} md */
function parseEducationalVideo(md) {
	const titleMatch = md.match(/^#\s+(.+)$/m);
	const title = titleMatch ? titleMatch[1].trim() : 'Educational Video';
	const sections = parseH2Sections(md);
	const vid = sections.find((s) => s.key === 'video-id');
	let videoId = 193;
	let notes = '';
	if (vid) {
		const m = vid.body.match(/^\s*(\d+)/);
		if (m) videoId = Number(m[1]);
		notes = vid.body.replace(/^\s*\d+\s*/, '').trim();
	}
	return { title, videoId, poster: toVideoPoster(videoId), notes };
}

/** @param {string} md */
function parseContact(md) {
	const sections = parseH2Sections(md);
	const titleMatch = md.match(/^#\s+(.+)$/m);
	const title = titleMatch ? titleMatch[1].trim() : 'Contact';
	const get = (k) => sections.find((s) => s.key === k)?.body.trim() ?? '';
	return {
		title,
		companyMarkdown: get('company'),
		formIntro: get('formintro'),
		legalCheckboxLabel: get('legalcheckbox')
	};
}

/** @param {string} md */
function parsePreInstillation(md) {
	const titleMatch = md.match(/^#\s+(.+)$/m);
	const title = titleMatch ? titleMatch[1].trim() : '';
	const afterTitle = titleMatch ? md.slice(titleMatch.index + titleMatch[0].length).trim() : md;
	const sections = parseH2Sections(afterTitle);
	const blocks = sections
		.filter((s) => /^[ab]$/i.test(s.key))
		.map((s) => ({
			letter: s.key.toUpperCase(),
			body: s.body.trim()
		}));
	return { title, sections: blocks };
}

function assertModalButtons(meta) {
	const parsed = ModalButtonsSchema.parse(meta);
	for (const b of parsed.modalButtons) {
		if (!b.letter?.trim()) {
			throw new Error(`modalButton "${b.label}" requires letter (A/B/C)`);
		}
	}
	return parsed.modalButtons;
}

function buildFemale() {
	const stepsRaw = readYaml('instructions/female/steps.yaml');
	const steps = StepsFileSchema.parse(stepsRaw).steps;
	const beforeStarting = parseBeforeStarting(readText('instructions/female/before-starting.md'));
	const modalButtons = assertModalButtons(
		readYaml('instructions/female/before-starting.meta.yaml')
	);
	const modals = parseModals(readText('instructions/female/modals.md'), 'female');
	return {
		pageTitle: 'Instructions for doctors on female patients',
		beforeStarting,
		modalButtons,
		modals,
		steps: steps.map((step) => ({ ...step, poster: toVideoPoster(step.video) }))
	};
}

function buildMale() {
	const stepsRaw = readYaml('instructions/male/steps.yaml');
	const steps = StepsFileSchema.parse(stepsRaw).steps;
	const beforeStarting = parseBeforeStarting(readText('instructions/male/before-starting.md'));
	const modalButtons = assertModalButtons(readYaml('instructions/male/before-starting.meta.yaml'));
	const modals = parseModals(readText('instructions/male/modals.md'), 'male');
	return {
		pageTitle: 'Instructions for doctors on male patients',
		beforeStarting,
		modalButtons,
		modals,
		steps: steps.map((step) => ({ ...step, poster: toVideoPoster(step.video) }))
	};
}

function main() {
	const siteContent = {
		femaleInstructions: buildFemale(),
		maleInstructions: buildMale(),
		pageCopy: {
			educationalVideo: parseEducationalVideo(readText('pages/educational-video.md')),
			preInstillation: parsePreInstillation(readText('pages/pre-instillation.md')),
			faq: parseFaq(readText('pages/faq.md')),
			contact: parseContact(readText('pages/contact.md'))
		},
		legal: {
			privacy: parseSimplePage(readText('legal/privacy-policy.md')),
			cookie: parseSimplePage(readText('legal/cookie-policy.md'))
		}
	};

	const banner = `/* eslint-disable */
/**
 * AUTO-GENERATED by scripts/compile-content.mjs — do not edit by hand.
 * Run: npm run content:build
 */
`;

	const body = `export const siteContent = ${JSON.stringify(siteContent, null, '\t')} as const;
`;

	mkdirSync(outDir, { recursive: true });
	writeFileSync(outFile, banner + body, 'utf8');
	console.log('Wrote', outFile);
}

main();
