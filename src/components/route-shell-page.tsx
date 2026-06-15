import Link from 'next/link';

type RouteShellPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function RouteShellPage({
  eyebrow,
  title,
  description,
}: RouteShellPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12 text-slate-900">
      <section className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0033CC]">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em]">{title}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold leading-6 text-amber-950">
            This page exists for route QA and navigation coverage only. It does
            not add operational or backend behavior.
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-2xl bg-[#0033CC] px-5 py-3 text-sm font-black text-white transition-colors hover:bg-blue-800"
        >
          Back to passenger prototype
        </Link>
      </section>
    </main>
  );
}
