import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, type ViewStyle } from 'react-native';
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
      <TouchableOpacity onPress={onPress} activeOpacity={0.86}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginVertical: 8,
    marginBottom: 8,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 10px 30px rgba(5, 10, 22, 0.18)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.14,
          shadowRadius: 18,
          elevation: 5,
        }),
  },
});
