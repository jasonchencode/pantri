import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/RootNavigator';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import PrimaryButton from '@components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'ReceiptScan'>;

const ReceiptScanScreen: React.FC<Props> = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Scan a receipt</Text>
        <Text style={styles.subtitle}>
          This is a placeholder for the receipt scanning flow. We&apos;ll connect camera upload and
          Textract later.
        </Text>

        <View style={styles.cameraMock}>
          <Text style={styles.cameraText}>Receipt camera preview coming soon</Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Choose photo (coming soon)" onPress={() => {}} disabled />
          <View style={styles.helperTextContainer}>
            <Text style={styles.helperText}>
              Later this screen will let users choose or snap a receipt photo, review detected items,
              and add them to their pantri.
            </Text>
          </View>
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
  cameraText: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 14
  },
  actions: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg
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

