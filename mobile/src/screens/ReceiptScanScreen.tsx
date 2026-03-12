import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, ActivityIndicator, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/RootNavigator';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import PrimaryButton from '@components/PrimaryButton';
import * as ImagePicker from 'expo-image-picker';
import { scanReceipt } from '@services/receipts';

type Props = NativeStackScreenProps<RootStackParamList, 'ReceiptScan'>;

const ReceiptScanScreen: React.FC<Props> = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const handlePickImage = async () => {
    setLastMessage(null);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your photos to scan a receipt.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleScan = async () => {
    if (!imageUri) {
      Alert.alert('Select a photo', 'Pick a receipt photo first.');
      return;
    }

    try {
      setLoading(true);
      setLastMessage(null);
      const result = await scanReceipt(imageUri);
      setLastMessage('Receipt scanned successfully via AWS Textract.');
      // For now we do not show the raw JSON; that will come in a later iteration.
      console.log('Textract result', result.raw);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to scan receipt.';
      setLastMessage(message);
      Alert.alert('Scan failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Scan a receipt</Text>
        <Text style={styles.subtitle}>
          Pick a receipt photo and send it to pantri&apos;s backend. For the MVP, we just confirm that
          AWS Textract processed the image.
        </Text>

        <View style={styles.cameraMock}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <Text style={styles.cameraText}>No photo selected yet.</Text>
          )}
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Choose photo" onPress={handlePickImage} disabled={loading} />
          <View style={styles.spacing} />
          <PrimaryButton
            label={loading ? 'Scanning…' : 'Send to server'}
            onPress={handleScan}
            loading={loading}
          />
          {lastMessage && (
            <View style={styles.helperTextContainer}>
              <Text style={styles.helperText}>{lastMessage}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.sm
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.xl
  },
  cameraMock: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16
  },
  cameraText: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 14
  },
  actions: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg
  },
  spacing: {
    height: spacing.md
  },
  helperTextContainer: {
    marginTop: spacing.sm
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 13
  }
});

export default ReceiptScanScreen;

