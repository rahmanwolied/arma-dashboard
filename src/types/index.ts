import type { Icons } from "@/components/icons";
import type { SQL } from "drizzle-orm";

export type Prettify<T> =
  & {
    [K in keyof T]: T[K];
  }
  & {};

export type EmptyProps<T extends React.ElementType> = Omit<
  React.ComponentProps<T>,
  keyof React.ComponentProps<T>
>;

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface QueryBuilderOpts {
  where?: SQL;
  orderBy?: SQL;
  distinct?: boolean;
  nullish?: boolean;
}

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
