import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setApiBaseUrl, API_BASE_URL_STORAGE_KEY } from '@services/api';
import PrimaryButton from '@components/PrimaryButton';
import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

function normalizeApiUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return 'http://localhost:4000/api';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
  }
  const host = trimmed.replace(/^\/+|\/+$/g, '');
  return `http://${host}:4000/api`;
}

interface Props {
  onDone: () => void;
}

const ConfigScreen: React.FC<Props> = ({ onDone }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const url = normalizeApiUrl(input);

    setSaving(true);
    setError(null);
    try {
      await AsyncStorage.setItem(API_BASE_URL_STORAGE_KEY, url);
      setApiBaseUrl(url);
      onDone();
    } catch (e) {
      setError('Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Server address</Text>
        <Text style={styles.subtitle}>
          On a physical device, enter the IP address of the computer running the pantri API (e.g.
          192.168.1.5). On simulator you can leave default.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g. 192.168.1.5 or http://192.168.1.5:4000/api"
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!saving}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.button}>
          <PrimaryButton label="Save and continue" onPress={handleSave} loading={saving} />
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
    paddingTop: spacing.xl
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
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md
  },
  errorText: {
    color: colors.danger,
    marginBottom: spacing.md,
    fontSize: 14
  },
  button: {
    marginTop: spacing.md
  }
});

export default ConfigScreen;
