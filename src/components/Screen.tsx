import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAppMenu } from '../context/AppMenuContext';
import AppMenuButton from './AppMenuButton';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export default function Screen({ children, scroll = true, style, contentStyle }: Props) {
  const t = useTheme();
  const menu = useAppMenu();

  if (!scroll) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }, style]}>
        <View style={[styles.innerStatic, { backgroundColor: t.bg }]}> 
          {menu && (
            <View style={styles.menuRow}>
              <AppMenuButton />
            </View>
          )}
          <View style={[styles.contentStatic, contentStyle]}>{children}</View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }, style]}>
      <ScrollView contentContainerStyle={[styles.innerScroll, contentStyle]} showsVerticalScrollIndicator={false}>
        {menu && (
          <View style={styles.menuRow}>
            <AppMenuButton />
          </View>
        )}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  innerStatic: {
    flex: 1,
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  contentStatic: {
    flex: 1,
    minHeight: 0,
  },
  innerScroll: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuRow: {
    marginBottom: 12,
  },
});
