import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { PantryItem } from '@types/pantry';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

interface Props {
  item: PantryItem;
  onMarkUsed: () => void;
  onRemove: () => void;
}

const PantryItemCard: React.FC<Props> = ({ item, onMarkUsed, onRemove }) => {
  const expDate = item.expirationDate ? new Date(item.expirationDate) : null;
  const now = new Date();
  const isExpired = expDate ? expDate.getTime() < now.getTime() : false;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{item.name}</Text>
        {expDate && (
          <Text style={[styles.chip, isExpired && styles.chipExpired]}>
            {isExpired ? 'Expired' : `Exp: ${expDate.toLocaleDateString()}`}
          </Text>
        )}
      </View>
      {(item.quantity || item.unit) && (
        <Text style={styles.meta}>
          {item.quantity} {item.unit}
        </Text>
      )}
      <View style={styles.actionsRow}>
        <Pressable onPress={onMarkUsed} style={styles.secondaryButton}>
          <Text style={styles.secondaryLabel}>Mark used</Text>
        </Pressable>
        <Pressable onPress={onRemove} style={styles.dangerButton}>
          <Text style={styles.dangerLabel}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600'
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.surfaceAlt,
    color: colors.textMuted,
    fontSize: 12
  },
  chipExpired: {
    backgroundColor: colors.danger,
    color: colors.background
  },
  meta: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.md
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md
  },
  secondaryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    backgroundColor: colors.surfaceAlt
  },
  secondaryLabel: {
    color: colors.text,
    fontSize: 14
  },
  dangerButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    backgroundColor: colors.danger
  },
  dangerLabel: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '500'
  }
});

export default PantryItemCard;

