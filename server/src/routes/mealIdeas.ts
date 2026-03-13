import { Router } from 'express';
import { prisma } from '../prisma';
import { generateMealIdeas } from '../lib/mealIdeas';

const router = Router();

router.get('/meal-ideas', async (_req, res) => {
  try {
    const items = await prisma.pantryItem.findMany({
      where: { status: { not: 'REMOVED' } }
    });

    const ingredientNames = items.map((i) => i.name);
    const ideas = generateMealIdeas(ingredientNames);

    res.json(ideas);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to generate meal ideas' });
  }
});

export default router;

