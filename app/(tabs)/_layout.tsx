import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '../../src/context/SessionContext';
import { useTheme } from '../../src/context/ThemeContext';

function TabIcon({ name, focused, color, label }: { name: string; focused: boolean; color: string; label: string }) {
  return (
    <View style={styles.tabVisual}>
      <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
        <Ionicons name={name as keyof typeof Ionicons.glyphMap} size={22} color={color} />
      </View>
      <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const t = useTheme();
  const { loggedIn } = useSession();
  const insets = useSafeAreaInsets();

  if (!loggedIn) {
    return <Redirect href="/LoginScreen" />;
  }

  return (
    <Tabs
      screenOptions={() => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: t.bgCard,
          borderTopColor: t.border,
          borderTopWidth: 1,
          height: 76 + Math.max(insets.bottom, 10),
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 8,
          overflow: 'visible',
          ...(Platform.OS === 'web'
            ? { boxShadow: '0px -8px 24px rgba(4, 10, 24, 0.14)' }
            : {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 10,
              }),
        },
        tabBarItemStyle: { paddingTop: 2, paddingBottom: 2, justifyContent: 'center' },
        tabBarIconStyle: { marginTop: 0 },
        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.textMuted,
      })}
    >
      <Tabs.Screen
        name="HomeScreen/index"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused, color }) => <TabIcon name="grid" focused={focused} color={color} label="Início" />,
        }}
      />
      <Tabs.Screen
        name="ClientesScreen/index"
        options={{
          title: 'Clientes',
          tabBarIcon: ({ focused, color }) => <TabIcon name="people" focused={focused} color={color} label="Clientes" />,
        }}
      />
      <Tabs.Screen
        name="OSScreen/index"
        options={{
          title: 'OS',
          tabBarIcon: ({ focused, color }) => <TabIcon name="construct" focused={focused} color={color} label="OS" />,
        }}
      />
      <Tabs.Screen
        name="FinanceiroScreen/index"
        options={{
          title: 'Financeiro',
          tabBarIcon: ({ focused, color }) => <TabIcon name="wallet" focused={focused} color={color} label="Financeiro" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 68,
  },
  iconWrap: {
    width: 40,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapFocused: {
    backgroundColor: 'rgba(110, 168, 254, 0.14)',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    lineHeight: 12,
    textAlign: 'center',
  },
});
