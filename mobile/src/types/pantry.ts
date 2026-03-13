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

export interface MealPlanDay {
  id: string;
  dayLabel: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface MealPlan {
  id: string;
  weekStart: string;
  createdAt: string;
  updatedAt: string;
  days: MealPlanDay[];
}

