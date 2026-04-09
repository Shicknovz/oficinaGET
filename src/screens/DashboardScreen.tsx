import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import Card from '../components/Card';
import Screen from '../components/Screen';

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  color: string;
  bgLight: string;
  bgDark: string;
}

function MetricCard({ icon, label, value, color, bgLight, bgDark }: MetricCardProps) {
  const t = useTheme();
  const isDark = t.bg === '#0D1117';

  return (
    <View style={[styles.metricCard, { backgroundColor: isDark ? bgDark : bgLight }]}>
      <Text style={{ fontSize: 24 }}>{icon}</Text>
      <Text style={[styles.metricLabel, { color: t.textSecondary }]}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const t = useTheme();
  const { clientes, veiculos, ordensServico, agendamentos, pecas, transacoes } = useApp();

  const osAbertas = ordensServico.filter(o => o.status === 'aberta').length;
  const osEmAndamento = ordensServico.filter(o => o.status === 'em_andamento').length;
  const osConcluidas = ordensServico.filter(o => o.status === 'concluida').length;
  const pecasBaixo = pecas.filter(p => p.quantidade < p.estoqueMinimo).length;
  const agendamentosHoje = agendamentos.length;

  const receita = transacoes.filter(tr => tr.tipo === 'receita' && tr.status === 'pago').reduce((s, tr) => s + tr.valor, 0);
  const despesas = transacoes.filter(tr => tr.tipo === 'despesa' && tr.status === 'pago').reduce((s, tr) => s + tr.valor, 0);
  const pendentes = transacoes.filter(tr => tr.status === 'pendente').reduce((s, tr) => s + tr.valor, 0);
  const ticketMedio = ordensServico.length > 0
    ? ordensServico.reduce((s, o) => s + o.valorTotal, 0) / ordensServico.length
    : 0;

  // Recent OS
  const recentesOS = [...ordensServico].sort((a, b) => b.dataEntrada.localeCompare(a.dataEntrada)).slice(0, 5);

  return (
    <Screen>
      <View style={[styles.header, { borderColor: t.border }]}>
        <View>
          <Text style={[styles.greeting, { color: t.textSecondary }]}>Bem-vindo ao</Text>
          <Text style={[styles.appName, { color: t.text }]}>AUTOGET</Text>
        </View>
        <View style={[styles.notificationBtn, { backgroundColor: t.bgCard }]}>
          <Text style={{ fontSize: 22 }}>{agendamentosHoje > 0 ? '🔔' : '✅'}</Text>
          {agendamentosHoje > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{agendamentosHoje}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Metric Grid */}
      <View style={styles.metricsGrid}>
        <MetricCard icon="👥" label="Clientes" value={String(clientes.length)} color={t.primary} bgLight={t.infoBg} bgDark="#0C1A2A" />
        <MetricCard icon="🚗" label="Veículos" value={String(veiculos.length)} color={t.primary} bgLight={t.infoBg} bgDark="#0C1A2A" />
        <MetricCard icon="📋" label="OS Abertas" value={String(osAbertas)} color={t.warning} bgLight={t.warningBg} bgDark="#1A1508" />
        <MetricCard icon="🔧" label="Em Andamento" value={String(osEmAndamento)} color={t.orange} bgLight={t.warningBg} bgDark="#1A1508" />
        <MetricCard icon="✅" label="Concluídas" value={String(osConcluidas)} color={t.success} bgLight={t.successBg} bgDark="#0D1A0F" />
        <MetricCard icon="📦" label="Peças Baixo Estoque" value={String(pecasBaixo)} color={t.danger} bgLight={t.dangerBg} bgDark="#1C0C0B" />
      </View>

      {/* Financial */}
      <Text style={[styles.sectionTitle, { color: t.text }]}>Financeiro</Text>
      <View style={styles.financialRow}>
        <View style={[styles.financialCard, { backgroundColor: t.bgCard, borderColor: t.border }]}>
          <View style={[styles.finIcon, { backgroundColor: t.successBg }]}>
            <Text style={{ fontSize: 20 }}>📈</Text>
          </View>
          <Text style={[styles.finLabel, { color: t.textSecondary }]}>Receitas</Text>
          <Text style={[styles.finValue, { color: t.success }]}>{formatCurrency(receita)}</Text>
        </View>
        <View style={[styles.financialCard, { backgroundColor: t.bgCard, borderColor: t.border }]}>
          <View style={[styles.finIcon, { backgroundColor: t.dangerBg }]}>
            <Text style={{ fontSize: 20 }}>📉</Text>
          </View>
          <Text style={[styles.finLabel, { color: t.textSecondary }]}>Despesas</Text>
          <Text style={[styles.finValue, { color: t.danger }]}>{formatCurrency(despesas)}</Text>
        </View>
      </View>
      <Card>
        <>
          <View style={styles.summaryRow}>
            <Text style={{ color: t.textSecondary, fontSize: 14 }}>Saldo Líquido</Text>
            <Text style={[styles.summaryValue, { color: receita - despesas >= 0 ? t.success : t.danger }]}> 
              {formatCurrency(receita - despesas)}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <View style={[styles.summaryRow, { marginTop: 8 }]}> 
            <Text style={{ color: t.textSecondary, fontSize: 14 }}>Pendentes</Text>
            <Text style={[styles.summaryValue, { color: t.warning }]}>{formatCurrency(pendentes)}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <View style={[styles.summaryRow, { marginTop: 8 }]}> 
            <Text style={{ color: t.textSecondary, fontSize: 14 }}>Ticket Médio</Text>
            <Text style={[styles.summaryValue, { color: t.primary }]}>{formatCurrency(ticketMedio)}</Text>
          </View>
        </>
      </Card>

      {/* Recent OS */}
      <Text style={[styles.sectionTitle, { color: t.text }]}>Ordens Recentes</Text>
      {recentesOS.map(os => (
        <Card key={os.id}>
          <View style={styles.osHeader}>
            <Text style={[styles.osId, { color: t.primary }]}>{os.id}</Text>
            <Text style={{ fontSize: 12, color: t.textMuted }}>{os.dataEntrada}</Text>
          </View>
          <Text style={[styles.osDesc, { color: t.text }]}>{os.descricaoProblema}</Text>
          <View style={styles.osFooter}>
            <Text style={{ color: t.textSecondary, fontSize: 13 }}>{os.mecanicoResponsavel}</Text>
            <Text style={[styles.osValue, { color: t.success }]}>{formatCurrency(os.valorTotal)}</Text>
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  greeting: { fontSize: 14 },
  appName: { fontSize: 26, fontWeight: '800' },
  notificationBtn: { position: 'relative', padding: 10, borderRadius: 12 },
  badge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#F85149', borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 10 },
  metricCard: { width: '47%', padding: 14, borderRadius: 12 },
  metricLabel: { fontSize: 12, marginTop: 6, fontWeight: '500' },
  metricValue: { fontSize: 22, fontWeight: '800', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  financialRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  financialCard: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1 },
  finIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  finLabel: { fontSize: 13, marginTop: 8 },
  finValue: { fontSize: 20, fontWeight: '800', marginTop: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryValue: { fontSize: 18, fontWeight: '700' },
  divider: { height: 1, marginVertical: 10 },
  osHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  osId: { fontSize: 14, fontWeight: '700' },
  osDesc: { fontSize: 15, marginVertical: 4 },
  osFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  osValue: { fontSize: 16, fontWeight: '700' },
});
