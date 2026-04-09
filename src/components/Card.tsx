import React from 'react';
import { View, StyleSheet, TouchableOpacity, type ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function Card({ children, onPress, style }: Props) {
  const t = useTheme();

  const content = (
    <View style={[styles.card, { backgroundColor: t.bgCard, borderColor: t.border }, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    marginVertical: 8,
    marginBottom: 8,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
});
