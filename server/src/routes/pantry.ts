import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// For MVP we use a single demo user; later this can be replaced with real auth.
const DEMO_USER_EMAIL = 'demo@pantri.app';

async function getOrCreateDemoUser() {
  const user = await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: { email: DEMO_USER_EMAIL }
  });
  return user;
}

router.get('/pantry-items', async (_req, res) => {
  try {
    const user = await getOrCreateDemoUser();
    const items = await prisma.pantryItem.findMany({
      where: { userId: user.id, status: { not: 'REMOVED' } },
      orderBy: [{ expirationDate: 'asc' }, { createdAt: 'desc' }]
    });
    res.json(items);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pantry items' });
  }
});

router.post('/pantry-items', async (req, res) => {
  try {
    const { name, quantity, unit, expirationDate } = req.body ?? {};

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const user = await getOrCreateDemoUser();

    const item = await prisma.pantryItem.create({
      data: {
        userId: user.id,
        name: name.trim(),
        quantity: quantity ?? null,
        unit: unit ?? null,
        expirationDate: expirationDate ? new Date(expirationDate) : null
      }
    });

    res.status(201).json(item);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to create pantry item' });
  }
});

router.patch('/pantry-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, name, quantity, unit, expirationDate } = req.body ?? {};

    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (name) data.name = name;
    if (quantity !== undefined) data.quantity = quantity;
    if (unit !== undefined) data.unit = unit;
    if (expirationDate !== undefined) {
      data.expirationDate = expirationDate ? new Date(expirationDate) : null;
    }

    const updated = await prisma.pantryItem.update({
      where: { id },
      data
    });

    res.json(updated);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to update pantry item' });
  }
});

router.delete('/pantry-items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.pantryItem.update({
      where: { id },
      data: { status: 'REMOVED' }
    });

    res.status(204).send();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: 'Failed to remove pantry item' });
  }
});

export default router;

