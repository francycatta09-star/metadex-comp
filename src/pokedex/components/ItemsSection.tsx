import { useEffect, useMemo, useState } from 'react';
import type { LanguageCode } from '@/pokedex/types';
import {
  fetchResourceIndex,
  localizedEffect,
  localizedName,
  peekResource,
  resourceKey,
} from '@/pokedex/services/resources';
import { useResourceData, useResourceDialog } from './ResourceProvider';
import { u } from '@/pokedex/data/uiTranslations';
import { Search, Loader2, Package } from 'lucide-react';

const PAGE = 48;

function ItemRow({ slug, lang }: { slug: string; lang: LanguageCode }) {
  const { open } = useResourceDialog();
  const data = useResourceData('item', slug);
  const name = data ? localizedName(data, slug, lang) : u(lang, 'loading');
  const effect = localizedEffect(data, lang);

  return (
    <button
      type="button"
      onClick={() => open('item', slug)}
      className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-left transition-all hover:border-gray-300 hover:shadow-md active:scale-[0.99]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
        {data?.item?.sprite ? (
          <img src={data.item.sprite} alt={name} loading="lazy" className="h-7 w-7 object-contain" />
        ) : (
          <Package size={16} className="text-gray-300" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-gray-700">{name}</span>
        <span className="block truncate text-[11px] text-gray-400">
          {effect || u(lang, 'no_effect')}
        </span>
      </span>
    </button>
  );
}

export default function ItemsSection({ lang }: { lang: LanguageCode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchResourceIndex('item');
        if (!cancelled) setSlugs(list);
      } catch {
        if (!cancelled) setSlugs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return slugs;
    return slugs.filter((slug) => {
      if (slug.replace(/-/g, ' ').includes(q)) return true;
      const cached = peekResource(resourceKey('item', slug));
      if (!cached) return false;
      return Object.values(cached.names).some((n) => n.toLowerCase().includes(q));
    });
  }, [slugs, query]);

  useEffect(() => {
    setVisible(PAGE);
  }, [query]);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="shrink-0 border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="mb-2 flex items-center gap-2">
          <Package size={16} className="text-pokedex-red" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide text-gray-700">
              {u(lang, 'items_title')}
            </h2>
            <p className="text-[11px] text-gray-400">{u(lang, 'items_subtitle')}</p>
          </div>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={u(lang, 'search_items')}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-pokedex-red"
          />
        </div>
        <p className="mt-2 text-right text-[11px] font-semibold text-gray-400">
          {u(lang, 'showing')} {Math.min(visible, filtered.length)} / {filtered.length}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pokeball-scroll">
        {loading ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">{u(lang, 'no_results')}</p>
        ) : (
          <>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, visible).map((slug) => (
                <ItemRow key={slug} slug={slug} lang={lang} />
              ))}
            </div>
            {visible < filtered.length && (
              <button
                onClick={() => setVisible((v) => v + PAGE)}
                className="mx-auto mt-4 block rounded-xl bg-pokedex-red px-5 py-2 text-sm font-bold text-white transition-all hover:bg-red-700 active:scale-95"
              >
                {u(lang, 'load_more')}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
