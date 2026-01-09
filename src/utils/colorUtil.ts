
export default function resolvePhaseColor(color: string) {
  const map: Record<string, string> = {
    slate:  'bg-slate-600 hover:bg-slate-600 text-slate-600',
    gray:   'bg-gray-600 hover:bg-gray-600 text-gray-600',
    zinc:   'bg-zinc-600 hover:bg-zinc-600 text-zinc-600',
    neutral:'bg-neutral-600 hover:bg-neutral-600 text-neutral-600',
    stone:  'bg-stone-600 hover:bg-stone-600 text-stone-600',

    blue:   'bg-blue-600 hover:bg-blue-600 text-blue-600',
    sky:    'bg-sky-600 hover:bg-sky-600 text-sky-600',
    cyan:   'bg-cyan-600 hover:bg-cyan-600 text-cyan-600',
    teal:   'bg-teal-600 hover:bg-teal-600 text-teal-600',
    indigo: 'bg-indigo-600 hover:bg-indigo-600 text-indigo-600',

    green:  'bg-green-300 hover:bg-green-600 text-green-300',
    emerald:'bg-emerald-600 hover:bg-emerald-600 text-emerald-600',
    lime:   'bg-lime-600 hover:bg-lime-600 text-lime-600',

    yellow: 'bg-yellow-600 hover:bg-yellow-600 text-yellow-600',
    amber:  'bg-amber-600 hover:bg-amber-600 text-amber-600',
    orange: 'bg-orange-600 hover:bg-orange-600 text-orange-600',

    red:    'bg-red-600 hover:bg-red-600 text-red-600',
    rose:   'bg-rose-600 hover:bg-rose-600 text-rose-600',
    pink:   'bg-pink-600 hover:bg-pink-600 text-pink-600',
    fuchsia:'bg-fuchsia-600 hover:bg-fuchsia-600 text-fuchsia-600',

    purple: 'bg-purple-600 hover:bg-purple-600 text-purple-600',
    violet: 'bg-violet-600 hover:bg-violet-600 text-violet-600',
  };

  return map[color] ?? map.gray;
}

export function resolvePhaseGradient(color: string) {
  const map: Record<string, string> = {
    blue:    'from-blue-400 to-blue-600',
    sky:     'from-sky-400 to-sky-600',
    cyan:    'from-cyan-400 to-cyan-600',
    teal:    'from-teal-400 to-teal-600',
    indigo:  'from-indigo-400 to-indigo-600',

    green:   'from-green-400 to-green-600',
    emerald: 'from-emerald-400 to-emerald-600',
    lime:    'from-lime-400 to-lime-600',

    yellow:  'from-yellow-400 to-yellow-500',
    amber:   'from-amber-400 to-amber-600',
    orange:  'from-orange-400 to-orange-600',

    red:     'from-red-400 to-red-600',
    rose:    'from-rose-400 to-rose-600',
    pink:    'from-pink-400 to-pink-600',
    fuchsia: 'from-fuchsia-400 to-fuchsia-600',

    purple:  'from-purple-400 to-purple-600',
    violet:  'from-violet-400 to-violet-600',

    slate:   'from-slate-600 to-slate-800',
    gray:    'from-gray-400 to-gray-600',
    zinc:    'from-zinc-400 to-zinc-600',
  };

  return map[color] ?? map.gray;
}

export function resolveFontColor(color: string) {
  const map: Record<string, string> = {
    slate:  'text-slate-600',
    gray:   'text-gray-600',
    zinc:   'text-zinc-600',
    neutral:'text-neutral-600',
    stone:  'text-stone-600',

    blue:   'text-blue-600',
    sky:    'text-sky-600',
    cyan:   'text-cyan-600',
    teal:   'text-teal-600',
    indigo: 'text-indigo-600',

    green:  'text-green-300',
    emerald:'text-emerald-600',
    lime:   'text-lime-600',

    yellow: 'text-yellow-600',
    amber:  'text-amber-600',
    orange: 'text-orange-600',

    red:    'text-red-600',
    rose:   'text-rose-600',
    pink:   'text-pink-600',
    fuchsia:'text-fuchsia-600',

    purple: 'text-purple-600',
    violet: 'text-violet-600',
  };

  return map[color] ?? map.gray;
}