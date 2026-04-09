import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import DashboardScreen from '../screens/DashboardScreen';
import ClientesScreen from '../screens/ClientesScreen';
import VeiculosScreen from '../screens/VeiculosScreen';
import OSScreen from '../screens/OSScreen';
import AgendamentoScreen from '../screens/AgendamentoScreen';
import EstoqueScreen from '../screens/EstoqueScreen';
import FinanceiroScreen from '../screens/FinanceiroScreen';

const Tab = createBottomTabNavigator<any>();

function TabIcon({ name, focused, color }: { name: string; focused: boolean; color: string; label: string }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name as any} size={24} color={color} />
    </View>
  );
}

const TABS = [
  { name: 'Dashboard', screen: DashboardScreen, icon: 'grid', label: 'Início' },
  { name: 'Clientes', screen: ClientesScreen, icon: 'people', label: 'Clientes' },
  { name: 'Veículos', screen: VeiculosScreen, icon: 'car', label: 'Veículos' },
  { name: 'OS', screen: OSScreen, icon: 'construct', label: 'OS' },
  { name: 'Agenda', screen: AgendamentoScreen, icon: 'calendar', label: 'Agenda' },
  { name: 'Estoque', screen: EstoqueScreen, icon: 'cube', label: 'Estoque' },
  { name: 'Financeiro', screen: FinanceiroScreen, icon: 'wallet', label: 'Financeiro' },
];

export default function MainTabs() {
  const t = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const tab = TABS.find(tb => tb.name === route.name);
          return <TabIcon name={tab?.icon || 'home'} focused={focused} color={color} label={tab?.label || ''} />;
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 0, marginBottom: 2 },
        tabBarStyle: {
          backgroundColor: t.bgCard,
          borderTopColor: t.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.textMuted,
      })}
    >
      {TABS.map(tab => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.screen} />
      ))}
    </Tab.Navigator>
  );
}
