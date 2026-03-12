import { Router } from 'express';
import multer from 'multer';
import { TextractClient, AnalyzeExpenseCommand } from '@aws-sdk/client-textract';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB for MVP
  }
});

const textract = new TextractClient({
  region: process.env.AWS_REGION
});

router.post('/receipts/scan', upload.single('receipt'), async (req, res) => {
  try {
    if (!process.env.AWS_REGION) {
      return res.status(500).json({ error: 'AWS_REGION is not configured on the server' });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'Missing receipt image file under field "receipt"' });
    }

    const cmd = new AnalyzeExpenseCommand({
      Document: {
        Bytes: req.file.buffer
      }
    });

    const result = await textract.send(cmd);

    return res.json(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Textract scan failed', err);
    return res.status(500).json({ error: 'Failed to analyze receipt with Textract' });
  }
});

export default router;

