import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, Platform, type ViewStyle } from 'react-native';
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

export default function Button({ title, onPress, variant = 'primary', size = 'default', icon, disabled, loading, fullWidth, style }: Props) {
  const t = useTheme();

  const variantStyle: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: t.primary,
      ...(Platform.OS === 'web' ? { boxShadow: '0px 12px 24px rgba(79, 125, 255, 0.28)' } : { shadowColor: t.primaryDark, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.22, shadowRadius: 14, elevation: 4 }),
    },
    success: {
      backgroundColor: t.success,
      ...(Platform.OS === 'web' ? { boxShadow: '0px 12px 24px rgba(34, 197, 94, 0.22)' } : { shadowColor: t.success, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 14, elevation: 4 }),
    },
    danger: {
      backgroundColor: t.danger,
      ...(Platform.OS === 'web' ? { boxShadow: '0px 12px 24px rgba(255, 107, 107, 0.2)' } : { shadowColor: t.danger, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 14, elevation: 4 }),
    },
    outline: { backgroundColor: 'rgba(255,255,255,0.02)', borderColor: t.borderFocus, borderWidth: 1 },
  };

  const textColor = variant === 'outline' ? t.primary : '#FFFFFF';

  return (
    <TouchableOpacity
      style={[styles.button, size === 'small' && styles.smallButton, fullWidth && styles.fullWidth, variantStyle[variant], { opacity: disabled ? 0.6 : 1 }, style]}
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
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  fullWidth: { width: '100%' },
  text: { fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
});
