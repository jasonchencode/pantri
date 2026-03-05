import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { usePantry } from '@hooks/usePantry';
import PantryItemCard from '@components/PantryItemCard';
import PrimaryButton from '@components/PrimaryButton';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import type { RootStackParamList } from '@navigation/RootNavigator';
import { fetchMealIdeas } from '@services/api';
import type { MealIdea } from '@types/pantry';
import { useShowConfigAgain } from '@context/ServerConfigContext';
import { Pressable } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Pantry'>;

const PantryScreen: React.FC<Props> = ({ navigation }) => {
  const { items, loading, error, refresh, markStatus, removeItem } = usePantry();
  const [ideasLoading, setIdeasLoading] = React.useState(false);
  const showConfigAgain = useShowConfigAgain();

  const handleGenerateIdeas = async () => {
    try {
      setIdeasLoading(true);
      const ideas: MealIdea[] = await fetchMealIdeas();
      setIdeasLoading(false);
      navigation.navigate('MealIdeas', { ideas } as never);
    } catch (err) {
      setIdeasLoading(false);
      // For MVP we keep this simple; could add toast/snackbar later.
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>What&apos;s in your pantri?</Text>
          <Text style={styles.subtitle}>
            Add ingredients you already have to get waste-cutting meal ideas.
          </Text>
          {showConfigAgain && (
            <Pressable onPress={showConfigAgain} style={styles.changeServer}>
              <Text style={styles.changeServerText}>Change server address</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.actionButton}>
            <PrimaryButton
              label="Add ingredient"
              onPress={() => navigation.navigate('AddIngredient')}
            />
          </View>
          <View style={styles.actionButton}>
            <PrimaryButton
              label="Generate meals"
              onPress={handleGenerateIdeas}
              loading={ideasLoading}
            />
          </View>
        </View>

        {loading && items.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PantryItemCard
                  item={item}
                  onMarkUsed={() => markStatus(item.id, 'USED')}
                  onRemove={() => removeItem(item.id)}
                />
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>Your pantri is empty</Text>
                  <Text style={styles.emptySubtitle}>
                    Start by adding a few ingredients you already have in your fridge or cupboard.
                  </Text>
                </View>
              }
              contentContainerStyle={
                items.length === 0 ? styles.emptyContentContainer : styles.listContentContainer
              }
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />
              }
            />
          </>
        )}
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
  header: {
    marginBottom: spacing.lg
  },
  changeServer: {
    marginTop: spacing.sm
  },
  changeServerText: {
    color: colors.textMuted,
    fontSize: 13
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.sm
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg
  },
  actionButton: {
    flex: 1
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.md
  },
  emptyState: {
    alignItems: 'flex-start'
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
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  listContentContainer: {
    paddingBottom: spacing.xl
  }
});

export default PantryScreen;

