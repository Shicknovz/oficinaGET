import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import { themes } from '../utils/theme';
import Card from '../components/Card';
import Screen from '../components/Screen';
import type { Agendamento } from '../types';

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
  const backgroundColor = t === themes.dark ? bgDark : bgLight;

  return (
    <View style={[styles.metricCard, { backgroundColor, borderColor: t.border }]}> 
      <View style={[styles.metricIconWrap, { backgroundColor: `${color}20` }]}>
        <Text style={[styles.metricIcon, { color }]}>{icon}</Text>
      </View>
      <Text style={[styles.metricLabel, { color: t.textSecondary }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: t.text }]}>{value}</Text>
    </View>
  );
}


function DashboardScreen() {
  const t = useTheme();
  const { clientes, veiculos, ordensServico, agendamentos, pecas, transacoes, updateAgendamento } = useApp();
  const [notifVisible, setNotifVisible] = React.useState(false);

  const osAbertas = ordensServico.filter(o => o.status === 'aberta').length;
  const osEmAndamento = ordensServico.filter(o => o.status === 'em_andamento').length;
  const osConcluidas = ordensServico.filter(o => o.status === 'concluida').length;
  const pecasBaixo = pecas.filter(p => p.quantidade < p.estoqueMinimo).length;
  const getClienteNome = React.useCallback((clienteId: string) => clientes.find(cliente => cliente.id === clienteId)?.nome || 'Cliente não identificado', [clientes]);
  const getVeiculoNome = React.useCallback((veiculoId: string) => {
    const veiculo = veiculos.find(item => item.id === veiculoId);
    return veiculo ? `${veiculo.marca} ${veiculo.modelo}` : 'Veículo não identificado';
  }, [veiculos]);

  const notificacoes = React.useMemo(
    () => agendamentos
      .filter(agendamento => agendamento.status === 'confirmado' || agendamento.status === 'pendente')
      .sort((a, b) => a.dataHora.localeCompare(b.dataHora))
      .slice(0, 5),
    [agendamentos]
  );

  const agendamentosHoje = notificacoes.length;

  const receita = transacoes.filter(tr => tr.tipo === 'receita' && tr.status === 'pago').reduce((s, tr) => s + tr.valor, 0);
  const despesas = transacoes.filter(tr => tr.tipo === 'despesa' && tr.status === 'pago').reduce((s, tr) => s + tr.valor, 0);
  const pendentes = transacoes.filter(tr => tr.status === 'pendente').reduce((s, tr) => s + tr.valor, 0);
  const ticketMedio = ordensServico.length > 0
    ? ordensServico.reduce((s, o) => s + o.valorTotal, 0) / ordensServico.length
    : 0;

  // Recent OS
  const recentesOS = [...ordensServico].sort((a, b) => b.dataEntrada.localeCompare(a.dataEntrada)).slice(0, 5);

  const handleNotificationAction = React.useCallback((agendamento: Agendamento, status: Agendamento['status']) => {
    updateAgendamento({ ...agendamento, status });
  }, [updateAgendamento]);

  return (
    <Screen>
      <View style={[styles.header, { borderColor: t.border }]}> 
        <View>
          <Text style={[styles.greeting, { color: t.textSecondary }]}>Bem-vindo ao</Text>
          <Text style={[styles.appName, { color: t.text }]}>AUTOGET</Text>
          <Text style={[styles.headerSubtitle, { color: t.textMuted }]}>Sua oficina organizada em tempo real</Text>
        </View>
        <TouchableOpacity style={[styles.notificationBtn, { backgroundColor: t.bgCard }]} onPress={() => setNotifVisible(true)}>
          <Text style={{ fontSize: 22 }}>{agendamentosHoje > 0 ? '🔔' : '✅'}</Text>
          {agendamentosHoje > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{agendamentosHoje}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal de Notificações */}
      <Modal
        visible={notifVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setNotifVisible(false)}
      >
        <View style={styles.notifOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setNotifVisible(false)} />
          <View style={styles.notifContainer}>
            <Text style={[styles.menuTitle, { color: t.text }]}>Notificações</Text>
            {agendamentosHoje > 0 ? (
              <>
                <Text style={{ color: t.textSecondary, marginBottom: 14 }}>
                  Você tem {agendamentosHoje} notificação(ões) aguardando ação.
                </Text>
                {notificacoes.map(agendamento => (
                  <View key={agendamento.id} style={[styles.notificationCard, { borderColor: t.border, backgroundColor: t.bgCard }]}> 
                    <View style={styles.notificationHeader}>
                      <View style={[styles.notificationIcon, { backgroundColor: t.infoBg }]}>
                        <Text style={styles.notificationIconText}>🔔</Text>
                      </View>
                      <View style={styles.notificationMeta}>
                        <Text style={[styles.notificationTitle, { color: t.text }]}>Agendamento em aberto</Text>
                        <Text style={[styles.notificationSubtitle, { color: t.textSecondary }]}>
                          {getClienteNome(agendamento.clienteId)} • {getVeiculoNome(agendamento.veiculoId)}
                        </Text>
                      </View>
                    </View>

                    <Text style={[styles.notificationDescription, { color: t.text }]}>{agendamento.descricao}</Text>
                    <Text style={[styles.notificationDate, { color: t.textMuted }]}>{agendamento.dataHora.replace('T', ' • ').slice(0, 16)}</Text>

                    <View style={styles.notificationActions}>
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: t.successBg, borderColor: t.success }]}
                        onPress={() => handleNotificationAction(agendamento, 'pronto')}
                      >
                        <Text style={[styles.actionButtonText, { color: t.success }]}>Pronto</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: t.infoBg, borderColor: t.primary }]}
                        onPress={() => handleNotificationAction(agendamento, 'em_servico')}
                      >
                        <Text style={[styles.actionButtonText, { color: t.primary }]}>Em serviço</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: t.dangerBg, borderColor: t.danger }]}
                        onPress={() => handleNotificationAction(agendamento, 'cancelado')}
                      >
                        <Text style={[styles.actionButtonText, { color: t.danger }]}>Cancelado</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <Text style={{ color: t.textSecondary, marginBottom: 10 }}>Nenhuma notificação no momento.</Text>
            )}
            <TouchableOpacity style={styles.notifCloseBtn} onPress={() => setNotifVisible(false)}>
              <Text style={{ color: t.primary, fontWeight: '700' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

export default DashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, marginBottom: 6 },
  menuTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  notifOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 20 },
  notifContainer: { backgroundColor: '#131C2E', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#24324B' },
  notifCloseBtn: { alignSelf: 'flex-end', marginTop: 8, paddingVertical: 6, paddingHorizontal: 10 },
  notificationCard: { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 12 },
  notificationHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  notificationIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  notificationIconText: { fontSize: 18 },
  notificationMeta: { flex: 1 },
  notificationTitle: { fontSize: 15, fontWeight: '700' },
  notificationSubtitle: { fontSize: 12, marginTop: 3 },
  notificationDescription: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  notificationDate: { fontSize: 12, marginBottom: 12 },
  notificationActions: { flexDirection: 'row', gap: 8 },
  actionButton: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  actionButtonText: { fontSize: 12, fontWeight: '800' },
  greeting: { fontSize: 14 },
  appName: { fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  headerSubtitle: { fontSize: 12, marginTop: 4 },
  notificationBtn: { position: 'relative', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#24324B' },
  badge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#FF6B6B', borderRadius: 9, minWidth: 18, height: 18, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  metricCard: { width: '47%', padding: 16, borderRadius: 18, borderWidth: 1 },
  metricIconWrap: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  metricIcon: { fontSize: 22 },
  metricLabel: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  metricValue: { fontSize: 24, fontWeight: '800', marginTop: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '700', paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  financialRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  financialCard: { flex: 1, padding: 18, borderRadius: 18, borderWidth: 1 },
  finIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  finLabel: { fontSize: 13, marginTop: 8 },
  finValue: { fontSize: 18, fontWeight: '800', marginTop: 6 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryValue: { fontSize: 18, fontWeight: '700' },
  divider: { height: 1, marginVertical: 10 },
  osHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  osId: { fontSize: 14, fontWeight: '700' },
  osDesc: { fontSize: 15, marginVertical: 4 },
  osFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  osValue: { fontSize: 16, fontWeight: '700' },
});
