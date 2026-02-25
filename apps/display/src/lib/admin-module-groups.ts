/** Grouping of built-in modules for the admin Modules tab */
export interface ModuleGroup {
  label: string;
  ids: string[];
}

export const MODULE_GROUPS: ModuleGroup[] = [
  { label: 'Data Sources', ids: ['weather', 'news', 'sports', 'crypto'] },
  { label: 'Integrations', ids: ['calendar', 'home-assistant', 'allergies'] },
  { label: 'Hardware', ids: ['pir', 'photo-slideshow'] },
];
