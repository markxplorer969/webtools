import { LucideIcon } from 'lucide-react';

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  is_live: boolean;
  layout_size: '1x1' | '2x1' | '1x2' | '2x2';
  tags?: string[];
  url?: string;
}

export interface ToolCategory {
  name: string;
  count: number;
}