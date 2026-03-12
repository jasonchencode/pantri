import { Platform } from 'react-native';
import { getApiBaseUrl } from '@services/api';

export interface ReceiptScanResult {
  // For now we just expose the raw Textract response type loosely.
  // You can tighten this later based on what you need.
  raw: unknown;
}

export async function scanReceipt(imageUri: string): Promise<ReceiptScanResult> {
  const formData = new FormData();

  // React Native FormData requires this object shape.
  formData.append('receipt', {
    uri: imageUri,
    name: 'receipt.jpg',
    type: 'image/jpeg'
  } as any);

  const res = await fetch(`${getApiBaseUrl()}/receipts/scan`, {
    method: 'POST',
    // Let fetch set the multipart boundary automatically.
    body: formData
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to scan receipt');
  }

  const raw = await res.json();
  return { raw };
}

