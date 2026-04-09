import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate } from '../utils/helpers';

type FilterType = 'todas' | 'receita' | 'despesa' | 'pendente';

export default function FinanceiroScreen() {
  const t = useTheme();
  const { transacoes, addTransacao } = useApp();
  const [filter, setFilter] = useState<FilterType>('todas');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ descricao: '', valor: '', metodo: 'pix', tipo: 'receita' as 'receita' | 'despesa' });

  const filtered = useMemo(() => {
    if (filter === 'pendente') return transacoes.filter(tr => tr.status === 'pendente');
    if (filter === 'receita' || filter === 'despesa') return transacoes.filter(tr => tr.tipo === filter);
    return transacoes;
  }, [transacoes, filter]);

  const receitas = transacoes.filter(tr => tr.tipo === 'receita' && tr.status === 'pago').reduce((s, tr) => s + tr.valor, 0);
  const despesas = transacoes.filter(tr => tr.tipo === 'despesa' && tr.status === 'pago').reduce((s, tr) => s + tr.valor, 0);
  const saldo = receitas - despesas;

  const handleAdd = () => {
    if (!form.descricao || !form.valor) return;
    addTransacao({ descricao: form.descricao, valor: Number(form.valor), metodo: form.metodo as any, tipo: form.tipo, status: 'pago', data: new Date().toISOString().split('T')[0] });
    setForm({ descricao: '', valor: '', metodo: 'pix', tipo: 'receita' });
    setModalOpen(false);
  };

  return (
    <Screen scroll={false}>
      {/* Summary Cards */}
      <View style={styles.summaryCards}>
        <View style={[styles.summaryCard, { backgroundColor: t.bgCard, borderColor: t.border }]}>
          <View style={[styles.sumIcon, { backgroundColor: t.successBg }]}>
            <Text style={{ fontSize: 20 }}>📈</Text>
          </View>
          <Text style={{ color: t.textSecondary, fontSize: 13, marginTop: 6 }}>Receitas</Text>
          <Text style={{ color: t.success, fontSize: 18, fontWeight: '800' }}>{formatCurrency(receitas)}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: t.bgCard, borderColor: t.border }]}>
          <View style={[styles.sumIcon, { backgroundColor: t.dangerBg }]}>
            <Text style={{ fontSize: 20 }}>📉</Text>
          </View>
          <Text style={{ color: t.textSecondary, fontSize: 13, marginTop: 6 }}>Despesas</Text>
          <Text style={{ color: t.danger, fontSize: 18, fontWeight: '800' }}>{formatCurrency(despesas)}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: t.bgCard, borderColor: t.border }]}>
          <View style={[styles.sumIcon, { backgroundColor: t.infoBg }]}>
            <Text style={{ fontSize: 20 }}>💰</Text>
          </View>
          <Text style={{ color: t.textSecondary, fontSize: 13, marginTop: 6 }}>Saldo</Text>
          <Text style={{ color: saldo >= 0 ? t.success : t.danger, fontSize: 18, fontWeight: '800' }}>{formatCurrency(saldo)}</Text>
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {[
          { key: 'todas', label: 'Todas', icon: 'list' },
          { key: 'receita', label: 'Receitas', icon: 'trending-up' },
          { key: 'despesa', label: 'Despesas', icon: 'trending-down' },
          { key: 'pendente', label: 'Pendentes', icon: 'time' },
        ].map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, { backgroundColor: filter === f.key ? t.primary : t.bgCard, borderColor: t.border }]}
            onPress={() => setFilter(f.key as FilterType)}
          >
            <Ionicons name={f.icon as any} size={14} color={filter === f.key ? '#FFF' : t.textSecondary} style={{ marginRight: 4 }} />
            <Text style={{ color: filter === f.key ? '#FFF' : t.textSecondary, fontWeight: '600', fontSize: 13 }}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transactions List */}
      <FlatList
        data={filtered}
        keyExtractor={tr => tr.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.txRow}>
              <View style={[styles.txIcon, { backgroundColor: item.tipo === 'receita' ? t.successBg : t.dangerBg }]}>
                <Text style={{ fontSize: 20 }}>{item.tipo === 'receita' ? '📈' : '📉'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.txDesc, { color: t.text }]}>{item.descricao}</Text>
                <Text style={{ color: t.textMuted, fontSize: 12 }}>
                  {item.metodo.toUpperCase()} • {item.data ? formatDate(item.data) : '-'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.txValue, { color: item.tipo === 'receita' ? t.success : t.danger }]}>
                  {item.tipo === 'despesa' ? '-' : '+'}{formatCurrency(item.valor)}
                </Text>
                <StatusBadge status={item.status as any} />
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: t.textMuted }]}>Nenhuma transação encontrada</Text>}
      />

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: t.primary }]} onPress={() => setModalOpen(true)}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={[styles.modalContent, { backgroundColor: t.bgCard }]}>
            <Text style={[styles.modalTitle, { color: t.text }]}>Nova Transação</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 8 }}>
              <TouchableOpacity style={[styles.typeChip, { backgroundColor: form.tipo === 'receita' ? t.success : t.bg, borderColor: t.border }]} onPress={() => setForm(f => ({ ...f, tipo: 'receita' }))}>
                <Text style={{ color: form.tipo === 'receita' ? '#FFF' : t.textSecondary }}>📈 Receita</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeChip, { backgroundColor: form.tipo === 'despesa' ? t.danger : t.bg, borderColor: t.border }]} onPress={() => setForm(f => ({ ...f, tipo: 'despesa' }))}>
                <Text style={{ color: form.tipo === 'despesa' ? '#FFF' : t.textSecondary }}>📉 Despesa</Text>
              </TouchableOpacity>
            </View>
            <Input label="Descrição" value={form.descricao} onChangeText={v => setForm(f => ({ ...f, descricao: v }))} />
            <Input label="Valor" value={form.valor} onChangeText={v => setForm(f => ({ ...f, valor: v }))} keyboardType="numeric" />
            <Text style={{ color: t.textSecondary, fontSize: 13, marginBottom: 6, fontWeight: '600' }}>Método</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              {['pix', 'dinheiro', 'cartao', 'boleto'].map(m => (
                <TouchableOpacity key={m} style={[styles.methodChip, { backgroundColor: form.metodo === m ? t.primary : t.bg, borderColor: t.border }]} onPress={() => setForm(f => ({ ...f, metodo: m }))}>
                  <Text style={{ color: form.metodo === m ? '#FFF' : t.textSecondary, fontSize: 11, textTransform: 'capitalize' }}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button title="Cancelar" variant="outline" onPress={() => setModalOpen(false)} fullWidth style={{ flex: 1 }} />
              <Button title="Adicionar" variant="success" onPress={handleAdd} fullWidth style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  summaryCards: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, gap: 10 },
  summaryCard: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  sumIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  filterBar: { paddingVertical: 10, paddingHorizontal: 16, flexDirection: 'row' },
  filterChip: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8, alignItems: 'center' },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  txIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  txDesc: { fontSize: 15, fontWeight: '500' },
  txValue: { fontSize: 15, fontWeight: '700' },
  typeChip: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  methodChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  empty: { textAlign: 'center', marginTop: 48, fontSize: 16 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
});
