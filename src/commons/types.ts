import { IconKey } from "@/commons/icons";
import React from "react";

export interface SidebarItem {
  name: string;
  icon: IconKey;
  href: string;
  badge?: string;
}

export interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface CardProps {
  title: string;
  children: React.ReactNode;
  height?: string;
  className?: string;
  contentClassName?: string;
}