import type { LanguageCode } from '@/pokedex/types';
import { pokeApiLangMap } from '@/pokedex/data/translations';
import { humanize } from '@/pokedex/data/gameTranslations';

const API_BASE = 'https://pokeapi.co/api/v2';
const CACHE_PREFIX = 'pokedex_res_v1_';

export type ResourceKind =
  | 'move'
  | 'item'
  | 'ability'
  | 'location-area'
  | 'location'
  | 'encounter-method'
  | 'version'
  | 'egg-group'
  | 'pokemon-species'
  | 'pokemon-habitat'
  | 'growth-rate';

export interface MoveMetaData {
  type: string;
  damageClass: string;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  priority: number;
  generation: string | null;
  ailment: string | null;
}

export interface ItemMetaData {
  sprite: string | null;
  cost: number;
  category: string | null;
  fling: number | null;
}

export interface ResourceData {
  kind: ResourceKind;
  slug: string;
  /** PokeAPI language code -> localized name */
  names: Record<string, string>;
  /** PokeAPI language code -> effect / description text */
  effects: Record<string, string>;
  move?: MoveMetaData;
  item?: ItemMetaData;
}

/* ------------------------------------------------------------------ */
/* Tiny reactive store with per-key subscriptions                      */
/* ------------------------------------------------------------------ */

const memory = new Map<string, ResourceData>();
const listeners = new Map<string, Set<() => void>>();
const inflight = new Map<string, Promise<ResourceData | null>>();
const failed = new Set<string>();

export function resourceKey(kind: ResourceKind, slug: string): string {
  return `${kind}:${slug}`;
}

function notify(key: string) {
  listeners.get(key)?.forEach((cb) => cb());
}

export function subscribeResource(key: string, cb: () => void): () => void {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(cb);
  return () => {
    set!.delete(cb);
  };
}

export function peekResource(key: string): ResourceData | undefined {
  if (memory.has(key)) return memory.get(key);
  if (typeof localStorage === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as ResourceData;
    memory.set(key, parsed);
    return parsed;
  } catch {
    return undefined;
  }
}

function store(key: string, data: ResourceData) {
  memory.set(key, data);
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
  } catch {
    // storage full — memory cache still works
  }
  notify(key);
}

/* ------------------------------------------------------------------ */
/* Concurrency-limited fetching                                        */
/* ------------------------------------------------------------------ */

const MAX_PARALLEL = 6;
let active = 0;
const queue: (() => void)[] = [];

function schedule<T>(job: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const run = () => {
      active += 1;
      job()
        .then(resolve, reject)
        .finally(() => {
          active -= 1;
          const next = queue.shift();
          if (next) next();
        });
    };
    if (active < MAX_PARALLEL) run();
    else queue.push(run);
  });
}

