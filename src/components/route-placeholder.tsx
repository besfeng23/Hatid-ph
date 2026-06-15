import Link from 'next/link';

type RoutePlaceholderProps = {
  title: string;
  description: string;
  status: string;
};

export function RoutePlaceholder({ title, description, status }: RoutePlaceholderProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-950">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[430px] items-center justify-center">
        <div className="w-full rounded-[2rem] bg-white p-6 shadow-2xl">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#0033CC]">
            Prototype route
          </span>
          <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] text-slate-950">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
            {status}
          </div>
          <Link
            href="/"
            className="mt-6 flex h-12 items-center justify-center rounded-2xl bg-[#0033CC] text-sm font-black text-white"
          >
            Back to Hatid preview
          </Link>
        </div>
      </section>
    </main>
  );
}
