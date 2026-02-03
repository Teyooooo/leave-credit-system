 import { type Icon as IconType } from '@lucide/svelte/icons';

 export type MenuItem = {
    title: string;
    url: string;
    icon: typeof IconType;
  };