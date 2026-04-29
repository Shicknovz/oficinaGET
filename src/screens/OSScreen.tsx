import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableOpacity, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import type { OSSStatus, ItemOS } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';
import StatusBadge from '../components/StatusBadge';
import { formatCurrency, formatDate } from '../utils/helpers';

const STATUS_OPTIONS: { value: OSSStatus; label: string }[] = [
  { value: 'aberta', label: '📋 Aberta' },
  { value: 'em_andamento', label: '🔧 Em Andamento' },
  { value: 'aguardando_peca', label: '📦 Aguardando Peça' },
  { value: 'concluida', label: '✅ Concluída' },
  { value: 'cancelada', label: '❌ Cancelada' },
];

const FILTER_OPTIONS: Array<{ key: string; label: string }> = [
  { key: 'todos', label: 'Todas' },
  ...STATUS_OPTIONS.map((option) => ({ key: option.value, label: option.label })),
];

export default function OSScreen() {
  const t = useTheme();
  const { ordensServico, clientes, veiculos, addOS, updateOS, addOSItem } = useApp();
  const [filter, setFilter] = useState<string>('todos');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOS, setSelectedOS] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ clienteId: '', veiculoId: '', descricaoProblema: '', mecanicoResponsavel: 'Marcos' });
  const [statusModal, setStatusModal] = useState(false);
  const [itemForm, setItemForm] = useState<{ descricao: string; quantidade: string; valorUnitario: string; tipo: string }>({
    descricao: '', quantidade: '1', valorUnitario: '', tipo: 'mao_de_obra',
  });

  const getCliente = (id: string) => clientes.find(c => c.id === id);
  const getVeiculo = (id: string) => veiculos.find(v => v.id === id);

  const filtered = useMemo(() => {
    if (filter === 'todos') return ordensServico;
    return ordensServico.filter(o => o.status === filter);
  }, [ordensServico, filter]);

  const openDetail = (os: any) => { setSelectedOS(os); setDetailOpen(true); };
  const changeStatus = (os: any, status: OSSStatus) => {
    updateOS({ ...os, status });
    setSelectedOS({ ...os, status });
    setStatusModal(false);
  };

  const handleAddOS = () => {
    if (!addForm.descricaoProblema) return;
    const veiculo = veiculos.find(v => v.id === addForm.veiculoId);
    addOS({
      ...addForm,
      clienteId: veiculo?.clienteId || addForm.clienteId || clientes[0]?.id,
      status: 'aberta' as OSSStatus,
      itens: [],
      valorTotal: 0,
      valorPago: 0,
      dataEntrada: new Date().toISOString().split('T')[0],
    });
    setAddForm({ clienteId: '', veiculoId: '', descricaoProblema: '', mecanicoResponsavel: 'Marcos' });
    setModalOpen(false);
  };

  const handleAddItem = () => {
    if (!selectedOS || !itemForm.descricao) return;
    addOSItem(selectedOS.id, {
      descricao: itemForm.descricao,
      quantidade: Number(itemForm.quantidade),
      valorUnitario: Number(itemForm.valorUnitario),
      tipo: itemForm.tipo as 'mao_de_obra' | 'peca',
    });
    const updated = { ...selectedOS, itens: [...selectedOS.itens, { descricao: itemForm.descricao, quantidade: Number(itemForm.quantidade), valorUnitario: Number(itemForm.valorUnitario), tipo: itemForm.tipo } as ItemOS] };
    setSelectedOS(updated);
    setItemForm({ descricao: '', quantidade: '1', valorUnitario: '', tipo: 'mao_de_obra' });
  };

  return (
    <Screen scroll={false} contentStyle={styles.screenContent}>
      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterBar, { borderBottomColor: t.border }]}
        contentContainerStyle={styles.filterBarContent}
      >
        {FILTER_OPTIONS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, { backgroundColor: filter === f.key ? t.primary : t.bgCard, borderColor: t.border }]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={{ color: filter === f.key ? '#FFF' : t.textSecondary, fontWeight: '600', fontSize: 13 }}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* OS List */}
      <FlatList
        style={styles.list}
        data={filtered}
        keyExtractor={o => o.id}
        contentContainerStyle={styles.listContent}
        extraData={ordensServico}
        renderItem={({ item }) => {
          const cliente = getCliente(item.clienteId);
          const veiculo = getVeiculo(item.veiculoId);
          return (
            <Card onPress={() => openDetail(item)}>
              <View style={styles.osHeader}>
                <Text style={[styles.osId, { color: t.primary }]}>{item.id}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={[styles.osDesc, { color: t.text }]}>{item.descricaoProblema}</Text>
              <Text style={{ color: t.textSecondary, fontSize: 13 }}>
                {cliente?.nome} • {veiculo?.marca} {veiculo?.modelo} - {veiculo?.placa}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ color: t.textMuted, fontSize: 12 }}>{item.mecanicoResponsavel} • {formatDate(item.dataEntrada)}</Text>
                <Text style={[styles.osValue, { color: t.success }]}>{formatCurrency(item.valorTotal)}</Text>
              </View>
            </Card>
          );
        }}
        ListEmptyComponent={<Text style={[styles.empty, { color: t.textMuted }]}>Nenhuma OS encontrada</Text>}
      />

      {/* Add Button */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: t.primary }]} onPress={() => setModalOpen(true)}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Detail Modal */}
      <Modal visible={detailOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={[styles.modalContent, { backgroundColor: t.bgCard }]}>
            {selectedOS && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={[styles.modalTitle, { color: t.text }]}>{selectedOS.id}</Text>
                  <TouchableOpacity onPress={() => setDetailOpen(false)}>
                    <Ionicons name="close" size={28} color={t.textSecondary} />
                  </TouchableOpacity>
                </View>

                <StatusBadge status={selectedOS.status} />

                <TouchableOpacity style={[styles.statusBtn, { backgroundColor: t.bg }]} onPress={() => setStatusModal(true)}>
                  <Text style={{ color: t.textSecondary, fontSize: 13 }}>Alterar Status</Text>
                  <Ionicons name="chevron-forward" size={18} color={t.textSecondary} />
                </TouchableOpacity>

                <View style={[styles.detailSection, { borderBottomColor: t.border }]}>
                  <Text style={[styles.detailTitle, { color: t.text }]}>Veículo</Text>
                  <Text style={{ color: t.textSecondary }}>
                    {getVeiculo(selectedOS.veiculoId)?.marca} {getVeiculo(selectedOS.veiculoId)?.modelo} - {getVeiculo(selectedOS.veiculoId)?.placa}
                  </Text>
                  <Text style={{ color: t.textSecondary, marginTop: 4 }}>
                    {getCliente(selectedOS.clienteId)?.nome}
                  </Text>
                </View>

                <View style={[styles.detailSection, { borderBottomColor: t.border }]}>
                  <Text style={[styles.detailTitle, { color: t.text }]}>Problema</Text>
                  <Text style={{ color: t.textSecondary }}>{selectedOS.descricaoProblema}</Text>
                </View>

                <View style={[styles.detailSection, { borderBottomColor: t.border }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[styles.detailTitle, { color: t.text }]}>Itens ({selectedOS.itens?.length || 0})</Text>
                    <TouchableOpacity onPress={() => setItemForm({ descricao: '', quantidade: '1', valorUnitario: '', tipo: 'mao_de_obra' })}>
                      <Text style={{ color: t.primary, fontWeight: '600', fontSize: 14 }}>+ Adicionar</Text>
                    </TouchableOpacity>
                  </View>
                  {selectedOS.itens?.map((item: any, i: number) => (
                    <View key={i} style={styles.itemRow}>
                      <View>
                        <Text style={{ color: t.text, fontWeight: '500' }}>{item.descricao}</Text>
                        <Text style={{ color: t.textMuted, fontSize: 12 }}>{item.quantidade}x {formatCurrency(item.valorUnitario)}</Text>
                      </View>
                      <Text style={{ color: t.success, fontWeight: '700' }}>{formatCurrency(item.quantidade * item.valorUnitario)}</Text>
                    </View>
                  ))}
                </View>

                {itemForm.descricao && (
                  <Card>
                    <Text style={[styles.detailTitle, { color: t.text, marginBottom: 8 }]}>Novo Item</Text>
                    <Input label="Descrição" value={itemForm.descricao} onChangeText={v => setItemForm(f => ({ ...f, descricao: v }))} />
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <Input label="Qtd" value={itemForm.quantidade} onChangeText={v => setItemForm(f => ({ ...f, quantidade: v }))} keyboardType="numeric" containerStyle={styles.inlineInput} />
                      <Input label="Valor Unit." value={itemForm.valorUnitario} onChangeText={v => setItemForm(f => ({ ...f, valorUnitario: v }))} keyboardType="numeric" containerStyle={styles.inlineInput} />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                      {['mao_de_obra', 'peca'].map(tp => (
                        <TouchableOpacity key={tp} style={[styles.typeChip, { backgroundColor: itemForm.tipo === tp ? t.primary : t.bg, borderColor: t.border }]} onPress={() => setItemForm(f => ({ ...f, tipo: tp }))}>
                          <Text style={{ color: itemForm.tipo === tp ? '#FFF' : t.textSecondary, fontSize: 12 }}>{tp === 'mao_de_obra' ? 'Mão de Obra' : 'Peça'}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <Button title="Adicionar Item" variant="success" onPress={handleAddItem} fullWidth />
                  </Card>
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                  <Text style={{ color: t.textSecondary, fontSize: 16 }}>Total</Text>
                  <Text style={[styles.totalValue, { color: t.success }]}>{formatCurrency(selectedOS.valorTotal)}</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Status Change Modal */}
      <Modal visible={statusModal} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={[styles.modalContent, { backgroundColor: t.bgCard }]}>
            <Text style={[styles.modalTitle, { color: t.text, marginBottom: 16 }]}>Alterar Status</Text>
            {STATUS_OPTIONS.map(opt => (
              <TouchableOpacity key={opt.value} style={[styles.statusOption, { borderBottomColor: t.border }]} onPress={() => changeStatus(selectedOS, opt.value)}>
                <Text style={{ color: t.text, fontSize: 16 }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
            <Button title="Cancelar" variant="outline" onPress={() => setStatusModal(false)} fullWidth />
          </View>
        </View>
      </Modal>

      {/* Add OS Modal */}
      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={[styles.modalContent, { backgroundColor: t.bgCard }]}>
            <Text style={[styles.modalTitle, { color: t.text }]}>Nova Ordem de Serviço</Text>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              <Input label="Cliente" placeholder="Selecione um cliente" value={addForm.clienteId} onChangeText={v => setAddForm(f => ({ ...f, clienteId: v }))} />
              <Input label="Veículo ID (manual)" placeholder="ID do veículo" value={addForm.veiculoId} onChangeText={v => setAddForm(f => ({ ...f, veiculoId: v }))} />
              <Input label="Descrição do Problema" value={addForm.descricaoProblema} onChangeText={v => setAddForm(f => ({ ...f, descricaoProblema: v }))} multiline numberOfLines={3} />
              <Input label="Mecânico" value={addForm.mecanicoResponsavel} onChangeText={v => setAddForm(f => ({ ...f, mecanicoResponsavel: v }))} />
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <Button title="Cancelar" variant="outline" onPress={() => setModalOpen(false)} fullWidth style={{ flex: 1 }} />
              <Button title="Criar OS" variant="success" onPress={handleAddOS} fullWidth style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenContent: { flex: 1, minHeight: 0 },
  filterBar: { flexGrow: 0, borderBottomWidth: 1 },
  filterBarContent: { paddingVertical: 10, paddingHorizontal: 16, alignItems: 'center' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 136 },
  fab: {
    position: 'absolute',
    bottom: 82,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 18px 28px rgba(6, 13, 28, 0.32)' }
      : { elevation: 10, shadowColor: '#000', shadowOpacity: 0.32, shadowRadius: 12 }),
  },
  osHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  osId: { fontSize: 15, fontWeight: '700' },
  osDesc: { fontSize: 15, marginBottom: 4 },
  osValue: { fontSize: 16, fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 48, fontSize: 16 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { borderRadius: 20, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  statusBtn: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, marginTop: 10, marginBottom: 14, alignItems: 'center' },
  detailSection: { paddingVertical: 12, borderBottomWidth: 1 },
  detailTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  totalValue: { fontSize: 22, fontWeight: '800' },
  statusOption: { paddingVertical: 14, borderBottomWidth: 1 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  inlineInput: { flex: 1 },
});
