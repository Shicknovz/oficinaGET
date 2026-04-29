import React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { AppMenuProvider } from '../context/AppMenuContext';

import DashboardScreen from '../screens/DashboardScreen';
import ClientesScreen from '../screens/ClientesScreen';
import VeiculosScreen from '../screens/VeiculosScreen';
import OSScreen from '../screens/OSScreen';
import AgendamentoScreen from '../screens/AgendamentoScreen';
import EstoqueScreen from '../screens/EstoqueScreen';
import FinanceiroScreen from '../screens/FinanceiroScreen';

interface MainTabsProps {
  onLogout: () => void;
}

const Tab = createBottomTabNavigator<any>();

function TabIcon({ name, focused, color, label }: { name: string; focused: boolean; color: string; label: string }) {
  return (
    <View style={styles.tabVisual}>
      <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
        <Ionicons name={name as any} size={22} color={color} />
      </View>
      <Text style={[styles.tabLabel, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const TABS = [
  { name: 'Dashboard', screen: DashboardScreen, icon: 'grid', label: 'Início' },
  { name: 'Clientes', screen: ClientesScreen, icon: 'people', label: 'Clientes' },
  { name: 'OS', screen: OSScreen, icon: 'construct', label: 'OS' },
  { name: 'Financeiro', screen: FinanceiroScreen, icon: 'wallet', label: 'Financeiro' },
];

export default function MainTabs({ onLogout }: MainTabsProps) {
  const t = useTheme();

  return (
    <AppMenuProvider onLogout={onLogout}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            const tab = TABS.find(tb => tb.name === route.name);
            return <TabIcon name={tab?.icon || 'home'} focused={focused} color={color} label={tab?.label || ''} />;
          },
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: t.bgCard,
            borderTopColor: t.border,
            borderTopWidth: 1,
            height: 86,
            paddingBottom: 10,
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
        {TABS.map(tab => (
          <Tab.Screen key={tab.name} name={tab.name} component={tab.screen} />
        ))}
      </Tab.Navigator>
    </AppMenuProvider>
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
