import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Variant = 'aberta' | 'em_andamento' | 'aguardando_peca' | 'concluida' | 'cancelada'
  | 'confirmado' | 'pendente' | 'pago' | 'atrasado' | 'receita' | 'despesa';

const CONFIG: Record<Variant, { label: string; bgLight: string; bgDark: string; textLight: string; icon: string }> = {
  aberta:               { label: 'Aberta', bgLight: '#D1F0FF', bgDark: '#0C1A2A', textLight: '#0969DA', icon: '📋' },
  em_andamento:         { label: 'Em Andamento', bgLight: '#FFF8C5', bgDark: '#1A1508', textLight: '#9A6700', icon: '🔧' },
  aguardando_peca:      { label: 'Aguardando Peça', bgLight: '#FFF8C5', bgDark: '#1A1508', textLight: '#D29922', icon: '📦' },
  concluida:            { label: 'Concluída', bgLight: '#E8F5EC', bgDark: '#0D1A0F', textLight: '#1A7F37', icon: '✅' },
  cancelada:            { label: 'Cancelada', bgLight: '#FFEBEC', bgDark: '#1C0C0B', textLight: '#CF222E', icon: '❌' },
  confirmado:           { label: 'Confirmado', bgLight: '#E8F5EC', bgDark: '#0D1A0F', textLight: '#1A7F37', icon: '📌' },
  pendente:             { label: 'Pendente', bgLight: '#FFF8C5', bgDark: '#1A1508', textLight: '#9A6700', icon: '⏳' },
  pago:                 { label: 'Pago', bgLight: '#E8F5EC', bgDark: '#0D1A0F', textLight: '#1A7F37', icon: '💰' },
  atrasado:             { label: 'Atrasado', bgLight: '#FFEBEC', bgDark: '#1C0C0B', textLight: '#CF222E', icon: '⚠️' },
  receita:              { label: 'Receita', bgLight: '#E8F5EC', bgDark: '#0D1A0F', textLight: '#1A7F37', icon: '📈' },
  despesa:              { label: 'Despesa', bgLight: '#FFEBEC', bgDark: '#1C0C0B', textLight: '#CF222E', icon: '📉' },
};

interface Props {
  status: Variant;
}

export default function StatusBadge({ status }: Props) {
  const t = useTheme();
  const c = CONFIG[status] || CONFIG.aberta;
  const isDark = t.bg === '#0D1117';

  return (
    <View style={[styles.badge, { backgroundColor: isDark ? c.bgDark : c.bgLight }]}>
      <View style={[styles.dot, { backgroundColor: c.textLight }]} />
      <Text style={[styles.text, { color: c.textLight }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  text: { fontSize: 12, fontWeight: '600' },
});
