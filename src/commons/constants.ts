import { IconKey } from "@/commons/icons";

export interface SidebarItem {
  name: string;
  icon: IconKey;
  href: string;
  badge?: string;
}
export const sidebarItems: SidebarItem[] = [
  { name: 'Sorting', icon: 'MdSort', href: '/sort' },
  { name: 'Searching', icon: 'MdSearch', href: '/search' },
];