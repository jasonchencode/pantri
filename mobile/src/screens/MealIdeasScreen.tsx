import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import type { RootStackParamList } from '@navigation/RootNavigator';
import type { MealIdea } from '@types/pantry';

type Props = NativeStackScreenProps<RootStackParamList, 'MealIdeas'> & {
  route: {
    params?: {
      ideas?: MealIdea[];
    };
  };
};

const MealIdeasScreen: React.FC<Props> = ({ route }) => {
  const ideas = route.params?.ideas ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Meal ideas</Text>
        <Text style={styles.subtitle}>
          These are lightweight suggestions based on what you have. Remix them however you like.
        </Text>

        {ideas.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No ideas yet</Text>
            <Text style={styles.emptySubtitle}>
              Try adding a few more ingredients to your pantri, then generate ideas again.
            </Text>
          </View>
        ) : (
          ideas.map((idea, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{idea.title}</Text>
              <Text style={styles.cardBody}>{idea.description}</Text>
            </View>
          ))
        )}
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm
  },
  cardBody: {
    color: colors.textMuted,
    fontSize: 14
  },
  empty: {
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
  }
});

export default MealIdeasScreen;

