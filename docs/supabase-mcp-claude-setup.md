# Supabase MCP setup for Claude

This project uses Supabase project ref `pgmltwekilhmrgfygqnw` for Hatid backend development.

Use these steps on your local machine. Authentication must be completed from a normal terminal, not from inside an IDE extension.

## 1. Add the Supabase MCP server

Run this from the project root:

```bash
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=pgmltwekilhmrgfygqnw"
```

This adds a project-scoped MCP server named `supabase`.

## 2. Authenticate the MCP server

Run:

```bash
claude /mcp
```

Then select the `supabase` server and choose **Authenticate** to start the Supabase auth flow.

## 3. Optional: install Supabase Agent Skills

Agent Skills add Supabase-specific instructions, scripts, and resources for AI coding tools.

```bash
npx skills add supabase/agent-skills
```

## Expected result

After setup, Claude should be able to use the project Supabase MCP connection for database inspection, migrations, and backend-aware coding help.

## Safety notes

- Do not commit Supabase service-role keys or `.env.local` files.
- Keep `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel/project env settings, not hard-coded source files.
- Use service-role access only from trusted server-side code.
- The Hatid backend currently has ride, trip, driver, fare quote, wallet-ledger placeholder, notification, and support foundations, but it is not cleared for live payments, payouts, or public production operations.
