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
import ModalShell from '../components/ModalShell';
import SectionHero from '../components/SectionHero';
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
  const confirmados = useMemo(() => agendamentos.filter(a => a.status === 'confirmado').length, [agendamentos]);
  const pendentes = useMemo(() => agendamentos.filter(a => a.status === 'pendente').length, [agendamentos]);

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
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <SectionHero
            eyebrow="Agenda da oficina"
            title="Organize atendimentos com clareza e mantenha a rotina da oficina sob controle."
            subtitle="Visualize compromissos, acompanhe confirmações e entregue uma experiência mais profissional desde o agendamento."
            image="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1600&q=80"
            stats={[
              { icon: 'calendar-outline', value: String(sorted.length), label: 'Agendamentos' },
              { icon: 'time-outline', value: String(pendentes), label: 'Pendentes' },
              { icon: 'checkmark-done-outline', value: String(confirmados), label: 'Confirmados' },
            ]}
          />
        }
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

      {selected && (
        <ModalShell
          visible={detailOpen}
          title="Detalhes do agendamento"
          subtitle="Consulte informações do compromisso e atualize o status com rapidez."
          onClose={() => setDetailOpen(false)}
          footer={
            <View style={styles.modalActions}>
              <Button title={selected.status === 'confirmado' ? 'Desconfirmar' : 'Confirmar'} variant={selected.status === 'confirmado' ? 'outline' : 'success'} fullWidth onPress={() => toggleConfirm(selected)} style={styles.modalActionButton} />
              <Button title="Excluir" variant="danger" fullWidth onPress={() => { deleteAgendamento(selected.id); setDetailOpen(false); }} style={styles.modalActionButton} />
            </View>
          }
        >
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
        </ModalShell>
      )}

      <ModalShell
        visible={modalOpen}
        title="Novo agendamento"
        subtitle="Cadastre um compromisso e mantenha a agenda da oficina organizada."
        onClose={() => setModalOpen(false)}
        footer={
          <View style={styles.modalActions}>
            <Button title="Cancelar" variant="outline" onPress={() => setModalOpen(false)} fullWidth style={styles.modalActionButton} />
            <Button title="Agendar" variant="success" onPress={handleAdd} fullWidth style={styles.modalActionButton} />
          </View>
        }
      >
        <Input label="Descrição" value={form.descricao} onChangeText={v => setForm(f => ({ ...f, descricao: v }))} placeholder="Ex: Troca de óleo" />
        <Input label="Data" value={form.data} onChangeText={v => setForm(f => ({ ...f, data: v }))} placeholder="AAAA-MM-DD" />
        <Input label="Hora" value={form.hora} onChangeText={v => setForm(f => ({ ...f, hora: v }))} placeholder="HH:MM" />
        <Input label="Cliente (ID ou nome)" value={form.clienteId} onChangeText={v => setForm(f => ({ ...f, clienteId: v }))} />
      </ModalShell>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 136 },
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
  modalActions: { flexDirection: 'row', gap: 10 },
  modalActionButton: { flex: 1 },
  detailSection: { paddingVertical: 12, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  detailLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  detailValue: { fontSize: 15 },
});
