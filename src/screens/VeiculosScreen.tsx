import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import type { Veiculo } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';
import ActionSearchBar from '../components/ActionSearchBar';
import ConfirmDialog from '../components/ConfirmDialog';
import ModalShell from '../components/ModalShell';
import SectionHero from '../components/SectionHero';

export default function VeiculosScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { veiculos, clientes, addVeiculo, updateVeiculo, deleteVeiculo } = useApp();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Veiculo | null>(null);
  const [form, setForm] = useState({ clienteId: '', marca: '', modelo: '', ano: '2024', placa: '', cor: '', quilometragem: '0' });
  const [errors, setErrors] = useState<{ clienteId?: string; marca?: string; modelo?: string; placa?: string }>({});
  const [pendingDelete, setPendingDelete] = useState<Veiculo | null>(null);

  const filtered = useMemo(() =>
    veiculos.filter(v =>
      v.modelo.toLowerCase().includes(search.toLowerCase()) ||
      v.placa.toLowerCase().includes(search.toLowerCase()) ||
      v.marca.toLowerCase().includes(search.toLowerCase())
    ),
    [veiculos, search]
  );

  const getClienteNome = (id: string) => clientes.find(c => c.id === id)?.nome || 'N/A';
  const associados = useMemo(() => veiculos.filter(v => !!v.clienteId).length, [veiculos]);

  const openAdd = () => {
    setEditing(null);
    setErrors({});
    setForm({ clienteId: clientes[0]?.id || '', marca: '', modelo: '', ano: '2024', placa: '', cor: '', quilometragem: '0' });
    setModalOpen(true);
  };
  const openEdit = (v: Veiculo) => {
    setEditing(v);
    setErrors({});
    setForm({ clienteId: v.clienteId, marca: v.marca, modelo: v.modelo, ano: String(v.ano), placa: v.placa, cor: v.cor, quilometragem: String(v.quilometragem) });
    setModalOpen(true);
  };
  const save = () => {
    const nextErrors: typeof errors = {};
    if (!form.clienteId) nextErrors.clienteId = 'Selecione o cliente proprietário do veículo.';
    if (!form.marca.trim()) nextErrors.marca = 'Informe a marca do veículo.';
    if (!form.modelo.trim()) nextErrors.modelo = 'Informe o modelo do veículo.';
    if (!form.placa.trim()) nextErrors.placa = 'Informe a placa para identificar o veículo.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (editing) {
      updateVeiculo({ ...editing, clienteId: form.clienteId, marca: form.marca, modelo: form.modelo, ano: Number(form.ano), placa: form.placa, cor: form.cor, quilometragem: Number(form.quilometragem) });
    } else {
      addVeiculo({ ...form as any, clienteId: form.clienteId || clientes[0]?.id });
    }
    setModalOpen(false);
  };

  return (
    <Screen scroll={false}>
      <FlatList
        data={filtered}
        keyExtractor={v => v.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 120 + insets.bottom }]}
        ListHeaderComponent={
          <>
            <SectionHero
              eyebrow="Frota e histórico"
              title="Gerencie os veículos com mais contexto e agilize o atendimento da oficina."
              subtitle="Encontre veículos rapidamente, acompanhe vínculos com clientes e mantenha a operação mais organizada."
              image="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
              stats={[
                { icon: 'car-outline', value: String(veiculos.length), label: 'Veículos' },
                { icon: 'person-outline', value: String(associados), label: 'Associados a clientes' },
                { icon: 'search-outline', value: String(filtered.length), label: 'Encontrados' },
              ]}
            />
            <ActionSearchBar placeholder="Buscar veículo..." value={search} onChangeText={setSearch} onActionPress={openAdd} />
          </>
        }
        renderItem={({ item }) => (
          <Card onPress={() => openEdit(item)}>
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: t.bg }]}>
                <Text style={{ fontSize: 28 }}>🚗</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: t.text }]}>{item.marca} {item.modelo}</Text>
                <Text style={{ color: t.textSecondary, fontSize: 13 }}>
                  {item.ano} • {item.cor} • {item.placa}
                </Text>
                <Text style={{ color: t.primary, fontSize: 12, fontWeight: '500' }}>
                  {getClienteNome(item.clienteId)} • {item.quilometragem.toLocaleString('pt-BR')} km
                </Text>
              </View>
              <TouchableOpacity onPress={() => setPendingDelete(item)} style={{ padding: 8 }}>
                <Ionicons name="trash-outline" size={20} color={t.danger} />
              </TouchableOpacity>
            </View>
          </Card>
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: t.textMuted }]}>Nenhum veículo encontrado</Text>}
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: t.primary, bottom: 82 + insets.bottom }]} onPress={openAdd}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      <ModalShell
        visible={modalOpen}
        title={editing ? 'Editar veículo' : 'Novo veículo'}
        subtitle="Cadastre os dados do veículo para agilizar diagnósticos e histórico de atendimento."
        onClose={() => setModalOpen(false)}
        scrollable={true}
        footer={
          <View style={styles.modalActions}>
            <Button title="Cancelar" variant="outline" onPress={() => setModalOpen(false)} fullWidth style={styles.modalActionButton} />
            <Button title={editing ? 'Salvar' : 'Adicionar'} variant="success" onPress={save} fullWidth style={styles.modalActionButton} />
          </View>
        }
      >
        <Text style={[styles.fieldLabel, { color: t.textSecondary }]}>Cliente</Text>
        <View style={styles.selectorRow}>
          {clientes.map(cliente => {
            const selected = form.clienteId === cliente.id;
            return (
              <TouchableOpacity
                key={cliente.id}
                style={[styles.selectorChip, { backgroundColor: selected ? t.primary : t.bg, borderColor: selected ? t.primary : t.border }]}
                onPress={() => setForm(current => ({ ...current, clienteId: cliente.id }))}
              >
                <Text style={{ color: selected ? '#FFF' : t.textSecondary, fontSize: 12, fontWeight: '600' }}>{cliente.nome}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.clienteId ? <Text style={[styles.fieldError, { color: t.danger }]}>{errors.clienteId}</Text> : null}
        <Input label="Marca" value={form.marca} onChangeText={v => setForm(f => ({ ...f, marca: v }))} error={errors.marca} />
        <Input label="Modelo" value={form.modelo} onChangeText={v => setForm(f => ({ ...f, modelo: v }))} error={errors.modelo} />
        <Input label="Ano" value={form.ano} onChangeText={v => setForm(f => ({ ...f, ano: v }))} keyboardType="numeric" />
        <Input label="Placa" value={form.placa} onChangeText={v => setForm(f => ({ ...f, placa: v.toUpperCase() }))} error={errors.placa} />
        <Input label="Cor" value={form.cor} onChangeText={v => setForm(f => ({ ...f, cor: v }))} />
        <Input label="Quilometragem" value={form.quilometragem} onChangeText={v => setForm(f => ({ ...f, quilometragem: v }))} keyboardType="numeric" />
      </ModalShell>

      <ConfirmDialog
        visible={!!pendingDelete}
        title="Excluir veículo"
        message={`Deseja remover ${pendingDelete ? `${pendingDelete.marca} ${pendingDelete.modelo}` : 'este veículo'} do cadastro?`}
        confirmLabel="Excluir"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteVeiculo(pendingDelete.id);
          }
          setPendingDelete(null);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 136 },
  fab: {
    position: 'absolute',
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 48, fontSize: 16 },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalActionButton: { flex: 1 },
  fieldLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  fieldError: { fontSize: 12, marginBottom: 12, marginTop: -4 },
  selectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  selectorChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, borderWidth: 1 },
});
