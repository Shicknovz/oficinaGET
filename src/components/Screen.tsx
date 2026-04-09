import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export default function Screen({ children, scroll = true, style, contentStyle }: Props) {
  const t = useTheme();

  const Container = (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }, style]}>
      <View style={[styles.inner, { backgroundColor: t.bg }, contentStyle]}>{children}</View>
    </SafeAreaView>
  );

  if (!scroll) return Container;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }, style]}>
      <ScrollView contentContainerStyle={[styles.inner, contentStyle]} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});
