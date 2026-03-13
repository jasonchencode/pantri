import { prisma } from '../prisma';

// For MVP we use a single demo user; later this can be replaced with real auth.
const DEMO_USER_EMAIL = 'demo@pantri.app';

export async function getOrCreateDemoUser() {
  const user = await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: { email: DEMO_USER_EMAIL }
  });

  return user;
}
