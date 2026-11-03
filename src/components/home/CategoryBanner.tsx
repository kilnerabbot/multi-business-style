import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/motion/Reveal";

export interface CategoryTile {
  name: string;
  slug: string;
  image: string | null;
  count: number;
}

export default function CategoryBanner({ categories }: { categories: CategoryTile[] }) {
  if (!categories.length) return null;
  return (
    <section className="bg-[#F4F0E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14">
        <ul className="flex flex-wrap justify-center gap-y-10 divide-x divide-[#DDD5C4]">
          {categories.map((c, i) => (
            <li key={c.slug} className="px-6 sm:px-10 lg:px-12 flex-1 min-w-[9rem]">
              <Reveal delay={i * 0.07}>
              <Link href={`/shop/${c.slug}`} className="group flex flex-col items-center text-center">
                <span className="relative block w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#E4D8C3] ring-1 ring-black/5 group-hover:ring-black/30 group-hover:scale-105 transition duration-300">
                  {c.image ? (
                    <Image src={c.image} alt="" fill sizes="112px" className="object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-display text-4xl text-[#7A5230]">
                      {c.name.charAt(0)}
                    </span>
                  )}
                </span>
                <span className="mt-4 text-[1.05rem] text-black">{c.name}</span>
                <span className="text-xs text-neutral-500 mt-0.5">
                  {c.count} {c.count === 1 ? "item" : "items"}
                </span>
              </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
