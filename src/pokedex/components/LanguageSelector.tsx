import { useState, useRef, useEffect } from 'react';
import type { LanguageCode } from '@/pokedex/types';
import { languages } from '@/pokedex/data/translations';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  lang: LanguageCode;
  onChange: (lang: LanguageCode) => void;
}

export default function LanguageSelector({ lang, onChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = languages.find((l) => l.code === lang) ?? languages[0]!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white/80 transition-all hover:bg-white/20"
      >
        <Globe size={14} />
        <span className="hidden sm:inline">{current.name}</span>
        <span className="font-mono text-[10px] uppercase sm:hidden">{current.code}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                onChange(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors ${
                l.code === lang
                  ? 'bg-pokedex-red/5 font-semibold text-pokedex-red'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{l.name}</span>
              {l.code === lang && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
