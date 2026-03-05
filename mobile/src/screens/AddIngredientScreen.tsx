import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import PrimaryButton from '@components/PrimaryButton';
import type { RootStackParamList } from '@navigation/RootNavigator';
import { usePantry } from '@hooks/usePantry';

type Props = NativeStackScreenProps<RootStackParamList, 'AddIngredient'>;

const AddIngredientScreen: React.FC<Props> = ({ navigation }) => {
  const { addItem } = usePantry();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await addItem({
        name: name.trim(),
        quantity: quantity.trim() || undefined,
        unit: unit.trim() || undefined,
        expirationDate: expirationDate.trim() || undefined
      });
      navigation.goBack();
    } catch {
      setError('Failed to save ingredient. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isValidDate = (value: string) => {
    if (!value) return true;
    // Basic YYYY-MM-DD check; rely on backend for stricter validation.
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  };

  const dateError = expirationDate && !isValidDate(expirationDate) ? 'Use YYYY-MM-DD format' : null;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>New ingredient</Text>
          <Text style={styles.subtitle}>
            Keep it simple – add what you actually have so pantri can suggest realistic meals.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Eggs"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, styles.rowItem]}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 6"
                placeholderTextColor={colors.textMuted}
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
            <View style={[styles.field, styles.rowItem]}>
              <Text style={styles.label}>Unit</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. pcs, cups"
                placeholderTextColor={colors.textMuted}
                value={unit}
                onChangeText={setUnit}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Expiration date (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
              value={expirationDate}
              onChangeText={setExpirationDate}
            />
            {dateError && <Text style={styles.validation}>{dateError}</Text>}
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.buttonContainer}>
            <PrimaryButton
              label="Save ingredient"
              onPress={handleSubmit}
              loading={submitting}
              disabled={!name.trim() || !!dateError}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
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
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.sm
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.xl
  },
  field: {
    marginBottom: spacing.md
  },
  label: {
    color: colors.text,
    marginBottom: spacing.xs,
    fontSize: 14
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md
  },
  rowItem: {
    flex: 1
  },
  validation: {
    color: colors.danger,
    marginTop: spacing.xs,
    fontSize: 12
  },
  error: {
    color: colors.danger,
    marginTop: spacing.sm,
    marginBottom: spacing.sm
  },
  buttonContainer: {
    marginTop: spacing.xl
  }
});

export default AddIngredientScreen;

