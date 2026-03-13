import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pantryRoutes from './routes/pantry';
import mealIdeasRoutes from './routes/mealIdeas';
import receiptsRoutes from './routes/receipts';
import mealPlanRoutes from './routes/mealPlan';

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(
  cors({
    origin: '*'
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', pantryRoutes);
app.use('/api', mealIdeasRoutes);
app.use('/api', receiptsRoutes);
app.use('/api', mealPlanRoutes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`pantri API listening on http://localhost:${PORT}`);
});

