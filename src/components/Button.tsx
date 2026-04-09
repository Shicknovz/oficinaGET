import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'success' | 'danger' | 'outline';
  size?: 'default' | 'small';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export default function Button({ title, onPress, variant = 'primary', icon, disabled, loading, fullWidth, style }: Props) {
  const t = useTheme();

  const variantStyle: Record<string, ViewStyle> = {
    primary: { backgroundColor: t.primary },
    success: { backgroundColor: t.success },
    danger: { backgroundColor: t.danger },
    outline: { backgroundColor: 'transparent', borderColor: t.primary, borderWidth: 1 },
  };

  const textColor = variant === 'outline' ? t.primary : '#FFFFFF';

  return (
    <TouchableOpacity
      style={[styles.button, fullWidth && styles.fullWidth, variantStyle[variant], { opacity: disabled ? 0.6 : 1 }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={textColor} style={{ marginRight: 8 }} />}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  fullWidth: { width: '100%' },
  text: { fontSize: 16, fontWeight: '600' },
});
