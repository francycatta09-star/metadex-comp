import { useEffect, useMemo, useState } from 'react';
import type { LanguageCode } from '@/pokedex/types';
import { localizedName, peekResource, resourceKey, slugify } from '@/pokedex/services/resources';
import { useResourceData, useResourceDialog } from './ResourceProvider';
import { typeInfo, allTypes } from '@/pokedex/data/typeInfo';
import { typeNames } from '@/pokedex/data/translations';
import { damageClassLabel, machineLabel, u } from '@/pokedex/data/uiTranslations';
import { humanize } from '@/pokedex/data/gameTranslations';
import { moveIndex, moveSlugs, type MoveIndexEntry } from '@/pokedex/data/moveIndex';
import { machineInfo, MACHINE_GENS } from '@/pokedex/data/machines';
import { Search, Swords } from 'lucide-react';

const PAGE = 48;

type SortKey = 'machine' | 'type' | 'class' | 'name' | 'power';

interface Row {
  slug: string;
  gen: number;
  type: string;
  damageClass: string;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  machine: { kind: string; number: number; digits: number } | null;
}

function MoveRow({ row, lang }: { row: Row; lang: LanguageCode }) {
  const { open } = useResourceDialog();
  const data = useResourceData('move', row.slug);
  const name = data ? localizedName(data, row.slug, lang) : u(lang, 'loading');
  const color = typeInfo[row.type]?.color ?? '#d1d5db';

  return (
    <button
      type="button"
      onClick={() => open('move', row.slug)}
      className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 text-left transition-all hover:border-gray-300 hover:shadow-md active:scale-[0.99]"
    >
      <span className="h-8 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-gray-700">{name}</span>
        <span className="block truncate text-[11px] text-gray-400">
          {typeNames[lang]?.[row.type] ?? humanize(row.type)} ·{' '}
          {damageClassLabel(lang, row.damageClass)}
          {row.machine &&
            ` · ${machineLabel(lang, row.machine.kind, row.machine.number, row.machine.digits)}`}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block text-sm font-black tabular-nums text-gray-700">
          {row.power ?? '—'}
        </span>
        <span className="block text-[10px] uppercase tracking-wide text-gray-400">
          {u(lang, 'power')}
        </span>
      </span>
    </button>
  );
}

export default function MovesSection({ lang }: { lang: LanguageCode }) {
  const [query, setQuery] = useState('');
  const [gen, setGen] = useState<number>(9);
  const [type, setType] = useState<string>('');
  const [damageClass, setDamageClass] = useState<string>('');
  const [machinesOnly, setMachinesOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('machine');
  const [visible, setVisible] = useState(PAGE);

  // Rows for the selected generation, straight from the bundled index.
  const rows = useMemo<Row[]>(() => {
    return moveSlugs
      .map((slug) => {
        const entry = moveIndex[slug] as MoveIndexEntry;
        const [moveGen, mType, mClass, power, accuracy, pp] = entry;
        const info = machineInfo(gen, slug);
        return {
          slug,
          gen: moveGen,
          type: mType,
          damageClass: mClass,
          power,
          accuracy,
          pp,
          machine: info
            ? {
                kind: info.kind,
                number: info.number,
                digits: info.slug.replace(/[^0-9]/g, '').length,
              }
            : null,
        };
      })
      .filter((r) => r.gen <= gen);
  }, [gen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rows.filter((r) => {
      if (type && r.type !== type) return false;
      if (damageClass && r.damageClass !== damageClass) return false;
      if (machinesOnly && !r.machine) return false;
      if (!q) return true;
      if (r.slug.replace(/-/g, ' ').includes(q)) return true;
      const cached = peekResource(resourceKey('move', r.slug));
      if (!cached) return false;
      return Object.values(cached.names).some((n) => n.toLowerCase().includes(q));
    });

    const kindOrder: Record<string, number> = { tm: 0, tr: 1, hm: 2 };
    const byName = (a: Row, b: Row) => a.slug.localeCompare(b.slug);

    return list.sort((a, b) => {
      if (sort === 'machine') {
        if (a.machine && b.machine) {
          return (
            (kindOrder[a.machine.kind] ?? 9) - (kindOrder[b.machine.kind] ?? 9) ||
            a.machine.number - b.machine.number
          );
        }
        if (a.machine) return -1;
        if (b.machine) return 1;
        return byName(a, b);
      }
      if (sort === 'type') return a.type.localeCompare(b.type) || byName(a, b);
      if (sort === 'class')
        return a.damageClass.localeCompare(b.damageClass) || byName(a, b);
      if (sort === 'power') return (b.power ?? -1) - (a.power ?? -1) || byName(a, b);
      return byName(a, b);
    });
  }, [rows, query, type, damageClass, machinesOnly, sort]);

  useEffect(() => {
    setVisible(PAGE);
  }, [query, type, damageClass, gen, sort, machinesOnly]);

  const selectClass =
    'rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-600 outline-none';

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="shrink-0 border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="mb-2 flex items-center gap-2">
          <Swords size={16} className="text-pokedex-red" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide text-gray-700">
              {u(lang, 'moves_title')}
            </h2>
            <p className="text-[11px] text-gray-400">{u(lang, 'moves_subtitle')}</p>
          </div>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={u(lang, 'search_moves')}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-pokedex-red"
          />
        </div>

        {/* Generation selector */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">
            {u(lang, 'generation')}
          </span>
          {MACHINE_GENS.map((gn) => (
            <button
              key={gn}
              onClick={() => setGen(gn)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all active:scale-95 ${
                gen === gn
                  ? 'bg-pokedex-red text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {gn}
            </button>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
            <option value="">{u(lang, 'all_types')}</option>
            {allTypes.map((tp) => (
              <option key={tp} value={tp}>
                {typeNames[lang]?.[tp] ?? humanize(tp)}
              </option>
            ))}
          </select>
          <select
            value={damageClass}
            onChange={(e) => setDamageClass(e.target.value)}
            className={selectClass}
          >
            <option value="">{u(lang, 'all_classes')}</option>
            <option value="physical">{u(lang, 'physical')}</option>
            <option value="special">{u(lang, 'special')}</option>
            <option value="status">{u(lang, 'status')}</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className={selectClass}
          >
            <option value="machine">{u(lang, 'sort_machine')}</option>
            <option value="type">{u(lang, 'sort_type')}</option>
            <option value="class">{u(lang, 'sort_class')}</option>
            <option value="power">{u(lang, 'sort_power')}</option>
            <option value="name">{u(lang, 'sort_name')}</option>
          </select>
          <label className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-600">
            <input
              type="checkbox"
              checked={machinesOnly}
              onChange={(e) => setMachinesOnly(e.target.checked)}
              className="accent-pokedex-red"
            />
            {u(lang, 'machines_only')}
          </label>
          <span className="ml-auto self-center text-[11px] font-semibold text-gray-400">
            {u(lang, 'showing')} {Math.min(visible, filtered.length)} / {filtered.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 pokeball-scroll">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">{u(lang, 'no_results')}</p>
        ) : (
          <>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, visible).map((row) => (
                <MoveRow key={row.slug} row={row} lang={lang} />
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

export { slugify };