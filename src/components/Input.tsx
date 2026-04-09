import React from 'react';
import { TextInput, View, Text, StyleSheet, type TextInputProps, type ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export default function Input({ label, error, containerStyle, ...props }: Props) {
  const t = useTheme();
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: t.textSecondary }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: t.bgInput,
            borderColor: error ? t.danger : focused ? t.borderFocus : t.border,
            color: t.text,
          },
        ]}
        placeholderTextColor={t.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <Text style={[styles.error, { color: t.danger }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  error: { fontSize: 12, marginTop: 6 },
});
