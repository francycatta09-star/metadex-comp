import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import type { LanguageCode } from '@/pokedex/types';
import { placeName } from '@/pokedex/data/placeNames';
import {
  ensureResource,
  localizedEffect,
  localizedName,
  peekResource,
  resourceKey,
  subscribeResource,
  type ResourceData,
  type ResourceKind,
} from '@/pokedex/services/resources';
import { typeInfo } from '@/pokedex/data/typeInfo';
import { typeNames } from '@/pokedex/data/translations';
import { humanize } from '@/pokedex/data/gameTranslations';
import { ailmentLabel, damageClassLabel, itemCategoryLabel, u } from '@/pokedex/data/uiTranslations';
import { X, Loader2, Info } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Data hooks                                                          */
/* ------------------------------------------------------------------ */

export function useResourceData(
  kind: ResourceKind,
  slug: string | null | undefined
): ResourceData | undefined {
  const key = slug ? resourceKey(kind, slug) : '';
  const subscribe = useCallback(
    (cb: () => void) => (key ? subscribeResource(key, cb) : () => {}),
    [key]
  );
  const getSnapshot = useCallback(() => (key ? peekResource(key) : undefined), [key]);
  const data = useSyncExternalStore(subscribe, getSnapshot, () => undefined);

  useEffect(() => {
    if (slug) void ensureResource(kind, slug);
  }, [kind, slug]);

  return data;
}

export function useLocalName(
  kind: ResourceKind,
  slug: string | null | undefined,
  lang: LanguageCode
): string {
  const data = useResourceData(kind, slug);
  if (!slug) return '';
  return data ? localizedName(data, slug, lang) : u(lang, 'loading');
}

/* ------------------------------------------------------------------ */
/* Dialog context                                                      */
/* ------------------------------------------------------------------ */

interface DialogTarget {
  kind: ResourceKind;
  slug: string;
}

interface ResourceDialogContextValue {
  open: (kind: ResourceKind, slug: string) => void;
}

const ResourceDialogContext = createContext<ResourceDialogContextValue>({ open: () => {} });

export function useResourceDialog() {
  return useContext(ResourceDialogContext);
}

export function ResourceProvider({
  lang,
  children,
}: {
  lang: LanguageCode;
  children: ReactNode;
}) {
  const [target, setTarget] = useState<DialogTarget | null>(null);

  const open = useCallback((kind: ResourceKind, slug: string) => {
    setTarget({ kind, slug });
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  useEffect(() => {
    if (!target) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setTarget(null);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [target]);

  return (
    <ResourceDialogContext.Provider value={value}>
      {children}
      {target && (
        <ResourceDialog
          kind={target.kind}
          slug={target.slug}
          lang={lang}
          onClose={() => setTarget(null)}
        />
      )}
    </ResourceDialogContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Dialog                                                              */
/* ------------------------------------------------------------------ */

function StatCell({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="text-sm font-bold text-gray-700">{value}</p>
    </div>
  );
}

function kindLabel(kind: ResourceKind, lang: LanguageCode): string {
  if (kind === 'move') return u(lang, 'move');
  if (kind === 'item') return u(lang, 'item');
  if (kind === 'ability') return u(lang, 'ability');
  return u(lang, 'location');
}

function ResourceDialog({
  kind,
  slug,
  lang,
  onClose,
}: {
  kind: ResourceKind;
  slug: string;
  lang: LanguageCode;
  onClose: () => void;
}) {
  const data = useResourceData(kind, slug);
  const rawName = localizedName(data, slug, lang);
  // Locations have no Italian/Spanish names upstream: translate generic terms.
  const name =
    kind === 'location' || kind === 'location-area' ? placeName(lang, rawName) : rawName;
  const effect = localizedEffect(data, lang);
  const move = data?.move;
  const item = data?.item;
  const accentType = move?.type;
  const accent = (accentType ? typeInfo[accentType]?.color : undefined) ?? '#DC0A2D';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="animate-fade-in-up max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border-4 border-gray-700 bg-white shadow-2xl sm:max-w-md sm:rounded-3xl pokeball-scroll"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={name}
      >
        <div
          className="flex items-start justify-between gap-3 px-5 py-4"
          style={{ background: `linear-gradient(135deg, ${accent} 0%, rgba(0,0,0,0.35) 160%)` }}
        >
          <div className="flex items-center gap-3">
            {item?.sprite && (
              <img src={item.sprite} alt={name} className="h-10 w-10 object-contain" />
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                {kindLabel(kind, lang)}
              </p>
              <h3 className="text-xl font-black text-white">{name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={u(lang, 'no_data')}
            className="shrink-0 rounded-full bg-white/20 p-1.5 text-white transition-colors hover:bg-white/30"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          {move && (
            <>
              <div className="flex flex-wrap gap-2">
                <span
                  className="rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide"
                  style={{
                    backgroundColor: typeInfo[move.type]?.color ?? '#A8A878',
                    color: typeInfo[move.type]?.textColor ?? '#fff',
                  }}
                >
                  {typeNames[lang]?.[move.type] ?? humanize(move.type)}
                </span>
                <span className="rounded-md bg-gray-800 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {damageClassLabel(lang, move.damageClass)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <StatCell label={u(lang, 'power')} value={move.power ?? '—'} />
                <StatCell
                  label={u(lang, 'accuracy')}
                  value={move.accuracy !== null ? `${move.accuracy}%` : '—'}
                />
                <StatCell label={u(lang, 'pp')} value={move.pp ?? '—'} />
              </div>
              {(move.priority !== 0 || move.ailment) && (
                <div className="grid grid-cols-2 gap-2">
                  {move.priority !== 0 && (
                    <StatCell
                      label={u(lang, 'priority')}
                      value={move.priority > 0 ? `+${move.priority}` : move.priority}
                    />
                  )}
                  {move.ailment && move.ailment !== 'none' && (
                    <StatCell label={u(lang, 'ailment')} value={ailmentLabel(lang, move.ailment)} />
                  )}
                </div>
              )}
            </>
          )}

          {item && (
            <div className="grid grid-cols-2 gap-2">
              <StatCell
                label={u(lang, 'cost')}
                value={item.cost > 0 ? `₽ ${item.cost.toLocaleString()}` : '—'}
              />
              <StatCell
                label={u(lang, 'category')}
                value={item.category ? itemCategoryLabel(lang, item.category) : '—'}
              />
            </div>
          )}

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
              <Info size={12} />
              {u(lang, 'effect')}
            </p>
            {data ? (
              <p className="text-sm leading-relaxed text-gray-600">
                {effect || u(lang, 'no_effect')}
              </p>
            ) : (
              <p className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 size={14} className="animate-spin" />
                {u(lang, 'loading')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Clickable chip                                                      */
/* ------------------------------------------------------------------ */

export function EntityChip({
  kind,
  slug,
  lang,
  className,
  suffix,
  capitalize = false,
}: {
  kind: ResourceKind;
  slug: string;
  lang: LanguageCode;
  className?: string;
  suffix?: ReactNode;
  capitalize?: boolean;
}) {
  const { open } = useResourceDialog();
  const name = useLocalName(kind, slug, lang);

  return (
    <button
      type="button"
      onClick={() => open(kind, slug)}
      title={u(lang, 'click_hint')}
      className={
        className ??
        'inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-200 active:scale-95'
      }
    >
      <span className={capitalize ? 'capitalize' : undefined}>{name}</span>
      {suffix}
    </button>
  );
}
