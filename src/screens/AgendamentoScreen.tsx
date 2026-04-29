import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import type { Agendamento } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';
import StatusBadge from '../components/StatusBadge';
import { formatDateTime } from '../utils/helpers';

export default function AgendamentoScreen() {
  const t = useTheme();
  const { agendamentos, clientes, veiculos, addAgendamento, updateAgendamento, deleteAgendamento } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ clienteId: '', descricao: '', data: '', hora: '09:00' });

  const getCliente = (id: string) => clientes.find(c => c.id === id)?.nome || '';
  const getVeiculo = (cid: string) => {
    const v = veiculos.find(v => v.clienteId === cid);
    return v ? `${v.marca} ${v.modelo}` : '';
  };

  const sorted = useMemo(() =>
    [...agendamentos].sort((a, b) => a.dataHora.localeCompare(b.dataHora)),
    [agendamentos]
  );

  const openDetail = (a: any) => { setSelected(a); setDetailOpen(true); };

  const handleAdd = () => {
    if (!form.descricao || !form.data) return;
    addAgendamento({
      clienteId: form.clienteId || clientes[0]?.id,
      veiculoId: veiculos.find(v => v.clienteId === (form.clienteId || clientes[0]?.id))?.id || '',
      descricao: form.descricao,
      dataHora: `${form.data}T${form.hora}:00`,
      status: 'pendente',
    });
    setForm({ clienteId: '', descricao: '', data: '', hora: '09:00' });
    setModalOpen(false);
  };

  const toggleConfirm = (a: Agendamento) => {
    updateAgendamento({ ...a, status: a.status === 'confirmado' ? 'pendente' : 'confirmado' });
    setSelected({ ...a, status: a.status === 'confirmado' ? 'pendente' : 'confirmado' });
  };

  return (
    <Screen scroll={false}>
      <FlatList
        data={sorted}
        keyExtractor={a => a.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Card onPress={() => openDetail(item)}>
            <View style={styles.agHeader}>
              <StatusBadge status={item.status} />
              <Text style={{ color: t.textMuted, fontSize: 12 }}>{formatDateTime(item.dataHora)}</Text>
            </View>
            <Text style={[styles.agDesc, { color: t.text }]}>{item.descricao}</Text>
            <Text style={{ color: t.textSecondary, fontSize: 13 }}>{getCliente(item.clienteId)} • {getVeiculo(item.clienteId)}</Text>
          </Card>
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: t.textMuted }]}>Nenhum agendamento</Text>}
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: t.primary }]} onPress={() => setModalOpen(true)}>
        <Ionicons name="calendar" size={26} color="#FFF" />
      </TouchableOpacity>

      {/* Detail Modal */}
      <Modal visible={detailOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          {selected && (
            <View style={[styles.modalContent, { backgroundColor: t.bgCard }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={[styles.modalTitle, { color: t.text }]}>Agendamento</Text>
                <TouchableOpacity onPress={() => setDetailOpen(false)}><Ionicons name="close" size={28} color={t.textSecondary} /></TouchableOpacity>
              </View>

              <StatusBadge status={selected.status} />

              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: t.textSecondary }]}>Descrição</Text>
                <Text style={[styles.detailValue, { color: t.text }]}>{selected.descricao}</Text>
              </View>
              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: t.textSecondary }]}>Data e Hora</Text>
                <Text style={[styles.detailValue, { color: t.text }]}>{formatDateTime(selected.dataHora)}</Text>
              </View>
              <View style={styles.detailSection}>
                <Text style={[styles.detailLabel, { color: t.textSecondary }]}>Cliente</Text>
                <Text style={[styles.detailValue, { color: t.text }]}>{getCliente(selected.clienteId)}</Text>
              </View>
              <View style={[styles.detailSection, { borderBottomWidth: 0 }]}>
                <Text style={[styles.detailLabel, { color: t.textSecondary }]}>Veículo</Text>
                <Text style={[styles.detailValue, { color: t.text }]}>{getVeiculo(selected.clienteId)}</Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                <Button title={selected.status === 'confirmado' ? 'Desconfirmar' : 'Confirmar'} variant={selected.status === 'confirmado' ? 'outline' : 'success'} fullWidth onPress={() => toggleConfirm(selected)} />
                <Button title="Excluir" variant="danger" fullWidth onPress={() => { deleteAgendamento(selected.id); setDetailOpen(false); }} />
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* Add Modal */}
      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={[styles.modalContent, { backgroundColor: t.bgCard }]}>
            <Text style={[styles.modalTitle, { color: t.text }]}>Novo Agendamento</Text>
            <Input label="Descrição" value={form.descricao} onChangeText={v => setForm(f => ({ ...f, descricao: v }))} placeholder="Ex: Troca de óleo" />
            <Input label="Data" value={form.data} onChangeText={v => setForm(f => ({ ...f, data: v }))} placeholder="AAAA-MM-DD" />
            <Input label="Hora" value={form.hora} onChangeText={v => setForm(f => ({ ...f, hora: v }))} placeholder="HH:MM" />
            <Input label="Cliente (ID ou nome)" value={form.clienteId} onChangeText={v => setForm(f => ({ ...f, clienteId: v }))} />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <Button title="Cancelar" variant="outline" onPress={() => setModalOpen(false)} fullWidth style={{ flex: 1 }} />
              <Button title="Agendar" variant="success" onPress={handleAdd} fullWidth style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  agHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  agDesc: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
  empty: { textAlign: 'center', marginTop: 48, fontSize: 16 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.3)' }
      : { elevation: 6, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8 }),
  },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { borderRadius: 20, padding: 20, maxHeight: '70%' },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  detailSection: { paddingVertical: 12, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  detailLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  detailValue: { fontSize: 15 },
});
