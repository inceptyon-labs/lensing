/**
 * Layout utility widgets — spacers, dividers, and clock.
 * These are dashboard-only visual elements that don't require a plugin backend.
 */

/** Prefix for all layout utility widget IDs */
const UTILITY_PREFIX = '__';

/** Utility type identifiers */
export type UtilityType = 'spacer' | 'hdiv' | 'vdiv' | 'clock';

/** Definition for a layout utility available in the picker */
export interface UtilityDefinition {
  type: UtilityType;
  label: string;
  description: string;
  icon: string;
  /** Default grid size */
  defaultW: number;
  defaultH: number;
  /** Minimum grid size */
  minW: number;
  minH: number;
  /** Maximum grid size */
  maxW: number;
  maxH: number;
}

/** All available layout utilities */
export const LAYOUT_UTILITIES: UtilityDefinition[] = [
  {
    type: 'spacer',
    label: 'Spacer',
    description: 'Invisible block to create breathing room',
    icon: '⬜',
    defaultW: 3,
    defaultH: 1,
    minW: 1,
    minH: 1,
    maxW: 12,
    maxH: 12,
  },
  {
    type: 'hdiv',
    label: 'Horizontal Line',
    description: 'Thin line to separate rows',
    icon: '━',
    defaultW: 12,
    defaultH: 1,
    minW: 1,
    minH: 1,
    maxW: 12,
    maxH: 1,
  },
  {
    type: 'vdiv',
    label: 'Vertical Line',
    description: 'Thin line to separate columns',
    icon: '┃',
    defaultW: 1,
    defaultH: 4,
    minW: 1,
    minH: 1,
    maxW: 1,
    maxH: 12,
  },
  {
    type: 'clock',
    label: 'Clock',
    description: 'Current time and date display',
    icon: '◷',
    defaultW: 4,
    defaultH: 2,
    minW: 2,
    minH: 2,
    maxW: 12,
    maxH: 12,
  },
];

/** Check if a widget ID belongs to a layout utility */
export function isUtilityWidget(id: string): boolean {
  return id.startsWith(UTILITY_PREFIX);
}

/** Extract the utility type from a widget ID (e.g. "__spacer-abc" → "spacer") */
export function getUtilityType(id: string): UtilityType | null {
  if (!id.startsWith(UTILITY_PREFIX)) return null;
  const rest = id.slice(UTILITY_PREFIX.length);
  const dash = rest.indexOf('-');
  const type = dash === -1 ? rest : rest.slice(0, dash);
  if (['spacer', 'hdiv', 'vdiv', 'clock'].includes(type)) {
    return type as UtilityType;
  }
  return null;
}

/** Get the utility definition for a type */
export function getUtilityDefinition(type: UtilityType): UtilityDefinition | undefined {
  return LAYOUT_UTILITIES.find((u) => u.type === type);
}

/** Generate a unique widget ID for a utility type */
export function makeUtilityId(type: UtilityType): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${UTILITY_PREFIX}${type}-${suffix}`;
}
