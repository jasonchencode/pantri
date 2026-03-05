export type PantryItemStatus = 'AVAILABLE' | 'USED' | 'REMOVED';

export interface PantryItem {
  id: string;
  name: string;
  quantity?: string | null;
  unit?: string | null;
  expirationDate?: string | null;
  status: PantryItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MealIdea {
  title: string;
  description: string;
}

