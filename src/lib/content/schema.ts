/**
 * Type shapes mirror `siteContent` from `generated.ts`.
 * Zod validation runs in `scripts/compile-content.mjs` at build time.
 */
import type { siteContent } from './generated';

export type SiteContent = typeof siteContent;

export type FemaleInstructionPack = SiteContent['femaleInstructions'];
export type MaleInstructionPack = SiteContent['maleInstructions'];
export type InstructionPack = FemaleInstructionPack | MaleInstructionPack;

export type InstructionStep = FemaleInstructionPack['steps'][number];
