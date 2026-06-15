import { RouteShellPage } from '@/components/route-shell-page';

export default function AccountPage() {
  return (
    <RouteShellPage
      eyebrow="Route preview"
      title="Account"
      description="Account edits are not fully wired to Supabase auth or profiles yet."
    />
  );
}
