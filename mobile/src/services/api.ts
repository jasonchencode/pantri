import type { MealIdea, PantryItem, PantryItemStatus } from '@types/pantry';

// For running on a physical device, we must use the Mac's LAN IP, not localhost.
const API_BASE_URL = 'http://192.168.2.14:4000/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  return res.json();
}

export async function fetchPantryItems(): Promise<PantryItem[]> {
  const res = await fetch(`${API_BASE_URL}/pantry-items`);
  return handleResponse<PantryItem[]>(res);
}

interface CreatePantryItemInput {
  name: string;
  quantity?: string;
  unit?: string;
  expirationDate?: string | null;
}

export async function createPantryItem(input: CreatePantryItemInput): Promise<PantryItem> {
  const res = await fetch(`${API_BASE_URL}/pantry-items`, {
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
  const res = await fetch(`${API_BASE_URL}/pantry-items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return handleResponse<PantryItem>(res);
}

export async function deletePantryItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/pantry-items/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete pantry item');
  }
}

export async function fetchMealIdeas(): Promise<MealIdea[]> {
  const res = await fetch(`${API_BASE_URL}/meal-ideas`);
  return handleResponse<MealIdea[]>(res);
}

