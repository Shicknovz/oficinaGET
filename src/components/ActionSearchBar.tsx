import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  onActionPress?: () => void;
  actionIcon?: keyof typeof Ionicons.glyphMap;
}

export default function ActionSearchBar({
  placeholder,
  value,
  onChangeText,
  onActionPress,
  actionIcon = 'add',
}: Props) {
  const t = useTheme();

  return (
    <View style={[styles.shell, { backgroundColor: t.bgCard, borderColor: t.border }]}> 
      <View style={[styles.searchWrap, { backgroundColor: t.bgInput, borderColor: t.border }]}> 
        <Ionicons name="search-outline" size={18} color={t.textMuted} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: t.text }]}
          placeholder={placeholder}
          placeholderTextColor={t.textMuted}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      {onActionPress ? (
        <Pressable
          onPress={onActionPress}
          style={({ pressed }) => [styles.actionButton, { backgroundColor: t.primary, opacity: pressed ? 0.82 : 1 }]}
        >
          <Ionicons name={actionIcon} size={22} color="#FFFFFF" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 22,
    padding: 10,
    marginBottom: 14,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 11,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});