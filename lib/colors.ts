// Available colors for journal entries
export const COLOR_OPTIONS = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray'
] as const;

export type EntryColor = typeof COLOR_OPTIONS[number];

// Tailwind color classes for indicators and styling
export const getColorClasses = (color?: string) => {
  const colorMap: Record<string, string> = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    amber: 'bg-amber-500',
    yellow: 'bg-yellow-500',
    lime: 'bg-lime-500',
    green: 'bg-green-500',
    emerald: 'bg-emerald-500',
    teal: 'bg-teal-500',
    cyan: 'bg-cyan-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    violet: 'bg-violet-500',
    purple: 'bg-purple-500',
    fuchsia: 'bg-fuchsia-500',
    pink: 'bg-pink-500',
    rose: 'bg-rose-500',
    slate: 'bg-slate-500',
    gray: 'bg-gray-500',
  };
  return colorMap[color || 'gray'] || colorMap.gray;
};

// Hover classes for interactive elements
export const getColorHoverClasses = (color?: string) => {
  const colorMap: Record<string, string> = {
    red: 'hover:bg-red-600',
    orange: 'hover:bg-orange-600',
    amber: 'hover:bg-amber-600',
    yellow: 'hover:bg-yellow-600',
    lime: 'hover:bg-lime-600',
    green: 'hover:bg-green-600',
    emerald: 'hover:bg-emerald-600',
    teal: 'hover:bg-teal-600',
    cyan: 'hover:bg-cyan-600',
    blue: 'hover:bg-blue-600',
    indigo: 'hover:bg-indigo-600',
    violet: 'hover:bg-violet-600',
    purple: 'hover:bg-purple-600',
    fuchsia: 'hover:bg-fuchsia-600',
    pink: 'hover:bg-pink-600',
    rose: 'hover:bg-rose-600',
    slate: 'hover:bg-slate-600',
    gray: 'hover:bg-gray-600',
  };
  return colorMap[color || 'gray'] || colorMap.gray;
};

// Border classes for highlighting selected entry
export const getColorBorderClasses = (color?: string) => {
  const colorMap: Record<string, string> = {
    red: 'border-red-500',
    orange: 'border-orange-500',
    amber: 'border-amber-500',
    yellow: 'border-yellow-500',
    lime: 'border-lime-500',
    green: 'border-green-500',
    emerald: 'border-emerald-500',
    teal: 'border-teal-500',
    cyan: 'border-cyan-500',
    blue: 'border-blue-500',
    indigo: 'border-indigo-500',
    violet: 'border-violet-500',
    purple: 'border-purple-500',
    fuchsia: 'border-fuchsia-500',
    pink: 'border-pink-500',
    rose: 'border-rose-500',
    slate: 'border-slate-500',
    gray: 'border-gray-500',
  };
  return colorMap[color || 'gray'] || colorMap.gray;
};
