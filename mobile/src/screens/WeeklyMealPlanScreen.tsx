import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import PrimaryButton from '@components/PrimaryButton';
import type { RootStackParamList } from '@navigation/RootNavigator';
import { fetchCurrentMealPlan, generateMealPlan } from '@services/api';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import type { MealPlan } from '@types/pantry';

type Props = NativeStackScreenProps<RootStackParamList, 'WeeklyMealPlan'>;

const WeeklyMealPlanScreen: React.FC<Props> = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMealPlan = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const currentPlan = await fetchCurrentMealPlan();
      setMealPlan(currentPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weekly plan');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMealPlan();
    }, [loadMealPlan])
  );

  const runGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);

      const nextPlan = await generateMealPlan();
      setMealPlan(nextPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate weekly plan');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerate = () => {
    if (!mealPlan) {
      void runGenerate();
      return;
    }

    Alert.alert(
      'Replace current plan?',
      'You already have a saved weekly plan. Generate a new one and replace it?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Replace', style: 'destructive', onPress: () => void runGenerate() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Weekly meal plan</Text>
        <Text style={styles.subtitle}>
          Generate one plan for the full week after you update your pantry. This is saved as your
          current plan until you replace it.
        </Text>

        <PrimaryButton
          label={generating ? "Generating this week's plan..." : "Generate This Week's Plan"}
          onPress={handleGenerate}
          loading={generating}
        />

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : mealPlan ? (
          <View style={styles.planSection}>
            <Text style={styles.planMeta}>
              Week of {new Date(mealPlan.weekStart).toLocaleDateString()}
            </Text>
            {mealPlan.days.map((day) => (
              <View key={day.id} style={styles.dayCard}>
                <Text style={styles.dayTitle}>{day.dayLabel}</Text>
                <View style={styles.slotRow}>
                  <Text style={styles.slotLabel}>Breakfast</Text>
                  <Text style={styles.slotValue}>{day.breakfast}</Text>
                </View>
                <View style={styles.slotRow}>
                  <Text style={styles.slotLabel}>Lunch</Text>
                  <Text style={styles.slotValue}>{day.lunch}</Text>
                </View>
                <View style={styles.slotRow}>
                  <Text style={styles.slotLabel}>Dinner</Text>
                  <Text style={styles.slotValue}>{day.dinner}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No weekly plan yet</Text>
            <Text style={styles.emptySubtitle}>
              Generate a plan after updating your pantry to get a simple Monday through Sunday meal
              outline.
            </Text>
          </View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>
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
    paddingHorizontal: spacing.lg
  },
  content: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl
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
  loadingState: {
    paddingVertical: spacing.xl,
    alignItems: 'center'
  },
  planSection: {
    marginTop: spacing.xl
  },
  planMeta: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.md
  },
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  dayTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md
  },
  slotRow: {
    marginBottom: spacing.sm
  },
  slotLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: spacing.xs
  },
  slotValue: {
    color: colors.text,
    fontSize: 15
  },
  emptyState: {
    marginTop: spacing.xl
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: 14
  },
  errorText: {
    color: colors.danger,
    marginTop: spacing.lg
  }
});

export default WeeklyMealPlanScreen;
