import type { MealIdea, PantryItem, PantryItemStatus } from '@types/pantry';

// No hardcoded IP – set via in-app config or EXPO_PUBLIC_API_URL at build time.
export const API_BASE_URL_STORAGE_KEY = '@pantri/api_base_url';

let _apiBaseUrl: string | null = null;

export function getApiBaseUrl(): string {
  return _apiBaseUrl ?? process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api';
}

export function setApiBaseUrl(url: string): void {
  _apiBaseUrl = url;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json();
}

export async function fetchPantryItems(): Promise<PantryItem[]> {
  const res = await fetch(`${getApiBaseUrl()}/pantry-items`);
  return handleResponse<PantryItem[]>(res);
}

interface CreatePantryItemInput {
  name: string;
  quantity?: string;
  unit?: string;
  expirationDate?: string | null;
}

export async function createPantryItem(input: CreatePantryItemInput): Promise<PantryItem> {
  const res = await fetch(`${getApiBaseUrl()}/pantry-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  return handleResponse<PantryItem>(res);
}

export async function updatePantryItemStatus(
  id: string,
  status: PantryItemStatus
): Promise<PantryItem> {
  const res = await fetch(`${getApiBaseUrl()}/pantry-items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return handleResponse<PantryItem>(res);
}

export async function deletePantryItem(id: string): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/pantry-items/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete pantry item');
  }
}

export async function fetchMealIdeas(): Promise<MealIdea[]> {
  const res = await fetch(`${getApiBaseUrl()}/meal-ideas`);
  return handleResponse<MealIdea[]>(res);
}

