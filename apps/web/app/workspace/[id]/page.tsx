import { notFound } from "next/navigation";
import { WindowPane, Button } from "@blackroad/ui";
import Link from "next/link";

const workspaceMeta: Record<string, { title: string; summary: string }> = {
  alpha: { title: "Alpha Deck", summary: "Mission control for core agents." },
  beta: { title: "Beta Console", summary: "Testing bay for new docks." }
};

export default function WorkspacePage({ params }: { params: { id: string } }) {
  const meta = workspaceMeta[params.id];

  if (!meta) return notFound();

  return (
    <WindowPane title={meta.title} className="space-y-4">
      <p className="text-sm text-white/80">{meta.summary}</p>
      <p className="text-xs text-white/60">// TODO(core-next): render live agent list + terminal</p>
      <Button asChild>
        <Link href="/">Back to chooser</Link>
      </Button>
    </WindowPane>
  );
}
