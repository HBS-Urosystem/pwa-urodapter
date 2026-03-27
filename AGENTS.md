## Change Tracking

Whenever you make changes to the codebase that differ from the original scraped version (`scraped/app.urodapter.com/`), you MUST update `WHATS-CHANGED.md` in the project root to reflect those changes. This includes new features, removed features, branding changes, asset changes, policy edits, structural changes, and any other deviation from the scraped original. Keep the file organized by its existing sections and table format, and document only durable scraped-vs-current differences (not iterative implementation history or step-by-step refactor notes).

### Do / Don't

- **Do:** Record stable outcomes, e.g. "Install App action is in the footer action row next to Share."
- **Don't:** Record implementation steps, e.g. "moved button, then fixed typing with resolve, then changed back."

---

## Project Configuration

- **Language**: TypeScript
- **Package Manager**: npm
- **Add-ons**: prettier, eslint, tailwindcss, sveltekit-adapter, devtools-json, mcp

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
