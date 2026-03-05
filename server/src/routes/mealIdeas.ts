import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// Very naive rule-based meal idea generator for MVP.
function generateMealIdeas(ingredientNames: string[]) {
  const lower = ingredientNames.map((n) => n.toLowerCase());

  const has = (name: string) => lower.some((n) => n.includes(name.toLowerCase()));

  const ideas: { title: string; description: string }[] = [];

  if (has('egg')) {
    ideas.push({
      title: 'Simple Omelette',
      description:
        'Beat eggs with a pinch of salt and pepper. Cook in a pan with any veggies or cheese you have on hand.'
    });
  }

  if (has('rice')) {
    ideas.push({
      title: 'Fridge-Cleanout Fried Rice',
      description:
        'Stir-fry leftover rice with any chopped veggies and protein. Season with soy sauce or your favorite spices.'
    });
  }

  if (has('pasta')) {
    ideas.push({
      title: 'pantri Pasta Bowl',
      description:
        'Boil pasta and toss with olive oil or butter, garlic, and any veggies, cheese, or canned goods you have.'
    });
  }

  if (has('bread')) {
    ideas.push({
      title: 'Toast Toppers',
      description:
        'Toast bread and top with eggs, beans, veggies, or spreads to turn scraps into a quick meal.'
    });
  }

  if (ideas.length === 0 && ingredientNames.length > 0) {
    ideas.push({
      title: 'Throw-Together Stir-Fry',
      description:
        'Chop whatever veggies and proteins you have, stir-fry in a pan, and season with soy sauce, garlic, or any seasoning blend.'
    });
  }

  if (ideas.length === 0) {
    ideas.push({
      title: 'Add some ingredients',
      description:
        'Start by adding a few ingredients to your pantry in the app so pantri can suggest meal ideas.'
    });
  }

  return ideas;
}

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

