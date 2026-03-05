import { useEffect, useState } from 'react';
import {
  createPantryItem,
  deletePantryItem,
  fetchPantryItems,
  updatePantryItemStatus
} from '@services/api';
import type { PantryItem, PantryItemStatus } from '@types/pantry';

export function usePantry() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPantryItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pantry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addItem = async (input: { name: string; quantity?: string; unit?: string; expirationDate?: string | null }) => {
    setError(null);
    try {
      const created = await createPantryItem(input);
      setItems((prev) => [created, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add ingredient');
      throw err;
    }
  };

  const markStatus = async (id: string, status: PantryItemStatus) => {
    setError(null);
    try {
      const updated = await updatePantryItemStatus(id, status);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ingredient');
      throw err;
    }
  };

  const removeItem = async (id: string) => {
    setError(null);
    try {
      await deletePantryItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove ingredient');
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    refresh: load,
    addItem,
    markStatus,
    removeItem
  };
}

