# Peerbots Core — Agent & Contributor Rules

## Changesets (Required on Every Contribution)

- **Always Include a Changeset**: Every pull request or contribution to `@peerbots/core` MUST include a changeset file in `.changeset/*.md` (created via `npx changeset` or written directly with frontmatter `---\n"@peerbots/core": patch | minor | major\n---`).
- **Non-Release Changes**: If a PR only modifies internal documentation, tests, or CI workflows and does not require an npm release, create an empty changeset with `npx changeset add --empty`.
- **CI Enforcement**: Pull request CI runs `npx changeset status` (except on `changeset-release/*` branches) and will fail if no changeset is present.
- **Verification Before Opening/Updating a PR**: Always run `npm run check` (`npm run typecheck && npm test && npm run build`) and `npx changeset status` before pushing.
