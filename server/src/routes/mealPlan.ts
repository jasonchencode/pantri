import { Router } from 'express';
import { prisma } from '../prisma';
import { getOrCreateDemoUser } from '../lib/demoUser';
import { generateMealIdeas } from '../lib/mealIdeas';

const router = Router();

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function getWeekStart(date = new Date()) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);

  return result;
}

function buildWeeklyPlanDays(ingredientNames: string[]) {
  const ideas = generateMealIdeas(ingredientNames);
  const titles = ideas.map((idea) => idea.title);

  return DAY_LABELS.map((dayLabel, index) => ({
    dayLabel,
    breakfast: titles[index % titles.length],
    lunch: titles[(index + 1) % titles.length],
    dinner: titles[(index + 2) % titles.length],
    sortOrder: index
  }));
}

router.post('/meal-plan/generate', async (_req, res) => {
  try {
    const user = await getOrCreateDemoUser();
    const pantryItems = await prisma.pantryItem.findMany({
      where: { userId: user.id, status: 'AVAILABLE' },
      orderBy: [{ expirationDate: 'asc' }, { createdAt: 'desc' }]
    });

    const weekStart = getWeekStart();
    const days = buildWeeklyPlanDays(pantryItems.map((item) => item.name));

    await prisma.mealPlan.deleteMany({
      where: { userId: user.id }
    });

    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: user.id,
        weekStart,
        days: {
          create: days
        }
      },
      include: {
        days: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    res.status(201).json(mealPlan);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to generate weekly meal plan' });
  }
});

router.get('/meal-plan/current', async (_req, res) => {
  try {
    const user = await getOrCreateDemoUser();
    const mealPlan = await prisma.mealPlan.findFirst({
      where: { userId: user.id },
      orderBy: [{ weekStart: 'desc' }, { createdAt: 'desc' }],
      include: {
        days: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    res.json(mealPlan ?? null);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch current meal plan' });
  }
});

router.delete('/meal-plan/:id', async (req, res) => {
  try {
    const user = await getOrCreateDemoUser();
    const { id } = req.params;

    const deleted = await prisma.mealPlan.deleteMany({
      where: { id, userId: user.id }
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: 'Meal plan not found' });
    }

    res.status(204).send();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to delete meal plan' });
  }
});

export default router;
