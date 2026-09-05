import type { LucideIcon } from 'lucide-react';
import type { LanguageCode } from '@/pokedex/types';
import { typeInfo, allTypes } from '@/pokedex/data/typeInfo';
import { typeNames } from '@/pokedex/data/translations';
import {
  Star, Flame, Droplet, Zap, Leaf, Snowflake, Swords, Skull,
  Mountain, Feather, Brain, Bug, Gem, Ghost, Hexagon, Moon,
  Shield, Sparkles,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Star, Flame, Droplet, Zap, Leaf, Snowflake, Swords, Skull,
  Mountain, Feather, Brain, Bug, Gem, Ghost, Hexagon, Moon,
  Shield, Sparkles,
};

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  lang?: LanguageCode;
  /** Keeps the currently open Pokémon selected when the type filter is opened. */
  pokemonId?: number;
  /** When false the badge is plain text (used inside other clickable elements). */
  asLink?: boolean;
  /** Optional action for badges rendered inside an existing clickable card. */
  onClick?: () => void;
}

export default function TypeBadge({
  type,
  size = 'md',
  lang = 'en',
  pokemonId,
  asLink = true,
  onClick,
}: TypeBadgeProps) {
  const info = typeInfo[type] ?? typeInfo['normal']!;
  const Icon = iconMap[info.icon] ?? Star;
  const localizedName = typeNames[lang]?.[type] ?? info.name;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const className = `type-badge inline-flex items-center rounded-full font-bold uppercase transition-transform hover:scale-105 ${sizeClasses[size]}`;
  const style = {
    backgroundColor: info.color,
    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.38), transparent 42%, rgba(0,0,0,0.16))',
    color: info.textColor,
    borderColor: 'rgba(255,255,255,0.62)',
    textShadow: info.textColor === '#ffffff' ? '0 1px 2px rgba(23,50,77,0.28)' : '0 1px 1px rgba(255,255,255,0.3)',
  };
  const content = (
    <span className="relative z-10 inline-flex items-center">
      <Icon size={iconSizes[size]} />
      {localizedName}
    </span>
  );

  if (!asLink) {
    if (onClick) {
      return (
        <span
          role="button"
          tabIndex={0}
          className={`${className} cursor-pointer`}
          style={style}
          title={`Filtra per ${localizedName}`}
          aria-label={`Filtra per ${localizedName}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClick();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              event.stopPropagation();
              onClick();
            }
          }}
        >
          {content}
        </span>
      );
    }

    return (
      <span className={className} style={style}>
        {content}
      </span>
    );
  }

  return (
    <a
      href={`/?type=${encodeURIComponent(type)}${pokemonId ? `&pokemon=${pokemonId}` : ''}`}
      className={className}
      style={style}
      title={`Filtra per ${localizedName}`}
    >
      {content}
    </a>
  );
}

export { allTypes };
