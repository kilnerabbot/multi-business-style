import Link from "next/link";

interface CategoryHeroProps {
  title: string;
  subtitle: string;
  description: string;
  // Kept so existing pages keep compiling; the new theme sets its own colours.
  gradient?: string;
  accent?: string;
  tag?: string;
  cta?: { label: string; href: string };
}

export default function CategoryHero({ title, subtitle, description, tag, cta }: CategoryHeroProps) {
  return (
    <section className="bg-gradient-to-br from-[#E9DCC8] via-[#DFCDB1] to-[#D2BC9B] border-b border-[#E7E1D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        <p className="font-label text-[0.74rem] text-[#6B4A2B] mb-4">{tag ?? subtitle}</p>
        <h1 className="font-display text-5xl sm:text-6xl text-black leading-[1.05]">{title}</h1>
        <p className="mt-5 text-neutral-800 text-lg leading-relaxed max-w-xl">{description}</p>
        {cta && <Link href={cta.href} className="btn-ink mt-8">{cta.label}</Link>}
      </div>
    </section>
  );
}