async function getJson(url: string): Promise<Record<string, unknown>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${url}`);
  return (await res.json()) as Record<string, unknown>;
}

interface RawNameEntry {
  name: string;
  language: { name: string };
}
interface RawEffectEntry {
  effect?: string;
  short_effect?: string;
  language: { name: string };
}
interface RawFlavorEntry {
  flavor_text?: string;
  text?: string;
  language: { name: string };
}

function collectNames(raw: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  for (const n of (raw as RawNameEntry[] | undefined) ?? []) {
    if (n?.language?.name && n.name) out[n.language.name] = n.name;
  }
  return out;
}

function clean(text: string): string {
  return text.replace(/[\f\n\r\u00ad]/g, ' ').replace(/\s+/g, ' ').trim();
}

function collectEffects(data: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  // Localized flavor texts (newest entry wins)
  for (const f of (data['flavor_text_entries'] as RawFlavorEntry[] | undefined) ?? []) {
    const text = f.flavor_text ?? f.text;
    if (f?.language?.name && text) out[f.language.name] = clean(text);
  }
  // Effect entries are richer — prefer them where present
  for (const e of (data['effect_entries'] as RawEffectEntry[] | undefined) ?? []) {
    const text = e.effect ?? e.short_effect;
    if (e?.language?.name && text) out[e.language.name] = clean(text);
  }
  return out;
}

async function fetchResourceData(kind: ResourceKind, slug: string): Promise<ResourceData> {
  if (kind === 'location-area') {
    const data = await getJson(`${API_BASE}/location-area/${slug}`);
    const areaNames = collectNames(data['names']);
    let names = areaNames;
    const location = data['location'] as { name: string } | undefined;
    if (Object.keys(areaNames).length === 0 && location?.name) {
      const loc = await getJson(`${API_BASE}/location/${location.name}`);
      names = collectNames(loc['names']);
    }
    return { kind, slug, names, effects: {} };
  }

  const data = await getJson(`${API_BASE}/${kind}/${slug}`);
  const base: ResourceData = {
    kind,
    slug,
    names: collectNames(data['names']),
    effects: collectEffects(data),
  };

  if (kind === 'move') {
    base.move = {
      type: (data['type'] as { name: string } | undefined)?.name ?? 'normal',
      damageClass: (data['damage_class'] as { name: string } | undefined)?.name ?? 'status',
      power: (data['power'] as number | null) ?? null,
      accuracy: (data['accuracy'] as number | null) ?? null,
      pp: (data['pp'] as number | null) ?? null,
      priority: (data['priority'] as number | undefined) ?? 0,
      generation: (data['generation'] as { name: string } | undefined)?.name ?? null,
      ailment:
        ((data['meta'] as { ailment?: { name: string } } | undefined)?.ailment?.name ?? null) ||
        null,
    };
  }

  if (kind === 'item') {
    base.item = {
      sprite: (data['sprites'] as { default?: string } | undefined)?.default ?? null,
      cost: (data['cost'] as number | undefined) ?? 0,
      category: (data['category'] as { name: string } | undefined)?.name ?? null,
      fling: (data['fling_power'] as number | null) ?? null,
    };
  }

  return base;
}

export function ensureResource(kind: ResourceKind, slug: string): Promise<ResourceData | null> {
  const key = resourceKey(kind, slug);
  const cached = peekResource(key);
  if (cached) return Promise.resolve(cached);
  if (failed.has(key)) return Promise.resolve(null);
  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = schedule(() => fetchResourceData(kind, slug))
    .then((data) => {
      store(key, data);
      return data;
    })
    .catch(() => {
      failed.add(key);
      return null;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}

/* ------------------------------------------------------------------ */
/* Localization helpers                                                */
/* ------------------------------------------------------------------ */

function langCandidates(lang: LanguageCode): string[] {
  const api = pokeApiLangMap[lang];
  const list = [api];
  if (lang === 'ja') list.push('ja', 'ja-Hrkt', 'roomaji');
  list.push('en');
  return list;
}

export function pickLocalized(
  dict: Record<string, string> | undefined,
  lang: LanguageCode
): string | null {
  if (!dict) return null;
  for (const code of langCandidates(lang)) {
    const value = dict[code];
    if (value) return value;
  }
  return null;
}

export function localizedName(
  data: ResourceData | undefined,
  slug: string,
  lang: LanguageCode
): string {
  return pickLocalized(data?.names, lang) ?? humanize(slug);
}

export function localizedEffect(
  data: ResourceData | undefined,
  lang: LanguageCode
): string | null {
  return pickLocalized(data?.effects, lang);
}

/* ------------------------------------------------------------------ */
/* Index lists (for the Moves and Items sections)                      */
/* ------------------------------------------------------------------ */

const LIST_KEY = 'pokedex_reslist_v1_';

export async function fetchResourceIndex(kind: 'move' | 'item'): Promise<string[]> {
  const cacheKey = LIST_KEY + kind;
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) return JSON.parse(raw) as string[];
    } catch {
      // ignore
    }
  }
  const data = await getJson(`${API_BASE}/${kind}?limit=3000`);
  const results = (data['results'] as { name: string }[] | undefined) ?? [];
  const slugs = results.map((r) => r.name);
  try {
    localStorage.setItem(cacheKey, JSON.stringify(slugs));
  } catch {
    // ignore
  }
  return slugs;
}

/** Slugify a display name such as "Giga Drain" into "giga-drain". */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
